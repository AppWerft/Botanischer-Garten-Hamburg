exports.create = function(_bereich) {
	var self= require('module/win').create(_bereich);
	
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
	}, 100);
	self.tv.addEventListener('click', function(_e) {
		var win = require('module/detail.window').create(_e.rowData.data.id);
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
}
