module.exports={
	title: 'tytuł całej strony'
	,description: 'Opis strony głównej'
	,titleSeparator: ' @ ' //string oddzielający podtytuł strony od tytułu witryny
	,layout: 'main' //główny szablon, do którego wstawiane będą podstrony
	,frontPage: 'index' //nazwa szablonu ze stroną początkową (bez rozszerzenia; rozszerzenie = html)
	,less: {
		src: [//tablica plików less do przetworzenia (bez rozszerzenia; rozszerzenie = less) - stworzone pliki CSS będą mieć takie same nazwy jak pliki źródłowe
			'main'
		] 
		,dest: 'css' //katalog do którego mają być wrzucone przetworzone pliki CSS (dist/{distCSS})	
	} 
	,generateMenu: true //czy skrypt ma wygenerować menu (ordynarna lista linków stworzona na podstawie subpages)
	,includeFrontInMenu: 'Strona główna' //czy uwzględnić stronę główną w menu (i treść linku - jeśli falsy value, to nie dodaje)
	,uri: '/' //URI strony (z trailing slash)
	,subpages: { //podstrony
		//klucz - nazwa szablonu (bez rozszerzenia)
		'podstrona': {
			title: 'Tytuł podstrony' //tytuł podstrony - zostaw pusty jeśli ma być taki jak tytuł witryny
			,description: 'Opis podstrony'
			,menu: 'Podstrona' //treść linku w menu
		}
	}
	,sitemap: { //sitemap - jeśli nie chcesz jej generowania, zamiast tego obiektu przypisz tu false (więcej info o opcjach: http://www.sitemaps.org/protocol.html)
		fileName: 'sitemap' //nazwa pliku z sitemap (bez rozszerzenia; rozszerzenie = xml)
		,lastMod: true //czy dodać czas ostatniej aktualizacji (ustawiony na now)
		,changeFreq: 'never' //jak często strona się zmienia (jeśli nie chcesz tej opcji, wstaw false)
		/*TODO
		,images: [] //tablica z obrazkami do dołączenia do sitemap
		,videos: [] //tablica z filmikami do dołączenia do sitemap*/
	}
	,robots: [ //tu podaj nazwy plików, których nie powinny widzieć roboty
	]
	,humans: [ //lista ludzi, którzy zostaną dołączeni do zakładki team
		{
			title: 'Senior Developer' //stanowisko
			,name: 'Comandeer' //nick/imię i nazwisko
			,site: 'http://comandeer.w-mod.pl' //strona autora
		}
	]
	,manifest: {
		src: [ //lista plików do schachowania manifestem (mogą być regularne)
			'css/*.css'
			,'js/*.js'
			,'images/**/*' //to nie jest koniecznie dobry pomysł ;)
			,'fonts/**/*' //to też nie :P
		]
		,dest: 'manifest' //nazwa docelowego pliku manifestu (bez rozszerzenia; rozszerzenie = appcache)
	} 
	,optimizeImages:[ //nazwy folderów, z których powinny być zoptymalizowane obrazki
		'images'
	]
};