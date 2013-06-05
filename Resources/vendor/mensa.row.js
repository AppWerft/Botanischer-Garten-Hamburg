exports.create = function(_item) {
	var name = _item.text;
	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		data : {
			title : name,
			latlon : _item.latlon
		}
	});
	row.add(Ti.UI.createImageView({
		width : 80,
		bottom : Ti.UI.SIZE,
		left : 0,
		top : 0,
		image : '/assets/sw/hamburg.png'
	}));
	var container = Ti.UI.createView({
		left : 90,
		right : 10,
		height : Ti.UI.SIZE,
		layout : 'vertical',
		width : Ti.UI.SIZE,
		top : Ti.UI.CONF.padding / 2
	});
	row.add(container);
	container.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		bottom : Ti.UI.CONF.padding / 2,
		left : 0,
		top : Ti.UI.CONF.padding / 2,
		font : {
			fontSize : Ti.UI.CONF.fontsize_title * 0.95,
			fontWeight : 'bold',
			fontFamily : 'TheSans-B7Bold'
		},
		height : Ti.UI.CONF.fontsize_title * 2.2,
		text : name
	}));

	container.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		top : 0,
		bottom : Ti.UI.CONF.padding / 2,
		right : Ti.UI.CONF.padding / 2,
		color : '#444',
		font : {
			fontSize : Ti.UI.CONF.fontsize_subtitle,
			fontFamily : 'TheSansSemiBoldItalic'
		},
		height : Ti.UI.CONF.fontsize_subtitle * 1.1,
		textAlign : 'right',
		text : 'Preis für Studierende: ' + _item.prize
	}));
	var voting = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : 30,
		top : 80,
		layout : 'horizontal'
	});
	row.add(voting);
	require('vendor/mensa.cloud').getVoting(_item.text, function(_count) {
		for (var i = 0; i < _count; i++) {
			voting.add(Ti.UI.createImageView({
				image : '/assets/star.png',
				width : 24,
				height : 24,
				left : 0
			}))
		}
	});
	row.add(require('vendor/gallery').create(name));
	return row;
}
