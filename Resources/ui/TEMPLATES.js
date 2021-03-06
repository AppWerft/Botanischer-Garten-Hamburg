exports.activefamilyrow = {
	properties : {
		height : Ti.UI.CONF.fontsize_title * 2.2
	},
	childTemplates : [{
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				color : '#060',
				height : Ti.UI.CONF.fontsize_title * 1.2,
				font : {
					fontSize : Ti.UI.CONF.fontsize_title,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
				left : Ti.UI.CONF.padding,
				width : Ti.UI.FILL,
			},
			events : {}
		}]
	}]
};

exports.passivefamilyrow = {
	properties : {
		height : Ti.UI.CONF.fontsize_title * 2.2
	},
	childTemplates : [{
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				color : '#aaa',
				height : Ti.UI.CONF.fontsize_title * 1.2,
				font : {
					fontSize : Ti.UI.CONF.fontsize_title,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
				left : Ti.UI.CONF.padding,
				width : Ti.UI.FILL,
			},
			events : {}
		}]
	}]
};

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

exports.filterrow = {
	properties : {
		height : Ti.UI.CONF.fontsize_title * 2.8
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			color : '#444',
			height : Ti.UI.CONF.fontsize_title * 2.4,
			font : {
				fontSize : Ti.UI.CONF.fontsize_title,
				fontWeight : 'bold',
				fontFamily : 'TheSans-B7Bold'
			},
			left : Ti.UI.CONF.padding,
			right : Ti.UI.CONF.padding,
			top : Ti.UI.CONF.padding / 2,
			width : Ti.UI.FILL,
			bottom : Ti.UI.CONF.padding / 2
		}
	}]
};

exports.filterrow_selected = {
	properties : {
		height : Ti.UI.CONF.fontsize_title * 2.8,
		backgroundColor : '#bbffbb',
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			color : '#111',

			height : Ti.UI.CONF.fontsize_title * 2.4,
			font : {
				fontSize : Ti.UI.CONF.fontsize_title,
				fontWeight : 'bold',
				fontFamily : 'TheSans-B7Bold'
			},
			left : Ti.UI.CONF.padding,
			right : Ti.UI.CONF.padding * 2,
			top : Ti.UI.CONF.padding / 2,
			width : Ti.UI.FILL,
			bottom : Ti.UI.CONF.padding / 2
		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			backgroundColor : '#383',
			height : 0.6,
			bottom : 0,
			width : Ti.UI.FILL
		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			backgroundColor : '#383',
			height : 0.6,
			top : 0,
			width : Ti.UI.FILL
		}
	}]
};
exports.familystrip = {
	properties : {
		height : Ti.UI.CONF.fontsize_subtitle * 1.5,
		backgroundColor : '#222',
	},
	childTemplates : [{
		type : 'Ti.UI.View',
		properties : {
			backgroundColor : '#343',
			height : 1,
			bottom : 0,
			width : Ti.UI.FILL
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			color : '#eee',
			height : Ti.UI.CONF.fontsize_subtitle * 1.2,
			font : {
				fontSize : Ti.UI.CONF.fontsize_subtitle,
			},
			left : Ti.UI.CONF.padding / 2,
			right : Ti.UI.CONF.padding * 2,
			width : Ti.UI.FILL,
		}
	}]
};

exports.intkeys = {
	properties : {
		height : 60,
		backgroundColor : '#fff',
	},
	childTemplates : [{
		type : 'Ti.UI.View',
		properties : {
			backgroundColor : '#fff',
			width : Ti.UI.FILL
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			color : '#333',
			font : {
				fontSize : Ti.UI.CONF.fontsize_title,
				fontWeight : 'bold',
				fontFamily : 'TheSans-B7Bold'
			},
			left : Ti.UI.CONF.padding,
			right : Ti.UI.CONF.padding,
			width : Ti.UI.FILL,
		}
	}]
};

