exports.create = function(_annotation) {
	var a = _annotation;
	var win = require('module/win').create(a.title);
	win.backButtonTitle = 'Zurück';
	var imgView = Ti.UI.createImageView({
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformWidth / a.ratio,
		image : '/assets/tree.png'
	});
	require('vendor/imageprogress').get({
		view : imgView,
		url : a.imageurl
	});
	var imageContainer = Titanium.UI.createScrollView({
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformWidth / a.ratio,
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
	win.add(Ti.UI.createImageView({
		bottom : 20,
		right : 10,
		width : 160,
		image : 'http://www.panoramio.com/img/glass/components/logo_bar/panoramio.png'
	}));
	win.add(Ti.UI.createLabel({
		text : 'Photos provided by Panoramio are under the copyright of their owners',
		bottom : 5,
		color : 'white',
		height : Ti.UI.SIZE,
		font : {
			fontSize : 9
		}
	}))
	return win;
}
