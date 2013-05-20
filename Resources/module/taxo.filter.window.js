exports.create = function(_ordnung) {
	var self = require('module/win').create('Familienfilter');
	var rightButton = Ti.UI.createButton({
		width : 42,
		height : 36,
		borderRadius : 5,
		borderWidth : 1,
		backgroundImage : '/assets/flower.png'
	});
	rightButton.addEventListener('click', function() {
		self.tab.open(require('module/taxo.filterresult.window').create());
	});
	self.rightNavButton = rightButton;
	var sections = [];
	var areas = require('module/model').getFilter('en');
	var template = {
		filterrow : require('module/TEMPLATES').filterrow,
	};
	self.listview_of_filterquestions = Ti.UI.createListView({
		bottom : 50,
		templates : {
			'filterrow' : template.filterrow,
		},
		defaultItemTemplate : 'filterrow'
	});
	for (var area in areas) {
		var questions = [];
		for (var id in areas[area]) {
			console.log(areas[area][id]);
			questions.push({
				template : 'filterrow',
				title : {
					text : areas[area][id].replace(/^\s/, '')
				},
				properties : {
					selectionStyle : Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
					allowsSelection : false,
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
	self.listview_of_filterquestions.setSections(sections);
	// Maps the plai	nTemplate object to the 'plain' style name);
	self.listview_of_filterquestions.addEventListener('itemclick', function(_e) {
		var item = _e.section.getItemAt(_e.itemIndex);
		if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
			item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
		} else {
			item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
		}
		_e.section.updateItemAt(_e.itemIndex, item);
		// collecting of all rows:
		var activefilters = [];
		var sections = self.listview_of_filterquestions.getSections();
		for (var s = 0; s < sections.length; s++) {
			var items = sections[s].items;
			for (var i = 0; i < items.length; i++) {
				if (items[i].properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK) {
					activefilters.push(items[i].properties.itemId);
				}
			}
		}
		require('module/model').searchFamilies(activefilters, function(_data) {
			console.log(_data);
		});
	});
	self.add(self.listview_of_filterquestions);
	return self;
}
