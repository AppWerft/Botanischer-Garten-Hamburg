exports.create = function(_args) {
	var self = require('module/win').create('');
	self.setTitle(_args.dichotom_title);
	var leftButton = Ti.UI.createButton({
		title : 'Zurück'
	});
	self.setLeftNavButton(leftButton);
	leftButton.addEventListener('click', function() {
		self.close({
			animated : true
		})
	});

	var decision = Ti.App.Dichotom.getDecisionById(_args);
	if (!decision)
		return self;
	if (decision.meta) {
		var head = Ti.UI.createView({
			top : 0,
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
			text : decision.meta.title.entities2utf8(),
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
		backgroundColor : 'transparent',
		top : (decision.meta) ? 80 : 0
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
			item : alt,
			height : Ti.UI.SIZE
		});
		if (alt.media[0] && alt.media[0].url_420px) {
			var img = Ti.UI.createImageView({
				image : alt.media[0].url_420px,
				top : 10,
				left : 0,
				width : 80,
				height : 'auto',
				bubbleParent : false
			});
			setTimeout(function() {
				console.log(img.getSize().width);
				console.log(img.getSize().height)
			}, 1000);
			if (img.size.getWidth() > img.size.getHeight()) {
				img.setWidth(300);
				row.setLayout('vertical');
			}
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
			var win = require('module/dichotom.detail').create(_e.rowData.item);
			win.open();
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

	return self;
}
