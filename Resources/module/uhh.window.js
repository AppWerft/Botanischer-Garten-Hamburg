exports.create = function() {
	var self = require('module/win').create('UHH✦intern');
	self.backgroundImage = 'Default.png';
	var dialogView = require('uhhlogin/dialog').create();
	self.add(dialogView);
	self.addEventListener('focus', function() {
		dialogView.show();
	});
	self.addEventListener('blur', function() {
		dialogView.hide();
	});
	return self;
}
