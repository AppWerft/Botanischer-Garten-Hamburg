exports.create = function() {

	var win = Ti.UI.createWindow();

	function myOnDisplayItem(e) {
	}

	var myTemplate = {
		properties : {
			onDisplayItem : myOnDisplayItem,
			selectedBackgroundColor : 'blue',
			height : 60,
		},
		events : {},
		childTemplates : [{
			type : 'Ti.UI.Label',
			id : 'cellLabel',
			properties : {
				color : '#576996',
				font : {
					fontFamily : 'Arial',
					fontSize : 13,
					fontWeight : 'bold'
				},
				left : 70,
				top : 6,
				width : 200,
				height : 30,
			},
			events : {}
		}, {
			type : 'Ti.UI.ImageView',
			id : 'cellImage',
			properties : {
				image : '/images/default.png',
				left : 70,
				top : 6,
				width : 200,
				height : 30,
			},
			events : {
				click : function(e) {
					var index = e.rowIndex;
					var section = e.section;
					var data = section.getItemAt(index);
					data.cellLabel.text += ' Clicked!';
					section.replaceItemsAt(index, 1, data);
				}
			}
		}]
	};

	var section = Ti.UI.createListSection({
		headerTitle : 'Section Title'
	});
	var listView = Ti.UI.createListView({
		templates : {
			myCell : myTemplate
		},
		sections : [section],
		backgroundColor : 'white',
	});
	win.add(listView);
	win.open();

	section.setItems([{
		template : 'myCell',
		properties : {
			accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK
		},
		cellLabel : {
			text : 'Cell 1 Text',
			color : 'red'
		},
		cellImage : {
			image : 'images/image1.png'
		}
	}, {
		template : 'myCell',
		properties : {
			accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK
		},
		cellLabel : {
			text : 'Cell 2 Text',
			color : 'green'
		},
		cellImage : {
			image : 'images/image2.png'
		}
	}, {
		template : 'myCell',
		cellLabel : {
			text : 'Cell 3 Text'
		},
		cellImage : {
			image : 'images/image3.png'
		}
	}, {
		template : Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE,
		properties : {
			title : 'Cell Title',
			subtitle : 'Cell Subtitle',
			image : '/images/pin.png'
		}
	}]);
return win;
}