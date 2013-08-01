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
		,manifest:{
			main:{
				options:{
					basePath:'dist'
					,verbose:true
					,timestamp:true
				}
				,src:[]
				,dest:'manifest'
			}
		}
		,imagemin:{
			main:{
				options:{
					optimizationLevel:7
					,progressive:true
				}
				,files:[]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-manifest');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('configure',function()
	{
		var less=config.less
		,dist=config.distCSS
		,manifest=config.manifest
		,images=config.optimizeImages
		,files={};

		//sprawdzenie czy URI ma trailing slash
		if(config.uri[config.uri.length-1]!='/')
			config.uri+='/';

		if(Array.isArray(less.src))
			less.src.forEach(function(t)
			{
				files['dist/'+less.dest+'/'+t+'.css']='less/'+t+'.less';
			});
		grunt.config.set('less.main.files',files);

		if(manifest)
		{
			grunt.config.set('manifest.main.src',manifest.src);
			grunt.config.set('manifest.main.dest','dist/'+manifest.dest+'.appcache');
		}

		if(Array.isArray(images)&&images.length>0)
			images.forEach(function(t)
			{
				grunt.config.set('imagemin.main.files',grunt.config.get('imagemin.main.files').concat(
				{
					expand:true
					,cwd:'dist/'+t
					,src:['**/*.png','**/*.gif','**/*.jpg']
					,dest:'dist/'+t
				}));
			});
	});

	grunt.registerTask('generateMenu',function()
	{
		if(!config.generateMenu)
			return;
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
	});

	grunt.registerTask('generateSitemap',function()
	{
		if(!config.sitemap)
			return;
		var uri=config.uri
		,subpages=config.subpages
		,sitemap=config.sitemap
		,now=new Date().toISOString()
		,content=['<?xml version="1.0" encoding="UTF-8" ?>\n<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'];

		content.push('<url>\n<loc>'+uri+'</loc>\n'+(sitemap.changeFreq?'<changefreq>'+sitemap.changeFreq+'</changefreq>\n':'')+(sitemap.lastMod?'<lastmod>'+now+'</lastmod>\n':'')+'</url>\n');

		Object.keys(subpages).forEach(function(t)
		{
			content.push('<url>\n<loc>'+uri+t+'.html</loc>\n'+(sitemap.changeFreq?'<changefreq>'+sitemap.changeFreq+'</changefreq>\n':'')+(sitemap.lastMod?'<lastmod>'+now+'</lastmod>\n':'')+'</url>\n')
		});

		content.push('</urlset>');

		fs.writeFileSync('dist/'+sitemap.fileName+'.xml',content.join('\n'),'utf8');
	});

	grunt.registerTask('generateRobotstxt',function()
	{
		var content=['user-agent: *']
		,robots=config.robots
		,sitemap=config.sitemap
		,uri=config.uri;

		if(robots.length<1)
			content.push('disallow: ');
		else
			robots.forEach(function(t)
			{
				content.push('disallow: '+t);
			});
		if(sitemap)
			content.push('sitemap: '+uri+sitemap.fileName+'.xml');
		fs.writeFileSync('dist/robots.txt',content.join('\n'),'utf8');
	});

	grunt.registerTask('generateHumanstxt',function()
	{
		var content=['/* TEAM */'];

		config.humans.forEach(function(t)
		{
			content.push(t.title+': '+t.name+'\nSite: '+t.site);
		});
		fs.writeFileSync('dist/humans.txt',content.join('\n'),'utf8');
	});

	grunt.registerTask('buildSubpages',function()
	{
		var layout=fs.readFileSync('templates/'+config.layout+'.html','utf8')
		,frontPage=fs.readFileSync('templates/'+config.frontPage+'.html','utf8')
		,subpages=config.subpages
		,replacer=function(template,data)
		{
			var output=layout.replace(/{CONTENT}/g,template);
			output=output.replace(/{DESCRIPTION}/g,data.description||config.description);
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
		,'generateMenu'
		,'generateRobotstxt'
		,'generateHumanstxt'
		,'generateSitemap'
		,'less:main'
		,'buildSubpages'
		,'manifest:main'
		,'imagemin:main'
	]);
};