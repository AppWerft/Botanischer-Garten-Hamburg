exports.create = function(_familie) {
	function addRows(r, i) {
		//	setTimeout(function() {
		require('module/model').getArtenByGattung(r, function(_items) {
			for (var a = 0; a < _items.length; a++) {
				sections[i].add(require('module/artrow').create(_items[a]));
			}
			self.tv.setData(sections);
		});
		//	}, i * 10);
	}
	var self = require('module/win').create(_familie);
	var sections = [];
	self.actind.setMessage('Lade Pflanzen der Familie „' + _familie + '“')
	self.actind.show();
	setTimeout(function() {
		if (self && self.actind)
			self.actind.hide()
	}, 2000);
	self.tv = Ti.UI.createTableView({
		top : 0,
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
		var win = require('module/detail.window').create(_e.rowData.data);
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
}
