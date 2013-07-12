exports.create = function(_args) {
	var self = Ti.UI.createPicker({
		minified : true,
		top : 0,
		selectionIndicator : true,
		useSpinner : true,
		opacity : 0,
	});
	self.addEventListener('change', function(_e) {
		var area = self.getSelectedRow(0).title;
		self.animate({
			opacity : 0
		})
		_args.onchange(area);
	});
	// trigger for picker, because picker has no click event:
	var column = Ti.UI.createPickerColumn();
	for (var i = 0, ilen = _args.area_names.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : _args.area_names[i]
		});
		column.addRow(row);
	}
	self.add([column]);
	return self;
}