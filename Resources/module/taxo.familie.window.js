exports.create = function() {
	function getFamilien() {
		require('module/model').getFamilien(function(_orders) {
			var orders = _orders, sections = [], i = 0;
			for (var o in orders) {
				sections[i] = Ti.UI.createTableViewSection({
					headerTitle : o
				});
				for (var f = 0; f < orders[o].length; f++) {
					var row = Ti.UI.createTableViewRow({
						hasChild : true,
						familie : orders[o][f],
						height : 40,
						layout : 'vertical',
						backgroundColor : 'white',
					});
					row.add(Ti.UI.createLabel({
						text : orders[o][f],
						top : 5,
						bottom : 5,
						color : '#060',
						width : Ti.UI.FILL,height:Ti.UI.SIZE,
						font : {
							fontWeight : 'bold',
							fontSize : 20
						},
						left : 15
					}));
					sections[i].add(row);
				}
				i++;
			}
			self.tv.setData(sections);
		});
	}

	var self = require('module/win').create('Übersicht');
	var search = Ti.UI.createSearchBar({
		barColor : '#000',
		showCancel : true,
		showBookmark : false,
		top : 0,
		height : 50,
		hintText : 'Suche …'
	});
	self.add(search);
	self.dummy = Titanium.UI.createTableView({
		search : search,
		height : 50,
		top : -60,
		searchHidden : false,
	});
	self.add(self.dummy);
	search.addEventListener('focus', function(_e) {
		self.title = 'Suche';
	});
	search.addEventListener('return', function(_e) {
		var rows = [];
		require('module/model').search({
			needle : _e.value,
			limit : [0, 50]
		}, function(_results) {
			for (var i = 0; i < _results.length; i++) {
				rows.push(require('module/artrow').create(_results[i]));
			}
			self.tv.setData(rows);
		});
	});
	self.tv = Ti.UI.createTableView({
		top : 45,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var rows = [];
	getFamilien();
	self.addEventListener('focus', function() {
		self.title = 'Taxonomie';
		getFamilien();
	})
	self.tv.addEventListener('click', function(_e) {
		if (_e.rowData.familie)
			self.tab.open(require('module/taxo.gattung.window').create(_e.rowData.familie));
		if (_e.rowData.data)
			self.tab.open(require('module/detail.window').create(_e.rowData.data));
	});
	self.add(self.tv);
	return self;
}
