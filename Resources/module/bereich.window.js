exports.create = function(_bereich) {
	var self = require('module/win').create(_bereich);
	var plantsTemplate = require('module/TEMPLATES').plantrow;setTimeout(function(){
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
		self.tab.open(require('module/detail.window').create(_e.itemId), {
			animate : true
		});
	});
	self.add(self.listView);},10);
	return self;
}