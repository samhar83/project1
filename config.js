module.exports={
	title: 'tytuł całej strony'
	,description: 'Opis strony głównej'
	,titleSeparator: ' @ ' //string oddzielający podtytuł strony od tytułu witryny
	,layout: 'main' //główny szablon, do którego wstawiane będą podstrony
	,frontPage: 'index' //nazwa szablonu ze stroną początkową
	,lessFiles: [
		'main'
	] //tablica plików less do przetworzenia (bez rozszerzenia; rozszerzenie = less) - stworzone pliki CSS będą mieć takie same nazwy jak pliki źródłowe
	,distCSS: '/css' //katalog do którego mają być wrzucone przetworzone pliki CSS (dist/{distCSS})
	,generateMenu: true //czy skrypt ma wygenerować menu (ordynarna lista linków stworzona na podstawie subpages)
	,includeFrontInMenu: 'Strona główna' //czy uwzględnić stronę główną w menu (i treść linku - jeśli falsy value, to nie dodaje)
	,uri: '/' //URI strony
	,subpages:{ //podstrony
		//klucz - nazwa szablonu (bez rozszerzenia)
		'podstrona':{
			title: 'Tytuł podstrony' //tytuł podstrony - zostaw pusty jeśli ma być taki jak tytuł witryny
			,description: 'Opis podstrony'
			,menu: 'Podstrona' //treść linku w menu
		}
	}
};