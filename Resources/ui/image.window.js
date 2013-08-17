exports.create = function(_img, _title) {
	var win = require('ui/win').create(_title);
	win.backButtonTitle = 'Zurück';
	var imgView = Ti.UI.createImageView({
		image : _img[0],
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformHeight - 80
	});
	var imageContainer = Titanium.UI.createScrollView({
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.UI.SIZE,
		top : 0,
		borderRadius : 7,
		showHorizontalScrollIndicator : false,
		disableBounce : true,
		showVerticalScrollIndicator : false,
		maxZoomScale : 8,
		minZoomScale : 1.0,
		backgroundColor : "transparent",
		bottom : 80
	});
	var thumbContainer = Titanium.UI.createScrollView({
		width : Ti.Platform.displayCaps.platformWidth,
		height : 80,
		bottom : 0,

		showHorizontalScrollIndicator : true,
		backgroundColor : "transparent",
	});
	var thumbs = [];
	for (var i = 0; i < _img.length; i++) {
		thumbs[i] = Ti.UI.createImageView({
			height : 80,
			borderWidth : 1,
			borderColor : 'white',
			width : 80,
			left : i * 80,
			defaultImage : 'assets/tree.png'
			//image : _img[i]
		});
		require('vendor/imageprogress').get({
			view : thumbs[i],
			url : _img[i]
		});
		thumbContainer.add(thumbs[i]);
	}
	imageContainer.add(imgView);
	win.add(imageContainer);
	win.add(thumbContainer);
	thumbContainer.addEventListener('click', function(_e) {
		imgView.setImage(_e.source.getImage());
	});
	thumbContainer.addEventListener('scrollend', function(_e) {
		console.log(_e);
	});
	return win;
};
