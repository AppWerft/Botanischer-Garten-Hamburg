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
				rows.push(require('module/artrow').create(r));
			}
			self.tv.data = rows;
		});
	});
	self.add(self.dummy);
	self.add(self.tv);
	self.tv.addEventListener('click', function(_e) {
		var win = require('module/detail.window').create(_e.rowData.data.id);
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
}
