exports.create = function(_familie) {
	var self = require('module/win').create(_familie);
	var plantsTemplate = {
		properties : {
			onDisplayItem : function() {
			},
			selectedBackgroundColor : 'green',
			height : 80,
			height : Ti.UI.SIZE,
			backgroundColor : 'white',
			layout : 'vertical'
		},
		events : {},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'deutsch',
			properties : {
				color : '#060',
				font : {
					fontSize : 20,
					fontWeight : 'bold'
				},
				left : 10,
				top : 5,
				width : Ti.UI.FILL,
			},
			events : {}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'latein',
			properties : {
				font : {
					fontFamily : 'FreeSerifItalic',
					fontStyle : 'italic'
				},
				left : 10,
				top : 5,
				width : Ti.UI.FILL,
			},
			events : {}
		}]
	};
	var sections = [];
	require('module/model').getGattungenByFamilie(_familie, function(_results) {
		for (var i = 0; i < _results.length; i++) {
			var data = [];
			require('module/model').getArtenByGattung(_results[i], function(_items) {
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
		backgroundColor : 'transparent',
		defaultItemTemplate : 'plants',
	});
	self.add(self.listView);
	return self;
}