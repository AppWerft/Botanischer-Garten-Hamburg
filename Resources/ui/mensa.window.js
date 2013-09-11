exports.create = function() {
	var mensa = Ti.App.Properties.hasProperty('mensa') ? JSON.parse(Ti.App.Properties.getString('mensa')) : {
		title : 'Mensa Botanischer Garten',
		url : 'hamburg/mensa-botanischer-garten',
		wus : 'hamburg',
		latlon : '53.5582243,9.8602935'
	};
	updateTable = function() {
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
					sections[m].add(require('vendor/mensa.row').create(_menue[m].items[i]));
				}
			}
			self.tv.setData(sections);
		});
	};
	var self = require('ui/win').create('UHH✦intern', true);
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
	self.picker = require('ui/mensa.picker').create(require('vendor/mensa.network').mensen, function(_data) {
		Ti.App.Properties.setString('mensa', JSON.stringify(_data));
		mensa = _data;
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
		if (_e.source.bigimage) {
			var bigimage = Ti.UI.createImageView({
				width : Ti.UI.FILL,
				transform : Ti.UI.create2DMatrix({
					scale : 0.01
				}),
				image : _e.source.bigimage
			});
			bigimage.animate({
				transform : Ti.UI.create2DMatrix({
					scale : 1.1,
					duration : 1500
				}, function() {
					bigimage.animate({
						transform : Ti.UI.create2DMatrix({
							scale : 1,
							duration : 5000
						})
					});
				})
			});
			bigimage.addEventListener('click', function() {
				bigimage.animate({
					transform : Ti.UI.create2DMatrix({
						scale : 0.01
					})
				}, function() {
					self.remove(bigimage);
					bigimage = null;
				});

			});
			self.add(bigimage);
		} else {
			self.tab.open(require('vendor/mensa.social.window').create(_e.rowData.data.title, _e.rowData.data.latlon));
		}
	});
	self.addEventListener('focus', function() {
		dialogView.show();
	});
	self.addEventListener('blur', function() {
		dialogView.hide();
	});
	self.rightButton.addEventListener('click', function() {
		self.picker.animate({
			bottom : 0
		});

	});
	return self;
};
