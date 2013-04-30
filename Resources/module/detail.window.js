exports.create = function(_id) {
	var win = Ti.UI.createWindow({
		navBarHidden : true,
	});
	win.add(Ti.UI.createImageView({
		width : Ti.UI.FILL,
		image : '/assets/head2.png',
		top : 0
	}));
	win.tv = Ti.UI.createTableView({
		backgroundColor : 'transparent',
		top : 60
	});
	win.add(win.tv);
	require('module/model').getDetail(_id, function(_data) {
		win.tv.appendRow(require('module/row').create('Familie', _data.familie));
		win.tv.appendRow(require('module/row').create('Gattung Art', _data.gattung + ' ' + _data.art));
		if (_data.unterart)
			win.tv.appendRow(require('module/row').create('Unterart', _data.unterart));
		if (_data.sorte)
			win.tv.appendRow(require('module/row').create('Sorte', _data.sorte));
		win.tv.appendRow(require('module/row').create('Deutscher Name', _data.deutsch));
		win.tv.appendRow(require('module/row').create('Bereich', _data.bereich + ' (' + _data.unterbereich + ')'));
		//	win.tv.appendRow(require('module/row').create('Unterbereich', _data.unterbereich));
		win.add(Ti.UI.createImageView({
			top : 60,
			right : 0,
			width : 80,
			defaultImage : '',
			image : '/assets/' + _data.standort + '.png'
		}));
		require('vendor/wikiimages').get(_data.gattung, function(_img) {
			if (_img.length == 0)
				return;
			var row = Ti.UI.createTableViewRow();
			row.add(Ti.UI.createImageView({
				image : _img[0],
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE
			}));
			win.tv.insertRowBefore(0, row);
		});
	});
	win.addEventListener('swipe', function() {
		win.close({
			animate : true
		});
	});
	return win;
}
