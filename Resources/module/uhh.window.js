exports.create = function() {
	var self = require('module/win').create('UHH✦intern');
	self.backgroundImage = 'Default.png';
	var dialogwindow = require('uhhlogin/dialog.window').create();
	self.addEventListener('focus', function() {
		dialogwindow.open();
	});
	self.addEventListener('blur', function() {
		//dialogwindow.close();
	});
	self.add(self.tv);
	return self;
}
