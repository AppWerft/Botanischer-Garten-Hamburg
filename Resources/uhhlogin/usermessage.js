exports.create = function(_user) {
	var w = Ti.Platform.displayCaps.platformWidth;

	var self = Ti.UI.createView({
		bottom : 0,
		height : w / 5,
		width : Ti.UI.FILL
	});
	self.add(Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.5
	}));
	var text = _user.firstname + ' ' + _user.lastname + '\n' + _user.portal.title;
	self.add(Ti.UI.createImageView({
		image : '/assets/logos/' + _user.portal.id + '.png',
		height : Ti.UI.FILL,
		width : Ti.UI.SIZE,
		left : 0
	}));

	self.add(Ti.UI.createLabel({
		text : text,
		color : 'white',
		left : w / 2
	}));
	self.animate(Ti.UI.createAnimation({
		delay : 300,
		duration : 3000,
		bottom : -w / 3
	}));
	return self;
}