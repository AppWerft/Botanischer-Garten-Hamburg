exports.create = function(_item) {
	console.log(_item.media);
	var self = Ti.UI.createWindow({
		navBarHidden : true,
		transform : Ti.UI.create2DMatrix({
			scale : 0.1
		}),
		borderRadius : 6
	});
	self.add(Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.7
	}));
	self.addEventListener('click', function() {
		self.close();
	});
	var container = Ti.UI.createScrollView({
		backgroundColor : 'white',
		layout : 'vertical',
		contentHeight : Ti.UI.SIZE,
		contentWidth : Ti.UI.FILL,
		width : '90%',
		height : '90%',
	});
	self.add(container);
	for (var i = 0; i < _item.media.length; i++) {
		container.add(Ti.UI.createImageView({
			top : 0,
			image : _item.media[i].url_420px,
			width : Ti.UI.FILL,
			height : 'auto'
		}));
	}
	self.animate(Ti.UI.createAnimation({
		duration : 500,
		transform : Ti.UI.create2DMatrix({
			scale : 1
		})
	}));
	return self;
}
