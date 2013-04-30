exports.create = function(_familie) {
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
	require('module/model').getGattungenByFamilie(_familie, function(_results) {
		for (var i = 0; i < _results.length; i++) {
			var r = _results[i];
			rows[i] = Ti.UI.createTableViewSection({
				headerTitle : r,
			});
			var arten = require('module/model').getArtenByGattung(r);
			for (var a = 0; a < arten.length; a++) {
				rows[i].add(require('module/artrow').create(arten[a]));
			}
		}
		self.tv.data = rows;
	});
	self.add(self.tv);
	return self;
}
