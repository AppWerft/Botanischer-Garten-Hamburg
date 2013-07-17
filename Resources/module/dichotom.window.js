function html2utf8(foo) {
	return foo.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

exports.create = function(_id) {
	var self = require('module/win').create('Holzige Pflanzen');
	self.setLayout('vertical');
	if (_id) {
		var leftButton = Ti.UI.createButton({
			title : 'Zurück'
		});
		self.leftNavButton = leftButton;
		leftButton.addEventListener('click', function() {
			self.close()
		});
	}
	setTimeout(function() {
		if (!Ti.App.Dichotom) {
			var dichotom = require('module/dichotom.model');
			Ti.App.Dichotom = new dichotom('holzigePflanzen');
		}
		var decision = Ti.App.Dichotom.getDecisionById(_id);

		if (!decision)
			return self;
		var alternatives = decision.alternatives;
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
			text : html2utf8(decision.meta.title),
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
		var tv = Ti.UI.createTableView();
		self.add(tv)
		var rows = [];
		for (var i = 0; i < alternatives.length; i++) {
			var alt = alternatives[i];
			rows[i] = Ti.UI.createTableViewRow({
				hasChild : true,
				layout : 'horizontal',
				next_id : alt.result.next_id,
				height : Ti.UI.SIZE
			});
			if (alt.media[0] && alt.media[0].url_420px) {
				var img = Ti.UI.createImageView({
					image : alt.media[0].url_420px,
					top : 10,
					left : 0,
					width : 80,
					height : 80,
					bubbleParent : false
				});
				rows[i].add(img);
			}
			rows[i].add(Ti.UI.createLabel({
				width : Ti.UI.FILL,
				left : (alt.media[0] && alt.media[0].url_420px) ? 10 : 10,
				top : 10,
				right : 10,
				height : Ti.UI.SIZE,
				bottom : 10,
				color : '#444',
				text : html2utf8(alternatives[i].statement),
				font : {
					fontSize : Ti.UI.CONF.fontsize_title,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
			}));
		}
		tv.setData(rows);
		tv.addEventListener('click', function(_e) {
			self.tab.open(require('module/dichotom.window').create(_e.rowData.next_id));
		});
		self.addEventListener('close', function() {
			self = null;
		})
	}, 10);
	return self;
}
