exports.plantrow = {
	properties : {
		selectedBackgroundColor : 'green',
		height : 60,
		backgroundColor : 'white'
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'deutsch',
		properties : {
			color : '#060',
			height : 30,
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
			top : 35,
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE
		},
		events : {}
	}]
};
