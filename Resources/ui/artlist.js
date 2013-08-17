exports.create = function(r) {
	var self = Ti.UI.createListItem({
		hasChild : true,
		data : r,
		height : 80,
		layout : 'vertical',
		backgroundColor : 'white',
		height : Ti.UI.SIZE
	});
	self.add(Ti.UI.createLabel({
		text : r.deutsch,
		top : 5,
		color : '#060',
		width : Ti.UI.FILL,
		font : {
			fontWeight : 'bold',
			fontSize : 20
		},
		left : 10
	}));
	self.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		text : r.gattung + ' ' + r.art,
		left : 10,
		bottom : 5
	}));
	return self;
};
