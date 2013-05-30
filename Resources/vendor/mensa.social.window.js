exports.create = function(_title) {
	var self = require('module/win').create(_title, true);
	const BUTTSIZE = 40;
	self.backgroundColor = 'white';
	require('vendor/mensa.cloud').getVotingbyUser(function(_data) {
		self.slider.setValue(_data.vote);
		self.comment.setValue(_data.comment);
		self.add(self.button);
	});
	self.container = Ti.UI.createView({
		layout : 'vertical',
		top : Ti.UI.CONF.padding,
		left : Ti.UI.CONF.padding,
		right : Ti.UI.CONF.padding
	});
	self.container.add(Ti.UI.createLabel({
		text : 'Hier kannst Du nach Herzenslust soscheleisen. Du kannst das Essen kommentieren, photographieren und bewerten.',
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
		top : 0,
		right : 0,
		height : Ti.UI.SIZE
	});
	self.container.add(self.buttons);
	var checkin = Ti.UI.createButton({
		height : BUTTSIZE,
		width : BUTTSIZE,
		top : 0,
		right : 0,
		backgroundImage : '/assets/checkin.png'
	});
	self.buttons.add(checkin);
	var camera = Ti.UI.createButton({
		height : BUTTSIZE,
		width : BUTTSIZE,
		top : 0,
		right : BUTTSIZE * 1.1,
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
	self.slider.bubble = Ti.UI.createImageView({
		width : 50,
		height : 38,
		top : 200,
		zIndex : 999,
		opacity : 0,
		image : '/assets/bubble.png'
	});
	self.slider.bubbletext = Ti.UI.createLabel({
		color : 'white'
	});
	self.slider.bubble.add(self.slider.bubbletext);

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
	self.add(self.slider.bubble);
	/* Events */
	self.button.addEventListener('click', function(_e) {
		require('vendor/mensa.cloud').postComment({
			vote : parseInt(self.slider.value),
			comment : self.comment.value || ''
		});
	});
	self.slider.addEventListener('change', function(e) {
		var x = e.source.value / e.source.getMax() * e.source.getRect().width + 10;
		return;
		e.source.bubble.setLeft(x);
		e.source.bubbletext.setText(Math.round(e.source.value));
		e.source.bubble.opacity = 1;
		setTimeout(function() {
			self.slider.bubble.animate({
				opacity : 0
			});
		}, 1000)
	});
	self.slider.addEventListener('stop', function(e) {
		//e.source.bubble.opacity=0;
	});

	return self;
}
