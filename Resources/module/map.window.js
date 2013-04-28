exports.create = function() {
	var self = Ti.UI.createWindow({
		navBarHidden : true
	});
	self.add(Ti.UI.createImageView({
		width : Ti.UI.FILL,
		image : '/assets/map.png',
		top : 0
	}));
	
	return self;
}
