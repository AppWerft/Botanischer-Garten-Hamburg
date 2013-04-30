var DBNAME = 'flora', DBFILE = '/depot/flora6.sql';
var link = undefined;

exports.getAll = function() {
	return;
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT * FROM flora ORDER BY id');
	while (resultSet.isValidRow()) {
		var res = {
			deutsch : resultSet.fieldByName('deutsch'),
			familie : resultSet.fieldByName('familie'),
			sorte : resultSet.fieldByName('sorte'),
			art : resultSet.fieldByName('art'),
			subart : resultSet.fieldByName('subart'),
			id : resultSet.fieldByName('id'),
			bereich : resultSet.fieldByName('bereich'),
			unterbereich : resultSet.fieldByName('unterbereich'),
			standort : resultSet.fieldByName('standort'),
		};
		var select = link.execute('SELECT total FROM flora2 WHERE id=?', res.id);
		if (!select.isValidRow()) {
			console.log('INSERT');
			link.execute('INSERT INTO flora2 VALUES (total=0,id=?,deutsch=?,familie=?,sorte=?,art=?,subart=?,bereich=?,unterbereich=?,standort=?)', res.id, res.deutsch, res.familie, res.sorte, res.art, res.subart, res.bereich, res.unterbereich, res.standort);
		} else {
			console.log('UPDATE');
			link.execute('UPDATE flora2 set total=? WHERE id=?', res.id, select.fieldByName('total') + 1);
		}
		//var resultSet = link.execute('SELECT * FROM flora WHERE standort <> "" ORDER BY id LIMIT 0,200');
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
	var resultSet = link.execute('SELECT DISTINCT deutsch,art,gattung,id FROM flora WHERE deutsch like "%' + _needle + '%" GROUP BY deutsch');
	//var resultSet = link.execute('SELECT * FROM flora WHERE standort <> "" ORDER BY id LIMIT 0,60');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push({
			deutsch : resultSet.fieldByName('deutsch'),
			gattung : resultSet.fieldByName('gattung'),
			art : resultSet.fieldByName('art'),
			id : resultSet.fieldByName('id'),
		});
		//require('module/model').getDetail(resultSet.fieldByName('id'), function() {
		//});
		resultSet.next();
	}
	resultSet.close();
	_callback(results);

}

exports.getDetail = function(_id, _callback) {
	try {
		if (!link)
			link = Ti.Database.install(DBFILE, DBNAME);
		var resultSet = link.execute('SELECT * FROM flora WHERE id="' + _id + '"');
		var fields = [];
		if (resultSet.isValidRow() && resultSet.getRowCount() > 0) {
			for (var i = 0; i < resultSet.fieldCount(); i++) {
				fields.push(resultSet.fieldName(i));
			}
			var data = {};
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				data[field] = resultSet.fieldByName(field);
			}
			console.log(data);
			if (_callback)
				_callback(data);
			resultSet.close();
			return;
		} else
			console.log('no result');
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
exports.getBereiche = function() {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT DISTINCT bereich FROM flora WHERE bereich <> "" AND bereich <> "undefined" ORDER BY bereich');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('bereich'));
		resultSet.next();
	}
	resultSet.close();
	return (results);
}
