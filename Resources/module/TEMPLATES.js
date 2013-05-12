exports.plantrow = {
	properties : {
		height : Ti.UI.CONF.fontsize_title * 2.8
	},
	childTemplates : [{
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'deutsch',
			properties : {
				color : '#060',
				height : Ti.UI.CONF.fontsize_title * 1.2,
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
				bottom : Ti.UI.CONF.padding,
				width : Ti.UI.FILL,
				height : Ti.UI.CONF.fontsize_title
			},
			events : {}
		}]
	}]
};
