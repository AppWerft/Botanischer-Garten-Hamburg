exports.create = function(_char) {
	var self = Ti.UI.createView({
		width : 260,
		height : 340,
		borderRadius : 8,
		opacity : 0.9
	});
	self.header = Ti.UI.createView({
		top : 0,
		height : 50
	});
	self.header.add(require('module/intkey.characterheader').create(_char));
	self.body = Ti.UI.createView({
		left : 0,
		top : 50,
		width : Ti.UI.FILL,
		backgroundColor : '#fff',
	});
	self.add(self.body);
	self.add(self.header);

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