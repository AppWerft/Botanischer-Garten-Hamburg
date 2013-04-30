exports.create = function() {
	var self = Ti.UI.createWindow({
		navBarHidden : true
	});
	
	self.map = Ti.Map.createView({
		top : 0,bottom:160,
		mapType : Titanium.Map.HYBRID_TYPE,
		region : {
			latitude : 53.5614057,
			longitude : 9.8614097,
			latitudeDelta : 0.003,
			longitudeDelta : 0.003
		}
	});
	var picker = Ti.UI.createPicker({
		bottom : 0,
		useSpinner : true
	});
	picker.selectionIndicator = true;
	var bereiche = require('module/model').getBereiche();
	var color = ['red', 'green', 'blue', 'orange'];
	var column1 = Ti.UI.createPickerColumn();console.log(bereiche);
	for (var i = 0, ilen = bereiche.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : bereiche[i]
		});
		column1.addRow(row);
	}
	var column2 = Ti.UI.createPickerColumn();
	for (var i = 0, ilen = color.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : color[i]
		});
		column2.addRow(row);
	}
	picker.add([column1]);
	self.add(self.map);
	self.add(picker); 
	return self;
}
