exports.create = function(_ordnung) {
	var self = require('module/win').create('family filter');
	var sections = [];
	var areas = require('module/model').getFilter('en');
	var template = {
		filterrow : require('module/TEMPLATES').filterrow,
	};
	self.listview_of_plantfilter = Ti.UI.createListView({
		templates : {
			'filterrow' : template.filterrow,
		},
		defaultItemTemplate : 'filterrow'
	});
	for (var area in areas) {
		var questions = [];
		for (var id in areas[area]) {
			questions.push({
				template : 'filterrow',
				title : {
					text : areas[area][id]
				},
				properties : {
					itemId : id,
					accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_NONE
				}
			});
		}
		sections.push(Ti.UI.createListSection({
			headerTitle : area,
			items : questions
		}));
	}
	self.listview_of_plantfilter.setSections(sections);
	
	self.add(self.listview_of_plantfilter);
	return self;
}
