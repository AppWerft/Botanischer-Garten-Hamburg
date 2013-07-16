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
	self.header.add(require('intkey/intkey.characterheader').create(_char));
	self.body = Ti.UI.createView({
		left : 0,
		top : 50,
		width : Ti.UI.FILL,
		backgroundColor : '#fff',
	});
	self.add(self.body);
	self.add(self.header);
	self.tv = Ti.UI.createTableView({
		data : rows,
		top : 0,
		height : 290,
		data : rows
	});
	self.body.add(self.tv);
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
			self.tv.setData(rows);
			break;
		case 'IN':
			var rows = [];
			for (var i = _char.min; i <= _char.max; i++) {
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
					text : i
				}));
			}
			self.tv.setData(rows);

			break;
		case 'RN':
			var row = Ti.UI.createTableViewRow({
				height : '100%',
				layout : 'vertical'
			});

			var input = Ti.UI.createTextField({
				top : 20,
				left : 10,
				height : 50,
				color : '#555',textAlign:'right',
				keyboardType : Ti.UI.KEYBOARD_DECIMAL_PAD,
				font : {
					fontSize : Ti.UI.CONF.fontsize_title * 2,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
				borderRadius : 10,
				borderWidth : 1,
				right : 10
			})
			row.add(input);
			row.addEventListener('click', function() {
				input.blur();
			});
			row.add(Ti.UI.createSlider({
				min : 0,
				max : 10,
				value : 2,
				width : '90%',
				height : 50,
				top : 60
			}));
			self.tv.setData([row]);
			break;
		default:
			break;
	}

	return self;
}