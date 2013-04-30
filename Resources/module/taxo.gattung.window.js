exports.create = function(_familie) {
	function addRows(r, i) {
		//	setTimeout(function() {
		require('module/model').getArtenByGattung(r, function(_arten) {
			for (var a = 0; a < _arten.length; a++) {
				sections[i].add(require('module/artrow').create(_arten[a]));
			}
			self.tv.setData(sections);
		});
		//	}, i * 10);
	}

	var self = Ti.UI.createWindow({
		navBarHidden : true
	});
	var sections = [];
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

	setTimeout(function() {
		require('module/model').getGattungenByFamilie(_familie, function(_results) {
			for (var i = 0; i < _results.length; i++) {
				var gattung = _results[i];
				sections[i] = Ti.UI.createTableViewSection({
					headerTitle : gattung,
				});
				addRows(gattung, i);

			}
			self.tv.data = sections;
		});
	}, 100);
	self.add(self.tv);
	self.addEventListener('close', function() {
		self = null;
	});
	self.tv.addEventListener('click', function(_e) {
		var win = require('module/detail.window').create(_e.rowData.data.id);
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
}
