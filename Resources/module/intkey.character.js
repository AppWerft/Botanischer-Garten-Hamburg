exports.create = function(_char) {
	var self = Ti.UI.createView();
	self.head = Ti.UI.createLabel({
		left : 0,
		top : 0,
		width : Ti.UI.FILL,
		height : 60,
		layout : 'vertical',
		backgroundColor : '#009900',
	});
	self.add(self.head);
	try {
		var t1 = _char.name.split(':')[0];
		var t2 = _char.name.split(':')[1];
	} catch(E) {
		var t1 = _char.name;
		var t2 = ' ';
	}
	self.head.add(Ti.UI.createLabel({
		text : t1.capitalize(),
		left : 10,
		top : 8,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		backgroundColor : '#009900',
		color : 'white',
		font : {
			fontSize : Ti.UI.CONF.fontsize_title,
			fontWeight : 'bold',
			fontFamily : 'TheSans-B7Bold'
		},
	}));
	if (t2)
		self.head.add(Ti.UI.createLabel({
			text : t2.capitalize(),
			left : 10,
			top : 3,
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			color : 'white',
			font : {
				fontSize : Ti.UI.CONF.fontsize_subtitle,
				fontWeight : 'bold',
				fontFamily : 'TheSans-B7Bold'
			},
		}));
	switch (_char.type) {
		case 'UM':
			var tv = Ti.UI.createTableView({
				top : 60
			});
			for (var i = 0; i < _char.states.length; i++) {
				tv.appendRow(Ti.UI.createTableViewRow({
					title : _char.states[i]
				}));
			}
			self.add(tv);
			break;
	}
	return self;
}