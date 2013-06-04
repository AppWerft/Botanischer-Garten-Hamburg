exports.create = function() {
	var mensa = {
		title : 'Mensa Botanischer Garten',
		url : 'hamburg/mensa-botanischer-garten',
		wus : 'hamburg',
		latlon : '53.5582243,9.8602935'
	};
	updateTable = function() {
		console.log('updateTable');
		console.log(mensa);
		self.setTitle(mensa.title);
		require('vendor/mensa.network').getMenue(mensa.url, function(_menue) {
			self.actind.hide();
			if (!_menue) {
				self.tv.setData([]);
				return;
			}
			self.setTitle(mensa.title);
			var sections = [];
			for (var m = 0; m < _menue.length; m++) {
				sections.push(Ti.UI.createTableViewSection({
					headerTitle : _menue[m].name
				}));
				for (var i = 0; i < _menue[m].items.length; i++) {
					var name = _menue[m].items[i].text;

					var row = Ti.UI.createTableViewRow({
						height : Ti.UI.SIZE,
						backgroundColor : 'white',
						data : {
							title : _menue[m].items[i].text,
							latlon : _menue[m].items[i].latlon
						}
					});
					row.add(Ti.UI.createImageView({
						width : 80,
						bottom : Ti.UI.SIZE,
						left : 0,
						top : 0,
						image : '/assets/sw/hamburg.png'
					}));
					var container = Ti.UI.createView({
						left : 90,
						right : 10,
						height : Ti.UI.SIZE,
						layout : 'vertical',
						width : Ti.UI.SIZE,
						top : Ti.UI.CONF.padding / 2
					});
					row.add(container);
					container.add(Ti.UI.createLabel({
						width : Ti.UI.FILL,
						bottom : Ti.UI.CONF.padding / 2,
						left : 0,
						top : Ti.UI.CONF.padding / 2,
						font : {
							fontSize : Ti.UI.CONF.fontsize_title * 0.95,
							fontWeight : 'bold',
							fontFamily : 'TheSans-B7Bold'
						},
						height : Ti.UI.CONF.fontsize_title * 2.2,
						text : name
					}));

					container.add(Ti.UI.createLabel({
						width : Ti.UI.FILL,
						top : 0,
						bottom : Ti.UI.CONF.padding / 2,
						right : Ti.UI.CONF.padding / 2,
						color : '#444',
						font : {
							fontSize : Ti.UI.CONF.fontsize_subtitle,
							fontFamily : 'TheSansSemiBoldItalic'
						},
						height : Ti.UI.CONF.fontsize_subtitle * 1.1,
						textAlign : 'right',
						text : 'Preis für Studierende: ' + _menue[m].items[i].prize
					}));
					var voting = Ti.UI.createView({
						width : Ti.UI.FILL,
						height : 30,
						top : 80,
						layout : 'horizontal'
					});
					row.add(voting);
					require('vendor/mensa.cloud').getVoting(_menue[m].items[i].text, function(_count) {
						for (var i = 0; i < _count; i++) {
							voting.add(Ti.UI.createImageView({
								image : '/assets/star.png',
								width : 24,
								height : 24,
								left : 0
							}))
						}
					});
					row.add(require('vendor/gallery').create(name));
					sections[m].add(row);
				}
			}
			self.tv.setData(sections);
		});
	}
	var self = require('module/win').create('UHH✦intern', true);

	self.backgroundImage = 'Default.png';
	self.rightButton = Ti.UI.createButton({
		backgroundImage : '/assets/besteck.png',
		width : 40,
		height : 40
	});
	self.rightNavButton = self.rightButton;
	self.tv = Ti.UI.createTableView({
		backgroundColor : 'transparent'
	});
	self.add(self.tv);
	var dialogView = require('uhhlogin/dialog').create();
	dialogView.zIndex = 999;
	self.addEventListener('focus', function() {
		dialogView.show();
	});
	self.addEventListener('blur', function() {
		dialogView.hide();
	});
	self.picker = require('module/mensa.picker').create(require('vendor/mensa.network').mensen, function(_data) {
		mensa = _data;
		console.log('CANTEEN changed by picker');
		console.log(mensa);
		if (self.picker)
			self.picker.animate({
				bottom : -280
			});
		self.tv.setData([]);
		self.actind.setMessage('Erwarte Speiseplan …');
		self.actind.show();
		updateTable(mensa);
	});
	self.add(self.picker);

	self.addEventListener('focus', updateTable)
	self.tv.addEventListener('click', function(_e) {
		self.tab.open(require('vendor/mensa.social.window').create(_e.rowData.data.title, _e.rowData.data.latlon));
	});
	self.rightButton.addEventListener('click', function() {
		self.picker.animate({
			bottom : 0
		});

	});
	return self;
}
