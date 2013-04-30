exports.create = function() {
	var self = require('module/win').create('Übersicht');
	self.tv = Ti.UI.createTableView({
		top : 0,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var rows = [];
	require('module/model').getFamilien(function(_results) {
		for (var i = 0; i < _results.length; i++) {
			var r = _results[i];
			rows[i] = Ti.UI.createTableViewRow({
				hasChild : true,
				familie : r,
				height : 50,
				layout : 'vertical',
				backgroundColor : 'white',
			});
			rows[i].add(Ti.UI.createLabel({
				text : r,
				top : 10,
				bottom : 10,
				color : '#444',
				width : Ti.UI.FILL,
				font : {
					fontWeight : 'bold',
					fontSize : 20
				},
				left : 10
			}));
		}
		self.tv.data = rows;
	});
	self.tv.addEventListener('click', function(_e) {
		self.tab.open(require('module/taxo.gattung.window').create(_e.rowData.familie));
	});
	self.add(self.tv);
	return self;
}
