exports.create = function() {
	var self = require('ui/win').create('Veranstaltungen');

	var calbutton = Ti.UI.createButton({
		title : 'Kalender'
	});
	self.rightNavButton = calbutton;
	calbutton.addEventListener('click', function() {
		self.tab.open(require('ui/calendar.window').create())
	});
	self.tv = Ti.UI.createTableView({
		top : 0,
		height : Ti.UI.FILL,
		backgroundImage : '/assets/bg.png'
	});
	self.add(self.tv);

	Ti.App.LokiModel.getCalendar(function(_events) {
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
					fontFamily : 'TheSans-B7Bold',
					fontSize : Ti.UI.CONF.fontsize_subtitle,
				}
			}));
		}
		self.tv.setData(rows);
	});

	self.tv.addEventListener('click', function(_e) {
		var win = require('ui/win').create(_e.rowData.titletext, true);
		win.add(Ti.UI.createWebView({
			html : '<html><head><style>* {font-size:10pt!important;font-family:Helvetica} a {text-decoration:none;color:black}h1,h2,h3 {color:#060}</style></head><body>' + _e.rowData.html + '</body></html>',
			disableBounce : true,
		}));
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
};
