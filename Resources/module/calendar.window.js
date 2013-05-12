exports.create = function() {
	var self = require('module/win').create('Veranstaltungskalender');
	self.tv = Ti.UI.createTableView({
		top : 0,
		height : Ti.UI.FILL,
		backgroundImage : '/assets/bg.png'
	});
	self.add(self.tv);

	require('module/model').getCalendar(function(_events) {
		var rows = [];
		for (var i = 0; i < _events.length; i++) {
			var e = _events[i];
			rows[i] = Ti.UI.createTableViewRow({
				hasChild : true,
				backgroundColor : 'white',
				layout : 'vertical',
				html : e.description,
				height : Ti.UI.SIZE,
				titletext : e.title.split(' | ')[0]
			});
			rows[i].add(Ti.UI.createLabel({
				text : e.title.split(' | ')[0],
				width : Ti.UI.FILL,
				color : '#060',
				left : Ti.UI.CONF.padding,
				top : Ti.UI.CONF.padding / 2,
				font : {
					fontWeight : 'bold',
					fontSize : Ti.UI.CONF.fontsize_title,
					fontFamily : 'TheSans-B7Bold'
				}
			}));
			rows[i].add(Ti.UI.createLabel({
				text : e.title.split(' | ')[1],
				width : Ti.UI.FILL,
				left : Ti.UI.CONF.padding,
				bottom : Ti.UI.CONF.padding / 2,
				font : {
					fontFamily : 'TheSans-B6SemiBold',
					fontSize : Ti.UI.CONF.fontsize_subtitle,
				}
			}));
		}
		self.tv.setData(rows);
	})

	self.tv.addEventListener('click', function(_e) {
		var win = require('module/win').create(_e.rowData.titletext);
		win.add(Ti.UI.createWebView({
			top : 0,
			html : '<style>* {font-family:Helvetica} a {text-decoration:none;color:black}h1,h2,h3 {color:#060}</style>' + _e.rowData.html,
			disableBounce : true
		}));
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
}
