exports.create = function(k, v, parent, bereich) {
	var self = Ti.UI.createTableViewRow({
		layout : 'vertical',
		backgroundColor : 'white',
		familie : (k == 'Familie') ? v : null,
		bereich : (k == 'Bereich') ? bereich : null,
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
			fontWeight : 'bold',
			fontFamily : 'TheSans-B6SemiBold'
		}
	}));
	if (k == 'Bereich') {
		self.addEventListener('click', function(_e) {
			// es gibt eine Arrea auf der Karte:
			if (_e.rowData.bereich.area) {
				parent.tab.open(require('module/picker.window').create(_e.rowData.bereich));
			} else {
				parent.tab.open(require('module/bereich.window').create(v));
			}
		});
	}
	return self;
}
