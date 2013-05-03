exports.create = function(_annotation) {
	var a = _annotation;
	var win = require('module/win').create(a.title);
	win.backButtonTitle = 'Zurück';
	var imgView = Ti.UI.createImageView({
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformWidth/a.ratio,
		image : '/assets/tree.png'
	});
	require('vendor/imageprogress').get({
		view : imgView,
		url : a.imageurl
	});
	var imageContainer = Titanium.UI.createScrollView({
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformWidth/a.ratio,
		top : 0,
		borderRadius : 7,
		showHorizontalScrollIndicator : false,
		disableBounce : true,
		showVerticalScrollIndicator : false,
		maxZoomScale : 8,
		minZoomScale : 1.0,
		backgroundColor : "transparent"

	});
	imageContainer.add(imgView);
	win.add(imageContainer);
	return win;
}
