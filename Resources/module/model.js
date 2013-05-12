var DBNAME = 'flora1', DBFILE = '/depot/floradb.sql';
var link = undefined;
Array.prototype.in_array = function(needle) {
	for (var i = 0; i < this.length; i++)
		if (this[i] === needle)
			return true;
	return false;
}
var Areas = require('vendor/KMLTools').getPolygonsFromLocalKML('depot/Botanischer Garten Hamburg.kml');

exports.getAreas = function() {
	return Areas;
}
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
			link.execute('INSERT INTO flora2 VALUES (total=0,id=?,deutsch=?,familie=?,sorte=?,art=?,subart=?,bereich=?,unterbereich=?,standort=?)', res.id, res.deutsch, res.familie, res.sorte, res.art, res.subart, res.bereich, res.unterbereich, res.standort);
		} else {
			link.execute('UPDATE flora2 set total=? WHERE id=?', res.id, select.fieldByName('total') + 1);
		}
		//var resultSet = link.execute('SELECT * FROM flora WHERE standort <> "" ORDER BY id LIMIT 0,200');
		resultSet.next();
	}
	resultSet.close();
	link.close();
}

exports.search = function(_options, _callback) {
	if (_options.needle.length < 4)
		return;
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT * FROM flora WHERE deutsch like "%' + _options.needle + '%" GROUP BY gattung,art,subart LIMIT ' + _options.limit.join(','));
	var familien = {};
	var results = [];
	while (resultSet.isValidRow()) {
		var familie = resultSet.fieldByName('familie');
		if (!familien[familie])
			familien[familie] = [];
		var item = {
			deutsch : resultSet.fieldByName('deutsch'),
			gattung : resultSet.fieldByName('gattung'),
			art : resultSet.fieldByName('art'),
			subart : resultSet.fieldByName('subart'),
			familie : familie
		};
		familien[familie].push(item);
		results.push(item);
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
}

exports.getDetail = function(_data, _callback) {
	try {
		var areas = Areas.regions;
		if (!link)
			link = Ti.Database.install(DBFILE, DBNAME);
		var q = 'SELECT * FROM flora WHERE unterbereich <> "" AND gattung="' + _data.gattung + '" AND art="' + _data.art + '"'
		if (_data.subart)
			q += ' AND subart="' + _data.subart + '"';
		var resultSet = link.execute(q);
		var rowcount = 0;
		// preparing of result:
		var res = {
			plantinfo : {},
			standorte : {}
		};
		// walking thrue all results
		while (resultSet.isValidRow()) {
			// basics data:
			if (rowcount === 0) {
				var familie = resultSet.fieldByName('familie');
				var allordnungen = require('depot/ordersfamilies').orders;
				var found = false;
				for (var ordnung in allordnungen) {
					if (found)
						break;
					var familien = allordnungen[ordnung].split(' ');
					for (var i = 0; i < familien.length; i++) {
						if (familien[i] === familie) {
							found = true;
							break;
						}
					}
				}
				res.plantinfo = {
					art : resultSet.fieldByName('art'),
					subart : resultSet.fieldByName('subart'),
					familie : familie,
					deutsch : resultSet.fieldByName('deutsch'),
					gattung : resultSet.fieldByName('gattung'),
					standort : resultSet.fieldByName('standort'),
					ordnung : ordnung
				}
				console.log(res.plantinfo);
			}
			// collecting of area datas
			var bereich = resultSet.fieldByName('bereich');
			if (!res.standorte[bereich]) {
				res.standorte[bereich] = 1;
			} else {
				res.standorte[bereich] += 1;
			}
			resultSet.next();
			rowcount++;
		}
		if (_callback)
			_callback(res);
		resultSet.close();
	} catch(E) {
		console.log(E)
	}
}

exports.getDetailFromNet = function() {
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
	var resultSet = link.execute('SELECT DISTINCT familie,count(familie) AS total FROM flora WHERE familie NOT LIKE "?%" GROUP BY familie');
	var families = {};
	while (resultSet.isValidRow()) {
		families[resultSet.fieldByName('familie')] = resultSet.fieldByName('total');
		resultSet.next();
	}
	resultSet.close();
	var res = {};
	var allorders = require('depot/ordersfamilies').orders;
	for (var order in allorders) {
		var orders = allorders[order].split(' ');
		for (var i = 0; i < orders.length; i++) {
			if (!res[order])
				res[order] = [];
			res[order][i] = {
				name : orders[i],
				total : (families[orders[i]]) ? families[orders[i]] : 0
			};
		}
	}
	_callback(res);
}

exports.getGattungenByFamilie = function(_familie, _callback) {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var q = 'SELECT DISTINCT gattung FROM flora WHERE familie="' + _familie + '" ORDER BY gattung';
	var resultSet = link.execute(q);
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('gattung'));
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
}

exports.getArtenByGattung = function(_gattung, _callback) {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var q = 'SELECT * FROM flora WHERE bereich <> "" AND gattung="' + _gattung + '" GROUP BY gattung,art,subart ORDER BY art';
	var resultSet = link.execute(q);
	var results = [];
	while (resultSet.isValidRow()) {
		results.push({
			art : resultSet.fieldByName('art'),
			subart : resultSet.fieldByName('subart'),
			gattung : _gattung,
			deutsch : resultSet.fieldByName('deutsch')
		});
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
	return results;
}

exports.getArtenByBereich = function(_bereich, _callback) {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var bereich = undefined;
	try {
		bereich = /^(.*) \[/.exec(_bereich)[1];
	} catch(E) {
		bereich = _bereich;
	}
	var q = 'SELECT * FROM flora WHERE bereich LIKE "' + bereich + '" GROUP BY gattung,art,subart ORDER BY art';
	var resultSet = link.execute(q);
	var results = [];
	while (resultSet.isValidRow()) {
		results.push({
			art : resultSet.fieldByName('art'),
			subart : resultSet.fieldByName('subart'),
			gattung : resultSet.fieldByName('gattung'),
			deutsch : resultSet.fieldByName('deutsch')
		});
		resultSet.next();
	}
	resultSet.close();
	if (_callback && typeof (_callback) == 'function')
		_callback(results);
	else
		return results
};

exports.savePOI = function(_poi) {
	Ti.Geolocation.purpose = "Recieve User Location";
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 10;
	Ti.Geolocation.getCurrentPosition(function(_e) {
		Ti.Media.vibrate();
		Ti.App.Properties.setString('POI_' + _poi, JSON.stringify(_e.coords));
		console.log(_e.coords);
	});
};

exports.getBereiche = function() {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = link.execute('SELECT bereich, count(bereich) AS total FROM flora WHERE bereich <> "" AND bereich <> "undefined" Group BY bereich ORDER BY total DESC');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('bereich'));
		resultSet.next();
	}
	resultSet.close();
	return (results);
}

