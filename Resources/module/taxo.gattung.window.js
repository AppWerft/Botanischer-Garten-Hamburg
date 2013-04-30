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
	setTimeout(function() {
		require('module/model').getGattungenByFamilie(_familie, function(_results) {
			for (var i = 0; i < _results.length; i++) {
				var r = _results[i];
				rows[i] = Ti.UI.createTableViewSection({
					headerTitle : r,
				});
				require('module/model').getArtenByGattung(r, function(_arten) {
					for (var a = 0; a < _arten.length; a++) {
						rows[i].add(require('module/artrow').create(_arten[a]));
					}self.tv.setData(rows);
				});

			}
			self.tv.data = rows;
		});
	}, 100);
	self.add(self.tv);
	return self;
}
