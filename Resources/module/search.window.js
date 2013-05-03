exports.create = function() {
	var self = require('module/win').create('Pflanzensuche');

	var search = Ti.UI.createSearchBar({
		barColor : '#000',
		showCancel : true,
		showBookmark : false,
		top : 0,
		height : 50,
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
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	search.addEventListener('focus', function(_e) {
		self.tv.data = [];
	});
	search.addEventListener('return', function(_e) {
		var rows = [];
		require('module/model').search({
			needle : search.value,
			limit : [0, 50]
		}, function(_results) {
			for (var i = 0; i < _results.length; i++) {
				rows.push(require('module/artrow').create(_results[i]));
			}
			self.tv.setData(rows);
		});
	});
	self.add(self.dummy);
	self.add(self.tv);
	self.tv.addEventListener('click', function(_e) {
		var win = require('module/detail.window').create(_e.rowData.data);
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
}
