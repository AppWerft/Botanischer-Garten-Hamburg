exports.create = function() {
	var self = require('module/win').create('UHH✦intern');
	self.backgroundImage = 'Default.png';
	var active = false;
	var dialogwindow = require('uhhlogin/dialog.window').create();
	self.addEventListener('focus', function() {
		dialogwindow.open();
		console.log('FOCUS');
		active = true;
		setTimeout(function() {
			active = false
		}, 100);
	});
	self.addEventListener('blur', function() {
		console.log('BLUR');
		if (!active)
			dialogwindow.close();
	});

	return self;
}
