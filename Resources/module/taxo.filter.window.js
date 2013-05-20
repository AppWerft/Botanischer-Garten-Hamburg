exports.create = function(_ordnung) {
	const BUTTONHEIGHT = 45;
	var self = require('module/win').create('Familienfilter');
	var sections = [];
	setTimeout(function() {
		var areas = require('module/model').getFilter('de');
		var template = {
			filterrow : require('module/TEMPLATES').filterrow,
		};
		self.listview_of_filterquestions = Ti.UI.createListView({
			bottom : 0,
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

		var okButton = Ti.UI.createButton({
			bottom : 0,
			width : '100%',
			color : 'white',
			borderRadius : 5,
			backgroundImage : '/assets/buttonbg.png',
			height : BUTTONHEIGHT,
			font : {
				fontWeight : 'bold',
				fontSize : 16
			},
			shadowOffset : {
				x : 1,
				y : 1
			},
			shadowColor : 'gray',
			data : []
		});
		okButton.addEventListener('click', function() {
			self.tab.open(require('module/taxo.familiesbyfilter.window').create(okButton.data));
		});
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
				var count = _data.length;
				switch (true) {
					case (count==1):
						self.listview_of_filterquestions.setBottom(BUTTONHEIGHT);
						okButton.title = _data[0];
						okButton.data = _data;
						break;
					case (count >1)	:
						self.listview_of_filterquestions.setBottom(BUTTONHEIGHT);
						okButton.title = count + ' Familien gefunden';
						okButton.data = _data;
						break;
					default:
						self.listview_of_filterquestions.setBottom(0);
						okButton.data = [];
						break
				}

			});
		});
		self.add(okButton);
		self.add(self.listview_of_filterquestions);
	}, 0);
	return self;
}
