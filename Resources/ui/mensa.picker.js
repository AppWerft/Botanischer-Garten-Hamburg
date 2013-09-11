exports.create = function(_mensen, _callback) {
	function setRightColumn(column, ndx) {
		for (var i = 0, ilen = _mensen[ndx].mensen.length; i < ilen; i++) {
			var row = Ti.UI.createPickerRow({
				data : {
					title : _mensen[ndx].mensen[i].name,
					url : _mensen[ndx].mensen[i].url,
					latlon : _mensen[ndx].mensen[i].latlon,
					wus : _mensen[ndx].wus
				},
				title : _mensen[ndx].mensen[i].name.replace(/Mensa /, ''),
			});
			column.addRow(row);
		}
	}
	var removeAllPickerRows = function() {
		if (self.columns[1]) {
			var _col = self.columns[1];
			var len = _col.rowCount;
			for (var x = len - 1; x >= 0; x--) {
				var _row = _col.rows[x]
				_col.removeRow(_row);
			}
		}
	};
	var self = Ti.UI.createPicker({
		bottom : -200,
		useSpinner : true,
		selectionIndicator : true
	});
	var studwerke = [];
	for (var i = 0; i < _mensen.length; i++)
		studwerke.push(_mensen[i].wus);
	var column1 = Ti.UI.createPickerColumn();
	for (var i = 0, ilen = studwerke.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : studwerke[i]
		});
		column1.addRow(row);
	}
	var column2 = Ti.UI.createPickerColumn();
	setRightColumn(column2, 0);
	self.add([column1, column2]);
	self.addEventListener('change', function(_e) {
		if (_e.columnIndex == 0) {
			removeAllPickerRows();
			setRightColumn(column2, _e.rowIndex);
			self.reloadColumn(column2);
		} else if (_e.columnIndex == 1) {
			_callback(_e.row.data);
		}
	});
	_callback({
		title : 'Mensa Botanischer Garten',
		url : 'hamburg/mensa-botanischer-garten',
		wus : 'hamburg',
		latlon : '53.5582243,9.8602935'
	});
	return self;
};
