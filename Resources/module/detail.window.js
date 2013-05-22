exports.create = function(_data) {
	function addImage(_img) {
		var row = Ti.UI.createTableViewRow();
		sections[0].add(row);
		var img = Ti.UI.createImageView({
			image : _img[0],
			defaultImage : 'assets/tree.png',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE
		});
		require('vendor/imageprogress').get({
			view : img,
			url : _img[0]
		});
		img.addEventListener('click', function(_e) {
			win.tab.open(require('module/image.window').create(_img, win.title))
		})
		row.add(img);
		win.tv.data = sections;
	}

	var win = require('module/win').create('');
	var sections = [];
	win.tv = Ti.UI.createTableView({
		backgroundColor : 'transparent',
		top : 0
	});
	win.add(win.tv);
	require('module/botanicgarden.model').getDetail(_data, function(_data) {
		var plant = _data.plantinfo;
		var standorte = _data.standorte;
		var latein = plant.gattung + ' ' + plant.art;
		sections = [Ti.UI.createTableViewSection({
			headerTitle : 'Pflanzenlichtbild'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Pflanzenstammdaten'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Standorte im Botanischen Garten'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Übersetzungen'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Wikipedia-Artikel'
		})];
		sections[1].add(require('module/detail.row').create({
			label : 'Ordnung',
			text : plant.ordnung,
		}, win));
		sections[1].add(require('module/detail.row').create({
			label : 'Familie',
			text : plant.familie
		}, win));
		sections[1].add(require('module/detail.row').create({
			label : 'Gattung Art',
			text : latein
		}, win));
		win.title = plant.deutsch;
		if (plant.unterart)
			sections[1].add(require('module/detail.row').create({
				label : 'Unterart',
				text : plant.unterart
			}));
		if (plant.sorte)
			sections[1].add(require('module/detail.row').create({
				label : 'Sorte',
				text : plant.sorte
			}));
		sections[1].add(require('module/detail.row').create({
			label : 'Deutscher Name',
			text : plant.deutsch
		}));
		for (var area in standorte) {
			sections[2].add(require('module/detail.row').create({
				label : 'Bereich',
				text : area + ' [' + standorte[area] + ']',
				area : area,
				standort : plant.standort
			}, win));
		}
		var wikirow = Ti.UI.createTableViewRow();
		var wikilangs = ['de'];

		for (var i = 0; i < wikilangs.length; i++) {
			wikirow.add(Ti.UI.createImageView({
				width : 100,
				height : Ti.UI.SIZE,
				left : i * 100,
				url : 'http://' + wikilangs[i] + '.m.wikipedia.org/wiki/' + plant.deutsch.replace(/ /, '_'),
				image : 'assets/wiki' + wikilangs[i] + '.png'
			}))
		}
		wikirow.addEventListener('click', function(_e) {
			if (_e.source.url) {
				win.tab.open(require('module/web.window').create(_e.source.url));
			}
		});
		sections[4].add(wikirow);
		win.tv.setData(sections);
		var languages = {
			'he' : 'השם בעברית של הצמח',
			'ar' : 'الاسم العربي للمصنع',
			'es' : 'Nombre español de la planta',
			'ca' : 'Nom de la planta català',
			'ja' : '日本の植物の名前',
			'el' : 'Ελληνική ονομασία των φυτών',
			'dk' : 'Dansk navn på planten',
			'hu' : 'Magyar növény nevét',
			'nl' : 'Hollandske navn for planten',
			'ru' : 'Русское название растения',
			'pl' : 'Polska nazwa zakładu',
			'cz' : 'Český název rostliny',
			'en' : 'English name of the plant',
			'tr' : 'Tesisin Türk adı',
			'fr' : 'Le nom de la plante en français',
			'it' : 'Nome italiano della pianta'
		};
		for (var lang in languages) {
			require('vendor/wikipedia').search4Article(lang, latein, function(_data) {
				sections[3].add(require('module/detail.row').create({
					label : languages[_data.lang],
					text : _data.title,
					textalign : (_data.dir == 'rtl') ? 'right' : 'left'
				}, win));
				win.tv.setData(sections);
			});
		}

		require('vendor/wikipedia').getImages(latein, function(_img) {
			if (_img.length == 0) {
				require('vendor/wikipedia').getImages(plant.deutsch, function(_img) {
					if (_img.length == 0) {
						require('vendor/wikipedia').getImages(plant.gattung, function(_img) {
							if (_img.length == 0)
								return;
							addImage(_img);
						});
						addImage(_img);
					}
				});
				return;
			}
			addImage(_img);
		});
	});
	return win;
}
