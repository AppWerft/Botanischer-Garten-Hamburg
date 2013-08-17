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
		message : 'Bitte etwas Geduld … ',
		height : 80,
		zIndex : 999,
		opacity : 0.8,
		font : {
			fontSize : 12
		},
		borderColor : 'black',
		borderWidth : 2,
		borderColor : 'white'
	});
	self.add(self.actind);
	self.addEventListener('close', function() {
		self.remove(self.actind);
		self.actind = null;
		self = null;
	});
	return self;
};
