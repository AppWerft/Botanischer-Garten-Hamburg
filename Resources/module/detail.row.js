exports.create = function(_options, _parent) {
	var self = Ti.UI.createTableViewRow({
		backgroundColor : 'white',
		height : Ti.UI.SIZE,
		familie : (_options.label == 'Familie') ? _options.text : null,
		bereich : (_options.label == 'Bereich') ? _options.bereich : null,
		hasChild : (_options.label == 'Bereich') ? true : false,
	});
	self.add(Ti.UI.createLabel({
		text : _options.label,
		left : (_options.standort) ? 80 : 10,
		right : 20,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		top : 5,
		textAlign : _options.textalign,
		font : {
			fontSize : 12
		}
	}));
	self.add(Ti.UI.createLabel({
		text : _options.text,
		width : Ti.UI.FILL,
		left : (_options.standort) ? 80 : 10,
		bottom : 5,
		top : 25,
		right : 20,
		textAlign : _options.textalign,
		height : Ti.UI.SIZE,
		color : '#060',
		font : {
			fontSize : 20,
			fontWeight : 'bold',
			fontFamily : 'TheSans-B7Bold'
		}
	}));
	if (_options.label == 'Bereich') {
		if (_options.standort)
			self.add(Ti.UI.createImageView({
				left : 0,
				top : 0,
				width : 60,
				height : 60,
				image : 'assets/' + _options.standort + '.png'
			}))
		self.addEventListener('click', function(_e) {
			// es gibt eine Arrea auf der Karte:
			if (_e.rowData.bereich.area) {
				parent.tab.open(require('module/picker.window').create(_e.rowData.bereich));
			} else {
				parent.tab.open(require('module/bereich.window').create(_options.text));
			}
		});
	}
	return self;
}
