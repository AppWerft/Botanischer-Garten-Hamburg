exports.create = function() {
	var self = Ti.UI.createWindow({
		navBarHidden : true
	});
	self.add(Ti.UI.createImageView({
		width : Ti.UI.FILL,
		image : '/assets/head1.png',
		top : 0
	}));
	self.tv = Ti.UI.createTableView({
		top : 60,
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
				html : e.description
			});
			rows[i].add(Ti.UI.createLabel({
				text : e.title.split(' | ')[0],
				width : Ti.UI.FILL,
				color : '#060',
				left : 10,
				top : 5,
				font : {
					fontWeight : 'bold',
					fontSize : 20
				}
			}));
			rows[i].add(Ti.UI.createLabel({
				text : e.title.split(' | ')[1],
				width : Ti.UI.FILL,
				left : 10,
				bottom : 5
			}));
		}
		self.tv.setData(rows);
	})

	self.tv.addEventListener('click', function(_e) {
		var win = Ti.UI.createWindow({
			navBarHidden : true,
			backgroundColor : 'white'
		});
		win.add(Ti.UI.createImageView({
			width : Ti.UI.FILL,
			image : '/assets/head1.png',
			top : 0
		}));
		win.add(Ti.UI.createWebView({
			top : 60,
			html : '<style>* {font-family:Helvetica} a {text-decoration:none;color:black}h1,h2,h3 {color:#060}</style>' + _e.rowData.html,
			disableBounce : true
		}));console.log(_e.rowData.html);
		win.addEventListener('swipe', function() {
			win.close({
				animate : true
			});
		});
		self.tab.open(win, {
			animate : true
		});
	});
	return self;
}
