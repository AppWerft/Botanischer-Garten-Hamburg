exports.create = function(r) {
	var self = Ti.UI.createTableViewRow({
		hasChild : true,
		data : r,
		layout : 'vertical',
		backgroundColor : '#fff',
		height : Ti.UI.SIZE
	});
	self.add(Ti.UI.createLabel({
		text : r.deutsch,
		top : Ti.UI.CONF.padding,
		color : '#060',
		width : Ti.UI.FILL,
		font : {
			fontWeight : 'bold',
			fontSize : Ti.UI.CONF.fontsize_title,
			fontFamily : 'TheSans-B7Bold'
		},
		top : Ti.UI.CONF.padding
	}));
	self.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		text : r.gattung + ' ' + r.art,
		left : Ti.UI.CONF.padding,
		font : {
			fontFamily : 'TheSansSemiBoldItalic',
			fontStyle : 'italic',
			fontSize : Ti.UI.CONF.fontsize_subtitle
		},
		bottom : Ti.UI.CONF.padding
	}));
	return self;
};
