exports.create = function(_title) {
	var self = require('module/win').create(_title, true);
	var Cloud = require('ti.cloud');
	Cloud.debug = true;
	self.backgroundColor = 'white';
	Cloud.Objects.query({
		classname : 'mensa',
	}, function(e) {
		if (e.success) {
			for (var i = 0; i < e.mensa.length; i++) {
				var mensa = e.mensa[i];
				alert('id: ' + mensa.id + '\n' + 'make: ' + mensa.vote + '\n' + 'color: ' + mensa.message + '\n' + 'year: ' + car.year + '\n' + 'created_at: ' + car.created_at);
			}
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
	self.container = Ti.UI.createView({
		layout : 'vertical',
		top : Ti.UI.CONF.padding,
		left : Ti.UI.CONF.padding,
		right : Ti.UI.CONF.padding
	});
	setTimeout(function() {
		self.container.add(Ti.UI.createLabel({
			text : 'Hier kannst Du nach Herzenslust soscheleisen. Du kannst das Essen kommentieren, photographieren und bewerten.',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			font : {
				fontSize : Ti.UI.CONF.fontsize_subtitle,
				fontFamily : 'TheSansSemiBoldItalic'
			},
			top : Ti.UI.CONF.padding,
			bottom : Ti.UI.CONF.padding

		}));
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
			height : 100
		});
		self.slider = Ti.UI.createSlider({
			top : Ti.UI.CONF.padding,
			max : 10,
			min : 0
		});
		self.button = Ti.UI.createButton({
			top : Ti.UI.CONF.padding,
			backgroundImage : '/assets/buttonbg.png',
			color : 'white',
			borderRadius : 5,
			width : Ti.UI.FILL,
			height : 50,
			title : 'Essens-Photo(s) aufnehmen'
		});
		self.add(self.container);
		self.container.add(self.comment);
		self.container.add(self.slider);
		self.container.add(self.button);
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
		self.slider.addEventListener('stop', function(_e) {
			var post = {
				vote : parseInt(self.slider.value),
				comment : self.comment.value,
				id : Ti.Platform.id
			};
			Cloud.Objects.create({
				classname : 'mensa',
				fields : post
			}, function(e) {
				if (e.success) {
				} else {
					console.log(e);
				}
			});
		})
	}, 100);
	return self;
}
