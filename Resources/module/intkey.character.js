exports.create = function(_char) {
	var self = Ti.UI.createView({
		width : 260,
		
		height : 340,
		borderRadius : 8,
		opacity : 0.9
	});
	self.head = Ti.UI.createView({
		left : 0,
		top : 0,
		width : Ti.UI.FILL,
		height : 50,
		backgroundColor : '#007700',
	});
	self.body = Ti.UI.createView({
		left : 0,
		top : 50,
		width : Ti.UI.FILL,
		backgroundColor : '#fff',
	});
	self.add(self.head);
	self.add(self.body);
	self.head.add(Ti.UI.createImageView({
		image : 'assets/intkey.png',
		left : 10,
		width : 32,
		height : 32,
		left : 5
	}));

	self.textcontainer = Ti.UI.createView({
		top : 5,
		right : 10,
		bottom : 5,
		height : '100%',
		width : '100%',
		left : 50,
	});
	self.head.add(self.textcontainer)
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
	switch (_char.type) {
		case 'UM':
			var rows = [];
			for (var i = 0; i < _char.states.length; i++) {
				rows[i] = Ti.UI.createTableViewRow({
					height : 40
				});
				rows[i].add(Ti.UI.createLabel({
					font : {
						fontSize : Ti.UI.CONF.fontsize_title,
						fontWeight : 'bold',
						fontFamily : 'TheSans-B7Bold'
					},
					left : 10,
					top : 10,
					bottom : 10,
					text : _char.states[i]
				}));

			}
			var tv = Ti.UI.createTableView({
				data : rows,
				top : 0,
				height : 290
			});
			self.body.add(tv);
			break;
		case 'RN':
			self.body.add(Ti.UI.createTextField({
				top : 20,
				left : 10,
				height : 50,
				font : {
					fontSize : Ti.UI.CONF.fontsize_title,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
				borderRadius : 10,
				borderWidth : 1,
				right : 50
			}));
			break;
		default:
			break;
	}
	return self;
}