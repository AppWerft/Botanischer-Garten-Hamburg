exports.plantrow = {
	properties : {
		selectedBackgroundColor : 'green',
		height : 60,
		backgroundColor : 'white'
	},
	childTemplates : [{
		type : 'Ti.UI.View',
		properties : {
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			layout : 'vertical'
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'deutsch',
			properties : {
				color : '#060',
				height : 24,
				font : {
					fontSize : 20,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
				left : 10,
				top : 10,
				width : Ti.UI.FILL,
			},
			events : {}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'latein',
			properties : {
				font : {
					fontFamily : 'TheSansSemiBoldItalic',
					fontStyle : 'italic'
				},
				left : 10,
				top : 0,bottom:5,
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE
			},
			events : {}
		}]
	}]
};
