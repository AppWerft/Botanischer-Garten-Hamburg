exports.create = function() {
	var self = require('ui/win').create('Offener Naturführer');
	//	Ti.App.Dichotom.importDichotom('Droseria');
	var tv = Ti.UI.createTableView({
		backgroundColor : 'transparent'
	});
	self.add(tv);
	var list = Ti.App.Dichotom.getAll({
		onload : function(_list) {
			var rows = [];
			for (var i = 0; i < _list.length; i++) {
				var item = _list[i].Template;
				if (!item['Exchange_4_Format'])
					continue;
				item.id = Ti.Utils.md5HexDigest(item.Title.text)
				rows[i] = Ti.UI.createTableViewRow({
					hasChild : false,
					backgroundColor : 'white',
					layout : 'horizontal',
					dichotom : item,
					height : Ti.UI.SIZE
				});
				rows[i].add(Ti.UI.createImageView({
					image : item.IconURL.text,
					width : 60,
					height : 'auto',
					top : 5,
					left : 0
				}));
				var container = Ti.UI.createView({
					layout : 'vertical',
					width : Ti.UI.FILL,
					left : 10,
					top : 10,
					right : 10,
					height : Ti.UI.SIZE,
				});
				rows[i].add(container);
				container.add(Ti.UI.createLabel({
					width : Ti.UI.FILL,
					height : Ti.UI.SIZE,
					bottom : 0,
					color : '#444',
					text : item.Title.text,
					font : {
						fontSize : Ti.UI.CONF.fontsize_title,
						fontWeight : 'bold',
						fontFamily : 'TheSans-B7Bold'
					},
				}));
				var progress = Ti.UI.createProgressBar({
					height : 20,
					width : '100%',
					min : 0,
					max : 1,
					value : Math.random()
				});
				Ti.App.Dichotom.importDichotom({
					progress : progress,
					row : rows[i],
					dichotom : item
				});
				container.add(progress);
			}
			tv.setData(rows);
		}
	});
	tv.addEventListener('click', function(_e) {
		if (_e.rowData.hasChild == false)
			return;
		self.tab.open(require('ui/dichotom.window').create({
			dichotom_id : _e.rowData.dichotom.id,
			dichotom_title : _e.rowData.dichotom.Title.text
		}));
	});
	return self;
};
