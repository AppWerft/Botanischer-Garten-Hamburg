exports.create = function(_id) {
	var win = require('module/win').create('');
	win.tv = Ti.UI.createTableView({
		backgroundColor : 'transparent',
		top : 0
	});
	win.add(win.tv);
	require('module/model').getDetail(_id, function(_data) {
		var sections = [Ti.UI.createTableViewSection({
			headerTitle : 'Pflanzenlichtbild'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Pflanzendaten'
		}), Ti.UI.createTableViewSection({
			headerTitle : 'Standorte im Botanischen Garten'
		})];
		win.tv.setData(sections);
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

		require('vendor/wikipedia').getImages(_data.gattung, function(_img) {
			if (_img.length == 0)
				return;
			var row = Ti.UI.createTableViewRow();
			row.add(Ti.UI.createImageView({
				image : _img[0],
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE
			}));
			sections[0].add(row);
			win.tv.data = sections;
		});
	});
	win.addEventListener('swipe', function() {
		win.close({
			animate : true
		});
	});
	return win;
}
