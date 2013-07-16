exports.create = function() {
	var self = require('module/win').create('Holzige Pflanzen');
	var Dichotom = require('module/dichotom.model');
	var WoodenPlants = new Dichotom('holzigePflanzen');
	var meta = WoodenPlants.getMeta();
	console.log(meta);
	var decision = WoodenPlants.getDecisiontree().decision;
	console.log(decision)
	var tv = Ti.UI.createTableView();
	self.add(tv)
	var rows = [];
	for (var i = 0; i < decision.length; i++) {
		rows[i] = Ti.UI.createTableViewRow({
			hasChild : true,
			title : decision[i].statement
		});

	}
	tv.setData(rows);
	return self
}
