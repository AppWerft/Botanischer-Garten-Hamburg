exports.create = function(k, v,parent) {
	var self = Ti.UI.createTableViewRow({
		layout : 'vertical',
		backgroundColor : 'white',
		familie : (k == 'Familie') ? v : null,
		bereich : (k == 'Bereich') ? v : null,
		hasChild : (k == 'Familie' || k == 'Bereich') ? true : false,
	});
	self.add(Ti.UI.createLabel({
		text : k,
		left : 10,
		width : Ti.UI.FILL,
		top : 5,
		font : {
			fontSize : 12
		}
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
	if (k == 'Bereich')
		self.addEventListener('click', function(_e) {
			parent.tab.open(require('module/bereich.window').create(v));
		});
	return self;
}
