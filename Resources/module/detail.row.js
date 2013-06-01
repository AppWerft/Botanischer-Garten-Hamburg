exports.create = function(_options, _parent) {
	var self = Ti.UI.createTableViewRow({
		backgroundColor : 'white',
		height : Ti.UI.SIZE,
		familie : (_options.label == 'Familie') ? _options.text : null,
		bereich : (_options.label == 'Bereich') ? _options.bereich : null,
		hasChild : (_options.label == 'Bereich' || _options.label == 'Familie' ||_options.label == 'Ordnung' ) ? true : false,
	});
	self.add(Ti.UI.createLabel({
		text : _options.label,
		left : (_options.standort) ? 80 : Ti.UI.CONF.padding,
		right : Ti.UI.CONF.padding,
		width : Ti.UI.FILL,
		height : Ti.UI.CONF.fontsize_label,
		top : Ti.UI.CONF.padding / 2,
		textAlign : _options.textalign,
		font : {
			fontSize : Ti.UI.CONF.fontsize_label
		}
	}));
	self.add(Ti.UI.createLabel({
		text : _options.text,
		width : Ti.UI.FILL,
		left : (_options.standort) ? 80 : Ti.UI.CONF.padding,
		bottom : Ti.UI.CONF.padding / 2,
		top : Ti.UI.CONF.padding * 2.2,
		right : Ti.UI.CONF.padding,
		textAlign : _options.textalign,
		height : Ti.UI.CONF.fontsize_title,
		color : '#060',
		font : {
			fontSize : Ti.UI.CONF.fontsize_title,
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
				image : '/assets/' + _options.standort + '.png'
			}));
	}
	self.addEventListener('click', function(_e) {console.log(_options);
		switch (_options.label) {
			case 'Bereich':
				_parent.tab.open(require('module/bereich.window').create(_options.area));
				break;
			case 'Ordnung':
				_parent.tab.open(require('module/taxo.familiesbyordnung.window').create(_options.text));
				break;
			case 'Familie':
				_parent.tab.open(require('module/taxo.gattungoffamily.window').create(_options.text));
				break;
		}
	});

	return self;
}
