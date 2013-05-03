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
	require('module/model').getDetail(_data, function(_data) {
		var plant = _data.plantinfo;
		var standorte = _data.standorte;
		var latein = plant.gattung + ' ' + plant.art;
		sections = [Ti.UI.createTableViewSection({
			headerTitle : 'Pflanzenlichtbild'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Pflanzendaten'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Standorte im Botanischen Garten'
		})];
		sections[1].add(require('module/row').create('Familie', plant.familie, win));
		sections[1].add(require('module/row').create('Gattung Art', latein));
		win.title = plant.gattung + ' ' + plant.art
		if (plant.unterart)
			sections[1].add(require('module/row').create('Unterart', plant.unterart));
		if (plant.sorte)
			sections[1].add(require('module/row').create('Sorte', plant.sorte));
		sections[1].add(require('module/row').create('Deutscher Name', plant.deutsch));
		for (var key in standorte) {
			sections[2].add(require('module/row').create('Bereich', standorte[key].bereich + ' [' + standorte[key].total + ']', win, standorte[key].bereich));
		}
		win.tv.data = sections;
		//	win.tv.appendRow(require('module/row').create('Unterbereich', _data.unterbereich));
		win.add(Ti.UI.createImageView({
			bottom : 0,
			right : 0,
			width : 80,
			defaultImage : '',
			image : '/assets/' + plant.standort + '.png'
		}));
		require('vendor/wikipedia').getImages(latein, function(_img) {
			if (_img.length == 0) {
				require('vendor/wikipedia').getImages(plant.gattung, function(_img) {
					if (_img.length == 0)
						return;
					addImage(_img);
				});
				return;
			}
			addImage(_img);
		});
	});
	return win;
}
