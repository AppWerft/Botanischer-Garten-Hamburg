exports.create = function() {
	var self = require('module/win').create('UHH✦intern');
	self.backgroundImage = 'Default.png';
	var active = false;
	var dialogView = require('uhhlogin/dialog').create();
	self.addEventListener('focus', function() {
		self.add(dialogView);dialogView.show();
		console.log('FOCUS');
		active = true;
		setTimeout(function() {
			active = false
		}, 100);
	});
	self.addEventListener('blur', function() {
		console.log('BLUR');
		if (!active)
			self.remove(dialogView);
	});

	return self;
}
