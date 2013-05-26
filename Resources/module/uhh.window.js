exports.create = function() {
	var self = require('module/win').create('UHH✦intern', true);
	self.backgroundImage = 'Default.png';
	var dialogView = require('uhhlogin/dialog').create();

	self.addEventListener('focus', function() {
		dialogView.show();
	});
	self.addEventListener('blur', function() {
		dialogView.hide();
	});
	self.tv = Ti.UI.createTableView();

	self.add(self.tv);
	self.picker = require('module/mensa.picker').create(require('vendor/mensa').mensen, function(_data) {
		if (self.picker)
			self.picker.animate({
				bottom : -200
			});
		require('vendor/mensa').getMenue(_data.url, function(_menue) {
			if (!_menue) {
				self.tv.setData([]);
				return;
			}
			self.setTitle(_data.title);
			console.log(_data);
			var sections = [];
			for (var m = 0; m < _menue.length; m++) {
				sections.push(Ti.UI.createTableViewSection({
					headerTitle : _menue[m].name
				}));
				for (var i = 0; i < _menue[m].items.length; i++) {
					var row = Ti.UI.createTableViewRow({
						height : Ti.UI.SIZE
					});
					row.add(Ti.UI.createImageView({
						width : 80,
						bottom : Ti.UI.SIZE,
						left : 0,
						top : 0,
						image : '/assets/sw/' + _data.sw + '.png'
					}));
					var container = Ti.UI.createView({
						left : 90,
						height : Ti.UI.SIZE,
						layout : 'vertical',
						width : Ti.UI.SIZE
					});
					row.add(container);
					container.add(Ti.UI.createLabel({
						width : Ti.UI.FILL,
						bottom : Ti.UI.CONF.padding / 2,
						left : 0,
						top : Ti.UI.CONF.padding / 2,
						font : {
							fontSize : Ti.UI.CONF.fontsize_title,
							fontWeight : 'bold',
							fontFamily : 'TheSans-B7Bold'
						},
						height : Ti.UI.CONF.fontsize_title * 2.5,
						text : _menue[m].items[i].text
					}));
					container.add(Ti.UI.createLabel({
						width : Ti.UI.FILL,
						top : Ti.UI.CONF.padding / 2,
						bottom : Ti.UI.CONF.padding / 2,
						right : Ti.UI.CONF.padding / 2,
						color : '#444',
						font : {
							fontSize : Ti.UI.CONF.fontsize_subtitle,
							fontFamily : 'TheSansSemiBoldItalic'
						},
						height : Ti.UI.CONF.fontsize_subtitle * 1.2,
						textAlign : 'right',
						text : 'Preis für Studierende: ' + _menue[m].items[i].prize
					}));
					sections[m].add(row);
				}
			}
			self.tv.setData(sections);
		});
	});
	self.add(self.picker);
	self.tv.addEventListener('longpress', function() {
		self.picker.animate({
			bottom : 0
		});

	})
	return self;
}
