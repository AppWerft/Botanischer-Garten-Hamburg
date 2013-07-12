exports.create = function(_list) {
	var self = require('module/win').create('Gefundene Familien');
	var taxonomysections = [];
	var familien = Ti.App.LokiModel.getFamilienByList(_list);
	return self;
}/*
exports.create = function(_familie) {
	var self = require('module/win').create(_familie);
	var plantsTemplate = require('module/TEMPLATES').plantrow;
	setTimeout(function() {
		var sections = [];
		Ti.App.LokiModel.getGattungenByFamilie(_familie, function(_results) {
			for (var i = 0; i < _results.length; i++) {
				var data = [];
				Ti.App.LokiModel.getArtenByGattung(_results[i], function(_items) {
					for (var a = 0; a < _items.length; a++) {
						data.push({
							deutsch : {
								text : _items[a].deutsch
							},
							latein : {
								text : _items[a].gattung + ' ' + _items[a].art
							},
							properties : {
								itemId : _items[a],
								accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
							}
						});
					}
				});
				sections[i] = Ti.UI.createListSection({
					headerTitle : _results[i],
					items : data,
					backgroundColor : 'white'
				});
			}
		});
		self.listView = Ti.UI.createListView({
			sections : sections,
			templates : {
				'plants' : plantsTemplate
			},
			defaultItemTemplate : 'plants',
			layout : 'vertical'
		});
		self.listView.addEventListener('itemclick', function(_e) {
			self.tab.open(require('module/detail.window').create(_e.itemId), {
				animate : true
			});
		});
		self.add(self.listView);
	}, 100);
	return self;
}*/