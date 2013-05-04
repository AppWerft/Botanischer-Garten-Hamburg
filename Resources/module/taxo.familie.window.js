exports.create = function() {
	var self = require('module/win').create('Übersicht');
	self.tv = Ti.UI.createTableView({
		top : 0,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var rows = [];
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
					height : 50,
					layout : 'vertical',
					backgroundColor : 'white',
				});
				row.add(Ti.UI.createLabel({
					text : orders[o][f],
					top : 5,
					bottom : 5,
					color : '#060',
					width : Ti.UI.FILL,
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
	self.tv.addEventListener('click', function(_e) {
		self.tab.open(require('module/taxo.gattung.window').create(_e.rowData.familie));
	});
	self.add(self.tv);
	return self;
}
