Ti.include('/depot/punchcards.js');
var filter = {
	de : require('depot/filter_de').questions,
	en : require('depot/filter_en').questions
};

exports.getFilter = function(lang) {
	return filter[lang];
};

exports.getPropertiesOfFamily = function(_family, _lang) {
	var properties = [];
	for (var topic in filter[lang]) {
		for (var id in filter[lang][topic]) {
			properties[id] = filter[lang][topic[id]];
		}
	}
	// calcultaing of familyndx:
	var ndx = undefined;
	for (var counter = 0; counter < familyNames.length; counter++) {
		if (familyList[counter] === _family) {
			ndx = counter;
		};
	}
};

exports.searchFamilies = function(_ids, _callback) {
	Ti.include('/depot/punchcards.js');
	var foo = _ids;
	var familyList = [];
	for (var counter = 0; counter < familyNames.length; counter++) {
		familyList[counter] = {
			exists : true,
			name : familyNames[counter]
		};
	}
	var cols = PunchCards[0].length, rows = PunchCards.length;
	for (var loop = 0; loop < foo.length; loop++) {// alle Parameter
		for (var row = 0; row < rows; row++) {// alle Spalten (Parameter)
			if (foo[loop] == row + 1) {// relevante Eigenschaft
				for (var col = 0; col < cols; col++) {// alle Familien
					if (PunchCards[row][col] == 0) {
						familyList[col].exists = 0;
					}
				}
			}
		}
	}
	var res = [];
	for (var i = 0; i < familyList.length; i++) {
		if (familyList[i].exists == 1)
			res.push(familyList[i].name);
	};
	if (_callback && typeof (_callback) === 'function')
		_callback(res);
	return res;
};

exports.searchFamiliesRemote = function(_ids, _callback) {
	return;
	var params = [];
	for (var i = 0; i < _ids.length; i++) {
		params.push('T=P' + _ids[i]);
	}
	var post = params.join('&');
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			if (!link)
				link = Ti.Database.install(DBFILE, DBNAME);
			var page = this.responseText.replace(/\s/g, '');
			try {
				var families = [];
				var familiesstrings = /FamiliesHavingThoseCharacters:<BR><P>(.*?)<BR><P>/.exec(page)[1].split('<BR>');
				for (var i = 0; i < familiesstrings.length; i++) {
					var f = familiesstrings[i].split('.')[1].toLowerCase();
					f = f.capitalize();
					families.push('"' + f + '"');
				}
				var sql = 'SELECT DISTINCT familie FROM flora WHERE familie IN (' + families.join(',') + ')';
				console.log(sql);
				var resultSet = link.execute(sql);
				var res = [];
				while (resultSet.isValidRow()) {
					res.push(resultSet.fieldByName('familie'));
					resultSet.next();
				}
				_callback(res);
			} catch (E) {
				_callback(null);
			}
		}
	});
	xhr.open('POST', 'http://www.colby.edu/cgi-bin/plant_family_id');
	//	xhr.setRequestHeader('Referer','http://www.colby.edu/info.tech/BI211/PlantFamilyID.html');
	//	xhr.setRequestHeader('Connection','keep-alive');
	//	xhr.setRequestHeader('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:20.0) Gecko/20100101 Firefox/20.0');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Content-Length', post.length);
	xhr.send(post);
};
