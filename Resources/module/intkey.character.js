exports.create = function(_char) {
	var self = Ti.UI.createScrollView();
	self.add(Ti.UI.createLabel({
		text : '   ' + _char.name,
		left : 0,
		top : 0,
		width : Ti.UI.FILL,
		height : 60,
		backgroundColor : '#009900',
		color : 'white',
		font : {
			fontSize : Ti.UI.CONF.fontsize_title,
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
				tv.appendRow(Ti.UI.createTabelViewRow({
					title : _chars.states[i]
				}));
			}
			self.add(tv);
			break;
	}
	return self;
}