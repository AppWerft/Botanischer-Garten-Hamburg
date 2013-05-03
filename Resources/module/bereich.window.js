exports.create = function(_bereich) {
	var bereich = /^(.*) \[/.exec(_bereich)[1];
	var self = require('module/win').create(bereich);
	self.tv = Ti.UI.createTableView({
		top : 0,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	self.add(self.tv);
	setTimeout(function() {
		require('module/model').getArtenByBereich(_bereich, function(_e) {
			var rows = [];
			for (var i = 0; i < _e.length; i++) {
				var r = _e[i];
				rows.push(require('module/artrow').create(r));
			}
			self.tv.data = rows;
		});
	}, 0);
	self.tv.addEventListener('click', function(_e) {
		var win = require('module/detail.window').create(_e.rowData.data);
		self.tab.open(win, {
			animated : true
		});
	});
	return self;
}
