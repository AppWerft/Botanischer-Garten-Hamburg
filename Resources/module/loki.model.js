var DBNAME = 'flora1', DBFILE = '/depot/floradb.sql';
var Areas = require('vendor/KMLTools').getPolygonsFromLocalKML('depot/Botanischer Garten Hamburg.kml');

var LokiModel = function() {
	this.lokiLink = Ti.Database.install(DBFILE, DBNAME);
	return this;
}

module.exports = LokiModel;

//http://www.colby.edu/info.tech/BI211/PlantFamilyID.html
LokiModel.prototype.getAreas = function(_args) {
	try {
		if (Ti.App.Properties.hasProperty('areas')) {
			_args(JSON.parse(Ti.App.Properties.getString('areas')))
			return;
		}
	} catch (E) {
	}
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var foo = JSON.parse(this.responseText);
			var bar = {};
			var keys = [];
			for (var key in foo) {
				keys.push(key);
				bar[key] = [];
				for (var i = 0; i <foo[key].length; i++) {
					bar[key].push({
						latitude : foo[key][i][0],
						longitude : foo[key][i][1]
					});
				}
			}
			var result = {
				area_names : keys,
				area_centers : [],
				area_arrays : bar
			};
			Ti.App.Properties.setString('areas', result)
			_args.onload(result)
		}
	});
	xhr.open('GET', 'http://lab.min.uni-hamburg.de/botanischergarten/api/');
	xhr.send(null);
}

LokiModel.prototype.getFamilien = function() {
	var sql = 'SELECT DISTINCT familie, count(familie) AS total FROM flora WHERE familie NOT LIKE "?%" GROUP BY familie';
	var resultSet = this.lokiLink.execute(sql);
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

LokiModel.prototype.getGattungenByFamilie = function(_familie, _callback) {
	var sql = 'SELECT DISTINCT gattung FROM flora WHERE familie="' + _familie + '" ORDER BY gattung';
	var resultSet = this.lokiLink.execute(sql);
	if (!resultSet)
		return [];
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('gattung'));
		resultSet.next();
	}
	resultSet.close();
	_callback(results);
}

LokiModel.prototype.getAll = function() {
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
		var url = 'http://qrfree.kaywa.com/?l=1&s=14&d=' + encodeURI('lsghh://' + latin);
		console.log(url);
		xhr.open('GET', url);
		xhr.send(null);
	}

	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'qr');
	if (!g.exists()) {
		g.createDirectory();
	};
	var resultSet = this.lokiLink.execute('SELECT DISTINCT gattung || "_" || art AS latin FROM flora');
	while (resultSet.isValidRow()) {
		var latin = resultSet.fieldByName('latin');
		saveQR(latin);
		resultSet.next();
	}
	resultSet.close();
	this.lokiLink.close();
}

LokiModel.prototype.search = function(_options, _callback) {
	if (_options.needle.length < 1)
		return [];
	if (!this.lokiLink)
		this.lokiLink = Ti.Database.install(DBFILE, DBNAME);
	var resultSet = this.lokiLink.execute('SELECT * FROM flora WHERE deutsch like "%' + _options.needle + '%" GROUP BY gattung,art,subart LIMIT ' + _options.limit.join(','));
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

LokiModel.prototype.getDetail = function(_data, _callback) {
	try {
		var areas = Areas.regions;
		if (!this.lokiLink)
			this.lokiLink = Ti.Database.install(DBFILE, DBNAME);
		var q = 'SELECT * FROM flora WHERE unterbereich <> "" AND gattung="' + _data.gattung + '" AND art="' + _data.art + '"'
		if (_data.subart)
			q += ' AND subart="' + _data.subart + '"';
		var resultSet = this.lokiLink.execute(q);
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

LokiModel.prototype.getDetailFromNet = function() {
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
			this.lokiLink.execute('BEGIN TRANSACTION;');
			this.lokiLink.execute(q);
			this.lokiLink.execute('COMMIT;');
		} catch(E) {
			console.log(E);
		}

		if (_callback)
			_callback(res);
	});
}

LokiModel.prototype.getCalendar = function(_callback) {
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

LokiModel.prototype.getFamilienByOrdnung = function(_ordnung) {
	var familien = {};
	var familienarray = require('depot/ordersfamilies').orders[_ordnung].split(' ');
	for (var i = 0; i < familienarray.length; i++) {
		familien[familienarray[i]] = [];
		var sql = 'SELECT DISTINCT gattung,count(gattung) AS total FROM flora WHERE familie = "' + familienarray[i] + '" GROUP BY gattung';
		var resultSet = this.lokiLink.execute(sql);
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
LokiModel.prototype.getFamilienByList = function(_list) {
	var familien = {};
	for (var i = 0; i < _list.length; i++) {
		familien[_list[i]] = [];
		var sql = 'SELECT DISTINCT * FROM flora WHERE familie = "' + _list[i] + '" GROUP BY gattung,art';
		var resultSet = this.lokiLink.execute(sql);
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

LokiModel.prototype.getArtenByGattung = function(_gattung, _callback) {
	var q = 'SELECT * FROM flora WHERE bereich <> "" AND gattung="' + _gattung + '" GROUP BY gattung,art,subart ORDER BY art';
	var resultSet = this.lokiLink.execute(q);
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

LokiModel.prototype.getArtenByBereich = function(_bereich, _callback) {
	if (!_bereich)
		return [];
	var bereich = undefined;
	bereich = _bereich;
	var q = 'SELECT * FROM flora WHERE bereich LIKE "' + bereich + '" GROUP BY gattung,art,subart ORDER BY art';
	var resultSet = this.lokiLink.execute(q);
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

LokiModel.prototype.savePOI = function(_poi) {
	Ti.Geolocation.purpose = "Recieve User Location";
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 10;
	Ti.Geolocation.getCurrentPosition(function(_e) {
		Ti.Media.vibrate();
		Ti.App.Properties.setString('POI_' + _poi, JSON.stringify(_e.coords));
		console.log(_e.coords);
	});
};

LokiModel.prototype.getBereiche = function() {
	var resultSet = this.lokiLink.execute('SELECT bereich, count(bereich) AS total FROM flora WHERE bereich <> "" AND bereich <> "undefined" Group BY bereich ORDER BY total DESC');
	var results = [];
	while (resultSet.isValidRow()) {
		results.push(resultSet.fieldByName('bereich'));
		resultSet.next();
	}
	resultSet.close();
	return (results);
}

