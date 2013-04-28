exports.search = function(_needle, _callback) {
	if (_needle.length < 3)
		return;
	var link = Ti.Database.install('/depot/flora.db', 'flora');
	var resultSet = link.execute('SELECT DISTINCT deutsch,art,gattung,id FROM flora WHERE deutsch like "%' + _needle + '%" GROUP BY deutsch LIMIT 0,50');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push({
			deutsch : resultSet.fieldByName('deutsch'),
			gattung : resultSet.fieldByName('gattung'),
			art : resultSet.fieldByName('art'),
			id : resultSet.fieldByName('id'),
		});
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
	link.close();
}
exports.getDetail = function(_id, _callback) {
	var url = 'http://bghamburg.de/datenbank-detail?detail=' + _id;
	Titanium.Yahoo.yql('SELECT * FROM html WHERE url="' + url + '" AND xpath="//table"', function(_y) {
		var tr = _y.data.table.tbody.tr;
		var res = {};
		for (var i = 0; i < tr.length; i++) {
			var key = tr[i].td[0].p;
			var val = tr[i].td[1].p;
			res[key] = val;
		}
		_callback(res);
	})
}
exports.getCalendar = function() {
	var url = 'http://bghamburg.de/veranstaltungen';
}
