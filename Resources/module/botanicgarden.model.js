var DBNAME = 'flora1', DBFILE = '/depot/floradb.sql';
var link = undefined;

var Areas = require('vendor/KMLTools').getPolygonsFromLocalKML('depot/Botanischer Garten Hamburg.kml');
//http://www.colby.edu/info.tech/BI211/PlantFamilyID.html
exports.getAreas = function() {
	return Areas;
}

exports.getAll = function() {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	function saveQR(latin) {
		var qrfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'qr', latin + '.png');
		if (qrfile.exists())
			return;
		var xhr = Ti.Network.createHTTPClient({
			onerror : function() {
				console.log(this.status)
			},
			onload : function() {
				qrfile.write(this.responseData);
			}
		});
		var url = 'http://qrfree.kaywa.com/?l=1&s=14&d=' + encodeURI('lsghh://'+latin); 
		console.log(url);
		xhr.open('GET', url);
		xhr.send(null);
	}

	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'qr');
	if (!g.exists()) {
		g.createDirectory();
	};
	var resultSet = link.execute('SELECT DISTINCT gattung || "_" || art AS latin FROM flora');
	while (resultSet.isValidRow()) {
		var latin = resultSet.fieldByName('latin');
		saveQR(latin);
		resultSet.next();
	}
	resultSet.close();
	link.close();
}

exports.search = function(_options, _callback) {
	if (_options.needle.length < 1)
		return [];
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
	if (_callback && typeof (_callback) === 'function')
		_callback(results)
	else
		return results
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
				// wwhich ordnung?
				for (var ordnung in allordnungen) {

					var familien = allordnungen[ordnung].split(' ');
					for (var i = 0; i < familien.length; i++) {
						if (familien[i] === familie) {
							found = true;
							break;
						}
					}
					if (found)
						break;
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
			try {
				var XMLTools = require("vendor/XMLTools");
				var parser = new XMLTools(this.responseXML);
				var res = parser.toObject().channel.item;
				_callback(res);
			} catch(E) {
			}
		}
	});
	xhr.open('GET', url);
	xhr.send();
}

exports.getFamilienByOrdnung = function(_ordnung) {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var familien = {};
	var familienarray = require('depot/ordersfamilies').orders[_ordnung].split(' ');
	for (var i = 0; i < familienarray.length; i++) {
		familien[familienarray[i]] = [];
		var sql = 'SELECT DISTINCT gattung,count(gattung) AS total FROM flora WHERE familie = "' + familienarray[i] + '" GROUP BY gattung';
		var resultSet = link.execute(sql);
		while (resultSet.isValidRow()) {
			familien[familienarray[i]].push({
				name : resultSet.fieldByName('gattung'),
				total : resultSet.fieldByName('total')
			});
			resultSet.next();
		}
		resultSet.close();
	}
	console.log(familien);
	return familien;
}
exports.getFamilienByList = function(_list) {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var familien = {};
	for (var i = 0; i < _list.length; i++) {
		familien[_list[i]] = [];
		var sql = 'SELECT DISTINCT * FROM flora WHERE familie = "' + _list[i] + '" GROUP BY gattung,art';
		var resultSet = link.execute(sql);
		while (resultSet.isValidRow()) {
			familien[_list[i]].push({
				gattung : resultSet.fieldByName('gattung'),
				art : resultSet.fieldByName('art'),
				deutsch : resultSet.fieldByName('deutsch'),
			});
			resultSet.next();
		}
		resultSet.close();
	}
	console.log(familien);
	return familien;
}

exports.getFamilien = function() {
	if (!link)
		link = Ti.Database.install(DBFILE, DBNAME);
	var sql = 'SELECT DISTINCT familie, count(familie) AS total FROM flora WHERE familie NOT LIKE "?%" GROUP BY familie';
	var resultSet = link.execute(sql);
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
	return res;
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
	if (!_bereich)
		return [];
	var bereich = undefined;
	bereich = _bereich;
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

