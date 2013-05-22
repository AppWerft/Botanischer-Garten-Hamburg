exports.create = function() {
	var self = require('module/win').create('UHH✦intern', true);
	self.backgroundImage = 'Default.png';
	var dialogView = require('uhhlogin/dialog').create();
	
	self.addEventListener('focus', function() {
		dialogView.show();
	});
	self.addEventListener('blur', function() {
		dialogView.hide();
	});
	require('vendor/mensa').getMenue('hamburg/mensa-botanischer-garten', function(_html) {
		self.add(Ti.UI.createWebView({
			html : _html
		}));self.add(dialogView);
	});
	return self;
}
