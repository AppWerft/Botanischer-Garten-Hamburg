exports.create = function(_title, _latlon) {
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
		if (self.actind)
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
	self.icon = Ti.UI.createImageView({
		height : BUTTSIZE * 5,
		width : BUTTSIZE * 5,
		bottom : Ti.UI.CONF.padding,
		borderColor : 'silver',
		borderWidth : 1,
		borderradius : 5,
		defaultImage : '/assets/camera.png',
		left : Ti.UI.CONF.padding,
	});
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
		height : 60
	});
	self.slider = Ti.UI.createSlider({
		top : 10,
		max : 10,
		min : 0,
	});

	self.button = Ti.UI.createButton({
		bottom : Ti.UI.CONF.padding,
		backgroundImage : '/assets/cloud.png',
		color : 'white',
		font : {
			fontWeight : 'bold'
		},
		borderRadius : 10,
		width : BUTTSIZE * 1.4,
		height : BUTTSIZE,
		right : Ti.UI.CONF.padding,
	});
	self.add(self.container);
	self.container.add(self.comment);
	self.container.add(self.slider);
	self.add(self.icon);
	/*self.container.add(Ti.UI.createLabel({
	 text : 'Bitte beachte die Persönlichkeitsrechte der Mitesser. Nur das Essen ist gemeinfrei.',
	 height : Ti.UI.SIZE,
	 width : Ti.UI.FILL,
	 font : {
	 fontSize : Ti.UI.CONF.fontsize_subtitle,
	 fontFamily : 'TheSansSemiBoldItalic'
	 },
	 top : Ti.UI.CONF.padding,
	 bottom : Ti.UI.CONF.padding
	 }));*/
	/* Events */
	self.button.addEventListener('click', function(_e) {
		require('vendor/mensa.cloud').postComment({
			post : {
				vote : parseInt(self.slider.value),
				comment : self.comment.value || '',
				dish : _title,
				photo : (self.icon.newphoto) ? self.photo : null
			},
			onsuccess : function() {
				self.button.show();
			}
		});
		self.button.hide();
	});
	self.icon.addEventListener('click', function() {
		Ti.Media.showCamera({
			allowEditing : true,
			autohide : true,
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
			showControls : true,
			success : function(_e) {
				self.icon.setImage(_e.media);
				self.icon.newphoto = true;
				// show
				self.photo = _e.media;
				// save
			}
		})
	});
	return self;
}
