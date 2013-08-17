exports.create = function(_url) {
	var win = require('ui/win').create('Wikipedia', true);
	var web = Ti.UI.createWebView({
		height : Ti.UI.SIZE,
		url : _url,
		disableBounce : true
	});
	win.add(web);
	return win;
};
