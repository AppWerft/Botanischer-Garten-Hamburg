exports.create = function(_char) {
	var self = Ti.UI.createTableViewRow({
		height : 50,
		top : 0,
		backgroundColor : '#777'
	});
	self.add(Ti.UI.createImageView({
		image : 'assets/intkey.png',
		left : 10,
		width : 32,
		height : 32,
		left : 5
	}));
	self.textcontainer = Ti.UI.createImageView({
		right : 10,
		height : 40,
		width : '100%',
		left : 50,
	});
	self.add(self.textcontainer);
	self.textcontainer.add(Ti.UI.createLabel({
		text : _char.title,
		width : '100%',
		height : Ti.UI.CONF.fontsize_title * 1.2,
		top : 5,
		left : 0,
		color : '#fff',
		font : {
			fontSize : Ti.UI.CONF.fontsize_title,
			fontFamily : 'TheSans-B7Bold'
		},
	}));
	if (_char.subtitle) {
		self.textcontainer.add(Ti.UI.createLabel({
			text : _char.subtitle,
			left : 0,
			width : Ti.UI.FILL,
			height : Ti.UI.CONF.fontsize_subtitle * 1.2,
			top : 25,
			color : 'white',
			font : {
				fontSize : Ti.UI.CONF.fontsize_subtitle,
				fontFamily : 'TheSans-B7Bold'
			},
		}));
	}
	return Ti.UI.createTableView({
		left : 0,
		top : 0,
		width : Ti.UI.FILL,
		height : 50,
		data : [self],
		scrollable : false,
		clickable : false
	});

}
