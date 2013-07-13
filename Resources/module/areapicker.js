var Picker = function(_args) {
	this.view = Ti.UI.createPicker({
		minified : true,
		top : 0,
		selectionIndicator : true,
		useSpinner : true,
		anchorPoint : {
			x : 0,
			y : 0
		},
		transform : Ti.UI.create2DMatrix({
			scale : 0.01
		})
	});
	var self = this;
	this.view.addEventListener('change', function(_e) {
		var area = self.view.getSelectedRow(0).title;
		_args.onchange(area);
		self.hide();
	});
	var column = Ti.UI.createPickerColumn();
	for (var i = 0, ilen = _args.area_names.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : _args.area_names[i]
		});
		column.addRow(row);
	}
	this.view.add([column]);
	return this;
}

Picker.prototype.getView = function() {
	return this.view;
}

Picker.prototype.show = function() {
	this.view.animate({
		transform : Ti.UI.create2DMatrix({
			scale : 1,
			duration : 700
		})
	});
}

Picker.prototype.hide = function() {
	this.view.animate({
		transform : Ti.UI.create2DMatrix({
			scale : 0.01,
			duration : 700
		})
	});
}
module.exports = Picker;
