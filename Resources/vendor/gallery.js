exports.create = function(_name) {
	var gallery = Ti.UI.createScrollView({
		width : Ti.UI.FILL,
		contentHeight : 1,
		contentWidth : Ti.UI.SIZE,
		showHorizontalScrollIndicator : true,
		height : 1,
		parentBubble : true,
		top : 110,
		layout : 'horizontal'
	});
	require('vendor/mensa.cloud').getDataByDishes(_name, function(_images) {
		if (!_images)
			return;
		gallery.contentHeight = 75;
		gallery.height = 75;
		try {
			gallery.add(Ti.UI.createImageView({
				height : Ti.UI.FILL,
				width : 75,
				image : _images.square_75,
				borderRadius : 7,
				left : 1,
				right : 1
			}));
		} catch(E) {
		}
	});
	return gallery;
}
