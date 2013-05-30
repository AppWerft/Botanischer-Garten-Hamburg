exports.create = function(_title) {
	var self = require('module/win').create(_title, true);
	const BUTTSIZE = 40;
	var dataid = undefined;
	self.backgroundColor = 'white';
	self.actind.show();
	require('vendor/mensa.cloud').getDataByUserAndDish(_title, function(_data) {;
		if (_data) {
			self.slider.setValue(_data.vote);
			self.comment.setValue(_data.comment);
		}
		self.actind.hide();
		self.add(self.button);
	});
	self.container = Ti.UI.createView({
		layout : 'vertical',
		top : Ti.UI.CONF.padding,
		left : Ti.UI.CONF.padding,
		right : Ti.UI.CONF.padding
	});
	self.container.add(Ti.UI.createLabel({
		text : 'Hier kannst Du nach Lust soscheleisen. Du kannst das Essen kommentieren, photographieren und bewerten.',
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		font : {
			fontSize : Ti.UI.CONF.fontsize_subtitle,
			fontFamily : 'TheSansSemiBoldItalic'
		},
		top : 0,
		bottom : 0
	}));
	self.buttons = Ti.UI.createView({
		top : Ti.UI.CONF.padding,
		right : 0,
		height : Ti.UI.SIZE
	});
	self.container.add(self.buttons);
	var checkin = Ti.UI.createButton({
		height : BUTTSIZE,
		width : BUTTSIZE,
		top : 0,
		right : BUTTSIZE * 1.3,
		backgroundImage : '/assets/checkin.png'
	});
	self.buttons.add(checkin);
	var camera = Ti.UI.createButton({
		height : BUTTSIZE,
		width : BUTTSIZE,
		top : 0,
		right : 0,
		backgroundImage : '/assets/camera.png'
	});
	self.buttons.add(camera);
	self.comment = Ti.UI.createTextArea({
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,
		color : '#333',
		font : {
			fontSize : Ti.UI.CONF.fontsize_subtitle
		},
		keyboardType : Titanium.UI.KEYBOARD_ASCII,
		returnKeyType : Ti.UI.RETURNKEY_GO,
		textAlign : 'left',
		autocorrect : false,
		hintText : 'Kommentar',
		top : Ti.UI.CONF.padding,
		width : Ti.UI.FILL,
		height : 80
	});
	self.slider = Ti.UI.createSlider({
		top : Ti.UI.CONF.padding,
		max : 10,
		min : 0,
	});

	self.button = Ti.UI.createButton({
		bottom : Ti.UI.CONF.padding,
		backgroundImage : '/assets/buttonbg.png',
		color : 'white',
		font : {
			fontWeight : 'bold'
		},
		borderRadius : 10,
		font : {
			fontSize : 32,
			fontWeight : 'bold'
			//	fontFamily : 'TheSans-B7Bold'
		},
		width : Ti.UI.FILL,
		height : 40,
		left : Ti.UI.CONF.padding,
		right : Ti.UI.CONF.padding,
		title : 'Abschicken'
	});
	self.add(self.container);
	self.container.add(self.comment);
	self.container.add(self.slider);
	self.container.add(Ti.UI.createLabel({
		text : 'Bitte beachte die Persönlichkeitsrechte der Mitesser. Nur das Essen ist gemeinfrei.',
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		font : {
			fontSize : Ti.UI.CONF.fontsize_subtitle,
			fontFamily : 'TheSansSemiBoldItalic'
		},
		top : Ti.UI.CONF.padding,
		bottom : Ti.UI.CONF.padding
	}));
	/* Events */
	self.button.addEventListener('click', function(_e) {
		require('vendor/mensa.cloud').postComment({
			vote : parseInt(self.slider.value),
			comment : self.comment.value || '',
			dish : _title
		});
	});

	return self;
}
