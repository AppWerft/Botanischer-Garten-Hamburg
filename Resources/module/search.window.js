exports.create = function() {
	var self = Ti.UI.createWindow({
		navBarHidden : true
	});
	var search = Ti.UI.createSearchBar({
		barColor : '#000',
		showCancel : true,
		showBookmark : false,
		top : 0,

		hintText : 'Suche …'
	});
	self.dummy = Titanium.UI.createTableView({
		search : search,
		height : 50,
		top : 0,
		searchHidden : false,
	});
	self.tv = Ti.UI.createTableView({
		top : 50,
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
		require('module/model').getDetail(_e.rowData.data.id, function(_data) {
			win.add(Ti.UI.createLabel({
				text : JSON.stringify(_data)
			}));
		});
		win.addEventListener('click', function() {
			win.close({
				animate : true
			});
		});
		self.tab.open(win,{
				animate : true
			});
	});
	return self;
}
