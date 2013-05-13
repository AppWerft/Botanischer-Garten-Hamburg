exports.create = function(_title, _noswipe) {
	var self = Ti.UI.createWindow({
		title : _title,
		barColor : 'black'
	});
	if (!_noswipe)
		self.addEventListener('swipe', function(_e) {
			if (_e.direction == 'right')
				self.close({
					animated : true
				});
		});
	self.actind = Ti.UI.createActivityIndicator({
		color : 'white',
		backgroundColor : 'black',
		borderRadius : 8,
		width : 280,
		height : 80,
		opacity : 0.8,
		zIndex : 999,
		font : {
			fontSize : 12
		},
		borderColor : 'black',
		borderWidth : 2,
		borderColor : 'white'
	});
	//self.add(self.actind);
	return self;
}
