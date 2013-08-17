exports.create = function(_bereich) {
	var self = require('ui/win').create(_bereich);
	var backButton = Ti.UI.createButton({
		title : 'Back'
	});
	var mapButton = Ti.UI.createButton({
		width : 40,
		height : 40,
		backgroundImage : '/assets/mappin.png'
	});
	mapButton.addEventListener('click', function() {
		var Map_Module = require('ui/lokimap.window');
		var LokiMap = new Map_Module();
		self.tab.open(LokiMap.createWindow());
	});

	self.rightNavButton = mapButton;
	self.leftNavButton = backButton;
	backButton.addEventListener('click', function() {
		self.close({
			transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
	});
	var plantsTemplate = require('ui/TEMPLATES').plantrow;
	setTimeout(function() {
		var section = undefined;
		Ti.App.LokiModel.getArtenByBereich(_bereich, function(_items) {
			var data = [];
			for (var i = 0; i < _items.length; i++) {
				data.push({
					deutsch : {
						text : _items[i].deutsch
					},
					latein : {
						text : _items[i].gattung + ' ' + _items[i].art
					},
					properties : {
						itemId : _items[i],
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
					}
				});
			}
			section = Ti.UI.createListSection({
				//headerTitle : _bereich,
				items : data,
				backgroundColor : 'white'
			});
		});
		self.listView = Ti.UI.createListView({
			sections : [section],
			templates : {
				'plants' : plantsTemplate
			},
			backgroundColor : 'white',
			defaultItemTemplate : 'plants',
		});
		self.listView.addEventListener('itemclick', function(_e) {
			self.tab.open(require('ui/detail.window').create(_e.itemId), {
				animate : true
			});
		});
		self.add(self.listView);
	}, 10);
	return self;
};