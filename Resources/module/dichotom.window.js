exports.create = function(_args) {
	var self = require('module/win').create('');
	self.setLayout('vertical');
	if (_args.next_id) {
		var leftButton = Ti.UI.createButton({
			title : 'Zurück'
		});
		self.setLeftNavButton(leftButton);
		leftButton.addEventListener('click', function() {
			self.close({
				animated : true
			})
		});
	}
	setTimeout(function() {
		if (!Ti.App.Dichotom) {
			var dichotom = require('module/dichotom.model');
			Ti.App.Dichotom = new dichotom('');
		}
		var decision = Ti.App.Dichotom.getDecisionById(_args);
		if (!decision)
			return self;
		if (decision.meta) {
			var head = Ti.UI.createView({
				top : -80,
				backgroundColor : '#383',
				height : Ti.UI.SIZE,
				bottom : 0,
				layout : 'horizontal'
			});
			if (decision.meta.icon_url)
				head.add(Ti.UI.createImageView({
					image : decision.meta.icon_url,
					top : 0,
					left : 5,
					color : 'white',
					bottom : 0,
					width : 80,
					height : 80,
					height : Ti.UI.SIZE
				}));
			head.add(Ti.UI.createLabel({
				text : decision.meta.title.striptags(),
				top : 10,
				left : 10,
				right : 10,
				color : 'white',
				bottom : 10,
				font : {
					fontSize : 14
				},
				height : Ti.UI.SIZE
			}));
			self.add(head);
		}
		var tv = Ti.UI.createTableView({
			backgroundColor : 'transparent'
		});
		self.add(tv)
		var rows = [];
		for (var i = 0; i < decision.alternatives.length; i++) {
			var alt = decision.alternatives[i];
			rows[i] = Ti.UI.createTableViewRow({
				hasChild : true,
				layout : 'horizontal',
				backgroundColor : 'white',
				next_id : alt.result.next_id,
				height : Ti.UI.SIZE
			});
			if (alt.media[0] && alt.media[0].url_420px) {
				var img = Ti.UI.createImageView({
					image : alt.media[0].url_420px,
					top : 10,
					left : 0,
					width : 80,
					height : 60,
					bubbleParent : false
				});
			} else {
				var img = Ti.UI.createImageView({
					image : 'assets/naturlogo.png',
					top : 10,
					left : 0,
					width : 80,
					height : 80,
					opacity : 0.5,
					bubbleParent : false
				});
			}
			rows[i].add(img);
			rows[i].add(Ti.UI.createLabel({
				width : Ti.UI.FILL,
				left : (alt.media[0] && alt.media[0].url_420px) ? 10 : 10,
				top : 10,
				right : 10,
				height : Ti.UI.SIZE,
				bottom : 10,
				color : '#444',
				text : alt.statement.striptags(),
				font : {
					fontSize : Ti.UI.CONF.fontsize_title,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
			}));
		}
		tv.setData(rows);
		tv.addEventListener('click', function(_e) {
			var next_id = _e.rowData.next_id;
			if (!next_id || next_id.match(/_wikipage/i)) {
				alert('Ende der Bestimmung');
				return;
			}
			self.tab.open(require('module/dichotom.window').create({
				next_id : _e.rowData.next_id,
				dichotom_id : _args.dichotom_id,
				tree_id : decision.tree_id
			}));
		});
		self.addEventListener('close', function() {
			self = null;
		})
	}, 10);
	return self;
}
