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
		height : Ti.UI.FILL
	});
	self.add(self.tv);

	require('module/model').getCalendar(function(_events) {
		var rows = [];
		for (var i = 0; i < _events.length; i++) {
			var e = _events[i];
			rows[i] = Ti.UI.createTableViewRow({
				hasChild : true,
				layout : 'vertical',
				html : e.description
			});
			rows[i].add(Ti.UI.createLabel({
				text : e.title.split(' | ')[0],
				width : Ti.UI.FILL,
				color : '#aaa',
				left : 10,
				font : {
					fontWeight : 'bold',
					fontSize : 20
				}
			}));
			rows[i].add(Ti.UI.createLabel({
				text : e.title.split(' | ')[1],
				width : Ti.UI.FILL,
				left : 10
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
			html : '<style>* {font-family:Helvetica}</style>' + _e.rowData.html,
			disableBounce : true
		}));
		win.addEventListener('click', function() {
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
