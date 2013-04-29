exports.create = function() {
	var self = Ti.UI.createWindow({
		navBarHidden : true
	});
	self.add(Ti.UI.createImageView({
		width : Ti.UI.FILL,
		image : '/assets/head2.png',
		top : 0
	}));

	self.tv = Ti.UI.createTableView({
		top : 60,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	var rows = [];
	require('module/model').getFamilien(function(_results) {
		console.log(_results);
		for (var i = 0; i < _results.length; i++) {
			var r = _results[i];
			rows[i] = Ti.UI.createTableViewRow({
				hasChild : true,
				data : r,
				height : 50,
				layout : 'vertical',
				backgroundColor : 'white',
			});
			rows[i].add(Ti.UI.createLabel({
				text : r,
				top : 10,bottom:10,
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
	self.add(self.tv);
	return self;
}
