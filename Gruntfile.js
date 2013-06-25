//oparte na generatorze strony domowej Comandeera
module.exports = function(grunt) {
	"use strict";
	"use asm"; //żarcik taki :P
	//konfiguracja
	var config=require('./config')
	,fs=require('fs');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		,less:{
			main:{
				options:{
					yuicompress:true
				}
				,files:{
					'dist/main.css':'src/main.styl'
					,'dist/js/main.css':'src/js/main.styl'
				}
			}
		}
		,connect:{
			server:{
				options:{
					port: 8080
					,base: 'dist'
					,keepalive:true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('configure',function()
	{
		var less=config.lessFiles
		,dist=config.distCSS
		,files={};
		if(Array.isArray(less))
			less.forEach(function(t)
			{
				files['dist/'+dist+'/'+t+'.css']='less/'+t+'.less';
			});
		grunt.config.set('less.main.files',files);
		//generowanie menu
		if(config.generateMenu)
		{
			var subpages=config.subpages
			,menu=['<ul>'];
			if(typeof config.includeFrontInMenu === 'string'&&config.includeFrontInMenu.length>0)
				menu.push('<li><a href="'+config.frontPage+'.html">'+config.includeFrontInMenu+'</a></li>')
			Object.keys(subpages).forEach(function(t)
			{
				var current=subpages[t];
				menu.push('<li><a href="'+t+'.html">'+(current.menu||current.title)+'</a></li>');
			});
			menu.push('</ul>');
			config.menu=menu.join('\n');
		}
	});

	grunt.registerTask('build',function()
	{
		var layout=fs.readFileSync('templates/'+config.layout+'.html','utf8')
		,frontPage=fs.readFileSync('templates/'+config.frontPage+'.html','utf8')
		,subpages=config.subpages
		,replacer=function(template,data)
		{
			var output=layout.replace(/{CONTENT}/g,template);
			output=output.replace(/{URI}/g,config.uri);
			output=output.replace(/{MENU}/g,config.menu);
			output=output.replace(/{SITETITLE}/g,config.title);
			output=output.replace(/{TITLE}/g,data.title||'');
			output=output.replace(/{TITLESEPARATOR}/g,data.title&&config.titleSeparator||'');
			output=output.replace(/{YEAR}/g,new Date().getFullYear());
			//kompresja HTML
			output=output.replace(/\s{2,}/g,' ');
			output=output.replace(/<!--(.|\s)*?-->/g,'');
			output=output.replace(/>\s+</gi,'><');
			output=output.replace(/[\r\n]/g,'');
			return output;
		};
		Object.keys(subpages).forEach(function(t)
		{
			fs.writeFileSync('dist/'+t+'.html',replacer(fs.readFileSync('templates/'+t+'.html','utf8'),subpages[t]),'utf8');
		});
		fs.writeFileSync('dist/'+config.frontPage+'.html',replacer(fs.readFileSync('templates/'+config.frontPage+'.html','utf8'),{decription:config.description}),'utf8');
	});

	grunt.registerTask('default',[
		'configure'
		,'less:main'
		,'build'
	]);
};