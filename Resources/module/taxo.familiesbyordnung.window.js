exports.create = function(_ordnung) {
	var self = require('module/win').create(_ordnung);
	var taxonomysections = [], searchresultsections = [], timer = undefined;
	var ordnungen = require('module/model').getFamilienByOrdnung(_ordnung);
	var template = {
		widthdetail : require('module/TEMPLATES').activefamilyrow,
		widthoutdetail : require('module/TEMPLATES').passivefamilyrow,
		searchresult : require('module/TEMPLATES').plantrow,
	};
	self.listview_of_taxonomy = Ti.UI.createListView({
		templates : {
			'widthdetail' : template.widthdetail,
			'widthoutdetail' : template.widthoutdetail
		},
		defaultItemTemplate : 'widthdetail'
	});
	for (var ordnung in ordnungen) {
		var familiensection_in_ordnung = [];
		for (var o = 0; o < ordnungen[ordnung].length; o++) {
			var children = ordnungen[ordnung][o].total;
			familiensection_in_ordnung.push({
				template : (children > 0) ? 'widthdetail' : 'widthoutdetail',
				title : {
					text : (ordnungen[ordnung][o].total) ? ordnungen[ordnung][o].name + ' (' + ordnungen[ordnung][o].total + ')' : ordnungen[ordnung][o].name
				},
				properties : {
					selectionStyle : Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
					allowsSelection : (children > 0) ? true : false,
					itemId : {
						familie : ordnungen[ordnung][o].name
					},
					accessoryType : (children > 0) ? Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE : Ti.UI.LIST_ACCESSORY_TYPE_NONE
				}
			});
		}
		taxonomysections.push(Ti.UI.createListSection({
			headerTitle : ordnung,
			items : familiensection_in_ordnung
		}));
	}
	self.listview_of_taxonomy.setSections(taxonomysections);
	self.listview_of_taxonomy.addEventListener('itemclick', function(_e) {
		var item = _e.section.getItemAt(_e.itemIndex);
		if (item.properties.accessoryType === Ti.UI.LIST_ACCESSORY_TYPE_NONE)
			return;
		var detail = item.properties.itemId;
		if (detail.familie)
			self.tab.open(require('module/taxo.gattungoffamily.window').create(detail.familie));

	});
	self.add(self.listview_of_taxonomy);
	return self;
}
