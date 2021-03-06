exports.create = function(_ordnung) {
	const BUTTONHEIGHT = 65, BUTTONWIDTH = 75;
	var self = require('ui/win').create('Familienfilter');
	var sections = [];
	var areas = require('model/taxonomy.model').getFilter('en');
	setTimeout(function() {
		self.listview_of_filterquestions = Ti.UI.createListView({
			templates : {
				'filterrow' : require('ui/TEMPLATES').filterrow,
				'filterrow_selected' : require('ui/TEMPLATES').filterrow_selected
			},
			defaultItemTemplate : 'filterrow'
		});
		for (var area in areas) {
			var questions = [];
			for (var id in areas[area]) {
				questions.push({
					template : 'filterrow',
					title : {
						text : areas[area][id].replace(/^\s/, '')
					},
					properties : {
						selectionStyle : Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
						allowsSelection : false,
						itemId : id,
						selected : false,
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
			width : BUTTONWIDTH,
			right : 0,
			color : 'white',
			borderRadius : 5,
			title : '➧',
			font : {
				fontSize : 80
			},
			backgroundImage : '/assets/buttonbg.png',
			height : BUTTONHEIGHT,
			data : []
		});
		okButton.addEventListener('click', function() {
			self.tab.open(require('ui/taxo.familiesbyfilter.window').create(okButton.data));
		});
		// Maps the plai	nTemplate object to the 'plain' style name);
		var familysection = Ti.UI.createListSection();
		self.familylist = Ti.UI.createListView({
			right : BUTTONWIDTH,
			height : BUTTONHEIGHT,
			backgroundColor : '#333',
			bottom : 0,
			separatorStyle : '#8a8',
			templates : {
				'familystrip' : require('ui/TEMPLATES').familystrip,
			},
			defaultItemTemplate : 'familystrip',
			sections : [familysection]
		});
		self.total = Ti.UI.createLabel({
			color : 'silver',
			bubbleParent : true,
			touchEnabled : false,
			font : {
				fontSize : 64,
				fontWeight : 'bold',
				fontFamily : 'TheSans-B7Bold'
			},
			shadowOffset : {
				x : 1,
				y : 1
			},
			shadowColor : 'gray',
			height : 64,
			opacity : 0.3,
			top : 10,
			right : 5
		});
		self.familylist.add(self.total);
		self.listview_of_filterquestions.addEventListener('itemclick', function(_e) {
			var item = _e.section.getItemAt(_e.itemIndex);
			if (!item.selected) {
				item.template = 'filterrow_selected';
				item.selected = true;
			} else {
				item.selected = false;
				item.template = 'filterrow';
			}
			_e.section.updateItemAt(_e.itemIndex, item);
			// collecting of all rows:
			var plantproperties = [];
			var sections = self.listview_of_filterquestions.getSections();
			for (var s = 0; s < sections.length; s++) {
				var items = sections[s].items;
				for (var i = 0; i < items.length; i++) {
					if (items[i].selected) {
						plantproperties.push(items[i].properties.itemId);
					}
				}
			}
			require('model/taxonomy.model').searchFamilies(plantproperties, function(_familydata) {
				var count = _familydata.length;
				var data = [];
				for (var i = 0; i < count; i++) {
					data.push({
						template : 'familystrip',
						title : {
							text : _familydata[i]
						},
						properties : {
							selectionStyle : Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
							allowsSelection : false,
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_NONE
						}
					});
				}
				familysection.setItems(data);
				self.familylist.setSections([familysection]);
				if (count > 0)
					self.listview_of_filterquestions.setBottom(BUTTONHEIGHT);
				else {
					self.listview_of_filterquestions.setBottom(0);
					okButton.data = [];
				}
				self.total.opacity = 0;
				self.total.setText(count);
				self.total.animate({
					opacity : 1
				});
			});
		});
		self.add(okButton);
		self.add(self.familylist);
		self.add(self.listview_of_filterquestions);
	}, 0);
	return self;
};
