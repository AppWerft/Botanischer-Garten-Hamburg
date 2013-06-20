exports.create = function(_ordnung) {
	var self = require('module/win').create(_ordnung);
	var taxonomysections = [];

	var familien = require('module/botanicgarden.model').getFamilienByOrdnung(_ordnung);
	console.log(familien);
	var template = {
		widthdetail : require('module/TEMPLATES').activefamilyrow,
		widthoutdetail : require('module/TEMPLATES').passivefamilyrow
	};
	self.listview_of_orders = Ti.UI.createListView({
		templates : {
			'widthdetail' : template.widthdetail,
			'widthoutdetail' : template.widthoutdetail
		},
		defaultItemTemplate : 'widthdetail'
	});
	for (var familie in familien) {
		var gattung_in_familie = [];
		for (var o = 0; o < familien[familie].length; o++) {
			var children = familien[familie][o].total;
			gattung_in_familie.push({
				template : (children > 0) ? 'widthdetail' : 'widthoutdetail',
				title : {
					text : (familien[familie][o].total) ? familien[familie][o].name + ' (' + familien[familie][o].total + ')' : familien[familie][o].name
				},
				properties : {
					selectionStyle : Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
					allowsSelection : (children > 0) ? true : false,
					itemId : {
						familie : familien[familie][o].name
					},
					accessoryType : (children > 0) ? Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE : Ti.UI.LIST_ACCESSORY_TYPE_NONE
				}
			});
		}
		taxonomysections.push(Ti.UI.createListSection({
			headerTitle : familie,
			items : gattung_in_familie
		}));
	}
	self.listview_of_orders.setSections(taxonomysections);

	self.add(self.listview_of_orders);

	self.listview_of_orders.addEventListener('itemclick', function(_e) {
		var item = _e.section.getItemAt(_e.itemIndex);
		if (item.properties.accessoryType === Ti.UI.LIST_ACCESSORY_TYPE_NONE)
			return;
		var detail = item.properties.itemId;
		if (detail.familie)
			self.tab.open(require('module/taxo.gattungoffamily.window').create(detail.familie));

	});
	return self;
}
