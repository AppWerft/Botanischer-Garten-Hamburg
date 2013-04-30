exports.create = function() {
	var self = Ti.UI.createWindow({
		navBarHidden : true
	});
	self.add(Ti.UI.createImageView({
		width : Ti.UI.FILL,
		image : '/assets/head2.png',
		top : 0
	}));
	var search = Ti.UI.createSearchBar({
		barColor : '#000',
		showCancel : true,
		showBookmark : false,
		top : 60,
		height : 50,
		hintText : 'Suche …'
	});
	self.dummy = Titanium.UI.createTableView({
		search : search,
		height : 50,
		top : 60,
		searchHidden : false,
	});
	self.tv = Ti.UI.createTableView({
		top : 100,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	search.addEventListener('focus', function(_e) {
		self.tv.data = [];
	});
	search.addEventListener('return', function(_e) {
		var rows = [];
		require('module/model').search(search.value, function(_results) {
			for (var i = 0; i < _results.length; i++) {
				var r = _results[i];
				rows[i] = Ti.UI.createTableViewRow({
					hasChild : true,
					data : r,
					height : 80,
					layout : 'vertical',
					backgroundColor : 'white',
					height : Ti.UI.SIZE
				});
				rows[i].add(Ti.UI.createLabel({
					text : r.deutsch,
					top : 5,
					color : '#060',
					width : Ti.UI.FILL,
					font : {
						fontWeight : 'bold',
						fontSize : 20
					},
					left : 10
				}));
				rows[i].add(Ti.UI.createLabel({
					width : Ti.UI.FILL,
					text : r.gattung + ' ' + r.art,
					left : 10,
					bottom : 5
				}));
			}
			self.tv.data = rows;
		});
	});
	self.add(self.dummy);
	self.add(self.tv);
	self.tv.addEventListener('click', function(_e) {
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
		require('module/model').getDetail(_e.rowData.data.id, function(_data) {
			win.tv.appendRow(require('module/row').create('Familie', _data.familie));
			win.tv.appendRow(require('module/row').create('Gattung Art', _data.gattung + ' ' + _data.art));
			win.tv.appendRow(require('module/row').create('Unterart', _data.unterart));
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
				if (_img.length ==0) return;
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
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
}
