exports.create = function() {
	var self = require('module/win').create('UHH✦intern');
	self.tv = Ti.UI.createTableView({
		top : 0,
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	
	self.add(self.tv);
	return self;
}
