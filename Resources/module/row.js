exports.create = function(k, v) {
	var self = Ti.UI.createTableViewRow({
		layout : 'vertical'
	});
	self.add(Ti.UI.createLabel({
		text : k,
		left : 10,
		width : Ti.UI.FILL,
		top : 5
	}));
	self.add(Ti.UI.createLabel({
		text : v,
		width : Ti.UI.FILL,
		left : 10,
		bottom : 5,
		color : '#060',
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		}
	}));
	return self;
}
