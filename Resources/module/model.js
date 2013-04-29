var DBNAME = 'flora1', DBFILE = '/depot/flora.sql';
exports.search = function(_needle, _callback) {
	if (_needle.length < 2)
		return;
	var link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT DISTINCT deutsch,art,gattung,id FROM flora WHERE deutsch like "%' + _needle + '%" GROUP BY deutsch LIMIT 0,100');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push({
			deutsch : resultSet.fieldByName('deutsch'),
			gattung : resultSet.fieldByName('gattung'),
			art : resultSet.fieldByName('art'),
			id : resultSet.fieldByName('id'),
		});
		require('module/model').getDetail(resultSet.fieldByName('id'), function() {
		});
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
	link.close();

}
exports.getDetail = function(_id, _callback) {
	var link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT * FROM flora WHERE familie <> "" AND familie <> "undefined" AND id="' + _id + '"');
	var fields = [];
	if (resultSet.isValidRow() && resultSet.getRowCount() == 1) {
		for (var i = 0; i < resultSet.fieldCount(); i++) {
			fields.push(resultSet.fieldName(i));
		}
		var data = {};
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];
			data[field] = resultSet.fieldByName(field);
		}
		if (_callback)
			_callback(data);
		resultSet.close();
		return;
	}
	var results = [];
	var url = 'http://bghamburg.de/datenbank-detail?detail=' + _id;
	Titanium.Yahoo.yql('SELECT * FROM html WHERE url="' + url + '" AND xpath="//table"', function(_y) {
		if (!_y.data)
			return;
		var tr = _y.data.table.tbody.tr;
		var res = {};
		for (var i = 0; i < tr.length; i++) {
			var key = tr[i].td[0].p.toLowerCase();
			var val = tr[i].td[1].p;
			res[key] = val;
		}
		var q = 'UPDATE flora SET familie="' + res.familie + '", bereich="' + res.bereich + '",unterbereich="' + res.unterbereich + '" WHERE id=' + _id;
		console.log(q);
		try {
			link.execute(q);
		} catch(E) {
		}
		link.close();
		if (_callback)
			_callback(res);
	})
}
exports.getCalendar = function(_callback) {
	var url = 'http://bghamburg.de/veranstaltungen?format=feed&type=rss&limit=100';
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var XMLTools = require("vendor/XMLTools");
			var parser = new XMLTools(this.responseXML);
			var res = parser.toObject().channel.item;
			_callback(res);
		}
	});
	xhr.open('GET', url);
	xhr.send();
}
exports.getFamilien = function(_callback) {
	var link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT DISTINCT familie FROM flora WHERE familie <> "" ORDER BY familie');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('familie'));
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
	link.close();
}
exports.getGattungen = function(_familie, _callback) {
	var link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT DISTINCT gattung FROM flora WHERE familie="' + _familie + '" ORDER BY gattung');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('gattung'));
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
	link.close();
}