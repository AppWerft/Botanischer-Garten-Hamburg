exports.create = function(_img, _title) {
	var win = require('module/win').create(_title);
	var img = Ti.UI.createImageView({
		image : _img,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE
	});
	var scroll_view = Titanium.UI.createScrollView({
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		top : 0,
		borderRadius : 7,
		showHorizontalScrollIndicator : false,
		showVerticalScrollIndicator : false,
		maxZoomScale : 5,
		minZoomScale : 1.0,
		backgroundColor : "transparent",
	});
	scroll_view.add(img);
	win.add(scroll_view);
	return win;
}
