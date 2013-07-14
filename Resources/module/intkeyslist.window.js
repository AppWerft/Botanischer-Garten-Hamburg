exports.create = function(_familie) {
	var self = require('module/win').create('iDelta');
	var sections = [];
	
	var items = Ti.App.IntkeyModel.getList();
	for (var type in items) {

		var data = [];
		for (var i = 0; i < items[type].length; i++) {
			if (items[type][i].name != "") {
				data.push({
					title : {
						text : items[type][i].name
					},
					properties : {
						itemId : items[type][i],
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
					}
				});
				console.log(items[type][i]);
			}
		}

		sections.push(Ti.UI.createListSection({
			headerTitle : type,
			items : data
		}));
	}

	self.listView = Ti.UI.createListView({
		sections : sections,
		templates : {
			'intkeys' : require('module/TEMPLATES').intkeys
		},
		defaultItemTemplate : 'intkeys'
	});
	self.listView.addEventListener('itemclick', function(_e) {
		self.tab.open(require('module/intkey.window').create(_e.itemId.id), {
		   animate : true
		 });
	});
	self.add(self.listView);

	return self;
}