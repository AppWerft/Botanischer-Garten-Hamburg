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
		hintText : 'Suche …'
	});
	self.dummy = Titanium.UI.createTableView({
		search : search,
		height : 50,
		top : 60,
		searchHidden : false,
	});
	self.tv = Ti.UI.createTableView({
		top : 110,
		height : Ti.UI.FILL
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
			backgroundColor : 'white'
		});
		win.add(Ti.UI.createImageView({
			width : Ti.UI.FILL,
			image : '/assets/head2.png',
			top : 0
		}));
		win.tv = Ti.UI.createTableView({
			top : 60
		});
		win.add(win.tv);
		require('module/model').getDetail(_e.rowData.data.id, function(_data) {
			win.tv.appendRow(require('module/row').create('Familie', _data.Familie));
			win.tv.appendRow(require('module/row').create('Gattung Art', _data.Gattung + ' ' + _data.Art));
			win.tv.appendRow(require('module/row').create('Unterart', _data.Unterart));
			win.tv.appendRow(require('module/row').create('Sorte', _data.Sorte));
			win.tv.appendRow(require('module/row').create('Deutscher Name', _data['Deutscher Name']));
			win.tv.appendRow(require('module/row').create('Bereich', _data.Bereich));
			win.tv.appendRow(require('module/row').create('Unterbereich', _data.Unterbereich));
			win.add(Ti.UI.createImageView({
				top : 60,
				right : 0,
				width : 80,
				image : '/assets/' + _data.Standort + '.png'
			}));
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
