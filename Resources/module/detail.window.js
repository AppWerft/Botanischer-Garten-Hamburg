exports.create = function(_id) {
	function addImage(_img) {
		var row = Ti.UI.createTableViewRow();
		sections[0].add(row);
		var img = Ti.UI.createImageView({
			image : _img[0],
			width : 320,
			height : Ti.UI.SIZE
		});
		var scroll_view = Titanium.UI.createScrollView({
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			top : 0,
			showHorizontalScrollIndicator : false,
			showVerticalScrollIndicator : false,
			maxZoomScale : 5,
			minZoomScale : 1.0,
			backgroundColor : "transparent",
		});
		scroll_view.add(img);
		row.add(scroll_view);
		win.tv.data = sections;
	}

	var win = require('module/win').create('');
	var sections = [];
	win.tv = Ti.UI.createTableView({
		backgroundColor : 'transparent',
		top : 0
	});
	win.add(win.tv);
	require('module/model').getDetail(_id, function(_data) {
		sections = [Ti.UI.createTableViewSection({
			headerTitle : 'Pflanzenlichtbild'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Pflanzendaten'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Standorte im Botanischen Garten'
		})];
		sections[1].add(require('module/row').create('Familie', _data.familie, win));
		sections[1].add(require('module/row').create('Gattung Art', _data.gattung + ' ' + _data.art));
		win.title = _data.gattung + ' ' + _data.art
		if (_data.unterart)
			sections[1].add(require('module/row').create('Unterart', _data.unterart));
		if (_data.sorte)
			sections[1].add(require('module/row').create('Sorte', _data.sorte));
		sections[1].add(require('module/row').create('Deutscher Name', _data.deutsch));
		sections[2].add(require('module/row').create('Bereich', _data.bereich, win));
		win.tv.data = sections;
		//	win.tv.appendRow(require('module/row').create('Unterbereich', _data.unterbereich));
		win.add(Ti.UI.createImageView({
			bottom : 0,
			right : 0,
			width : 80,
			defaultImage : '',
			image : '/assets/' + _data.standort + '.png'
		}));

		require('vendor/wikipedia').getImages(_data.gattung + ' ' + _data.art, function(_img) {
			if (_img.length == 0) {
				require('vendor/wikipedia').getImages(_data.gattung, function(_img) {
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
