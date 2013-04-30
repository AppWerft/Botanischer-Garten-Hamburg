var DBNAME = 'flora4', DBFILE = '/depot/flora3.sql';
var link = undefined;

exports.getAll = function() {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT DISTINCT id FROM flora WHERE standort <> "" ORDER BY id');
	var results = [];
	while (resultSet.isValidRow()) {
		require('module/model').getDetail(resultSet.fieldByName('id'), function() {
		});
		resultSet.next();
	}
	resultSet.close();
	link.close();
}

exports.search = function(_needle, _callback) {
	if (_needle.length < 2)
		return;
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT DISTINCT deutsch,art,gattung,id FROM flora WHERE deutsch like "' + _needle + '%" GROUP BY deutsch');
	//var resultSet = link.execute('SELECT * FROM flora WHERE standort <> "" ORDER BY id LIMIT 0,200');
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

}

exports.getDetail = function(_id, _callback) {
	try {
		if (!link)
			link = Ti.Database.install(DBFILE, DBNAME);
		var resultSet = link.execute('SELECT DISTINCT id  FROM flora WHERE standort <> ""  AND id="' + _id + '"');
		var fields = [];
	/*	if (resultSet.isValidRow() && resultSet.getRowCount() > 0) {
			console.log('Data found.');
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
		} else
			console.log('no result');*/
		var results = [];
		var url = 'http://bghamburg.de/datenbank-detail?detail=' + _id;
		var query = 'SELECT * FROM html WHERE url="' + url + '" AND xpath="//table"';
		Ti.Yahoo.yql(query, function(_y) {
			if (!_y.data) {
				return;
			}
			var tr = _y.data.table.tbody.tr;
			var res = {};
			for (var i = 0; i < tr.length; i++) {
				var key = tr[i].td[0].p.toLowerCase();
				var val = tr[i].td[1].p;
				res[key] = val;
			}

			var q = 'UPDATE flora SET standort="' + res.standort + '"  WHERE id=' + _id;
			console.log(q);
			try {
				link.execute('BEGIN TRANSACTION;');
				link.execute(q);
				link.execute('COMMIT;');
			} catch(E) {
				console.log(E);
			}

			if (_callback)
				_callback(res);
		});
	} catch(E) {
		console.log(E)
	}
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
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);

	var resultSet = link.execute('SELECT DISTINCT familie FROM flora WHERE familie <> "" ORDER BY familie');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('familie'));
		resultSet.next();
	}
	resultSet.close();
	_callback(results);

}
exports.getGattungen = function(_familie, _callback) {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	console.log(link);
	var q = 'SELECT DISTINCT gattung FROM flora WHERE familie="' + _familie + '" ORDER BY gattung';
	console.log(q);
	var resultSet = link.execute(q);
	console.log(resultSet);
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('gattung'));
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
}