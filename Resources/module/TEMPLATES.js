exports.plantrow = {
	properties : {
	},
	childTemplates : [{
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			height : 150
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'deutsch',
			properties : {
				color : '#060',
				height : Ti.UI.SIZE,
				font : {
					fontSize : Ti.UI.CONF.fontsize_title,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
				left : Ti.UI.CONF.padding,
				top : Ti.UI.CONF.padding / 2,
				width : Ti.UI.FILL,
				bottom : 0
			},
			events : {}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'latein',
			properties : {
				font : {
					fontFamily : 'TheSansSemiBoldItalic',
					fontStyle : 'italic',
					fontSize : Ti.UI.CONF.fontsize_subtitle
				},
				left : Ti.UI.CONF.padding,
				top : 0,
				bottom : Ti.UI.CONF.padding / 2,
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE
			},
			events : {}
		}]
	}]
};
