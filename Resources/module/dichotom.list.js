exports.create = function() {
	var self = require('module/win').create('Offener Naturführer');
	setTimeout(function() {
		if (!Ti.App.Dichotom) {
			var dichotom = require('module/dichotom.model');
			Ti.App.Dichotom = new dichotom();
		}
		/*
		Ti.App.Dichotom.importDichotom('holzigePflanzen');
		Ti.App.Dichotom.importDichotom('Gräser SH');
		Ti.App.Dichotom.importDichotom('Lamium');
		Ti.App.Dichotom.importDichotom('Regnitzgebiet (Werner Nezadal)');
		Ti.App.Dichotom.importDichotom('Seggen_Binsen_Simsen');
		Ti.App.Dichotom.importDichotom('Solanaceae');
*/
		var rows = [];
		var list = Ti.App.Dichotom.getAll();
		for (var i = 0; i < list.length; i++) {
			rows[i] = Ti.UI.createTableViewRow({
				hasChild : true,
				backgroundColor : 'white',
				layout : 'horizontal',
				dichotom_id : list[i].id,
				height : Ti.UI.SIZE
			});
			rows[i].add(Ti.UI.createLabel({
				width : Ti.UI.FILL,
				left : 10,
				top : 10,
				right : 10,
				height : Ti.UI.SIZE,
				bottom : 10,
				color : '#444',
				text : list[i].meta.title,
				font : {
					fontSize : Ti.UI.CONF.fontsize_title,
					fontWeight : 'bold',
					fontFamily : 'TheSans-B7Bold'
				},
			}));
		}
		var tv = Ti.UI.createTableView({
			data : rows,
			backgroundColor : 'transparent'
		});
		self.add(tv);
		tv.addEventListener('click', function(_e) {
			self.tab.open(require('module/dichotom.window').create({
				dichotom_id : _e.rowData.dichotom_id,
				next_id : null
			}));
		});
		self.addEventListener('close', function() {
			self = null;
		})
	}, 10);
	return self;
}
