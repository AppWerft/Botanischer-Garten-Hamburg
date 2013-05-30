function parseRes(_foo) {
	var menue = [], h1 = [], li = [], res = [], regex = [/<h1>(.*?)<\/h1>[\s]*<ul>(.*?)<\/ul>/g, /<li>(.*?)[\s]*\((.*?)\)<\/li>/g];
	while ( h1 = regex[0].exec(_foo)) {
		var group = {
			name : h1[1],
			items : []
		};
		while ( li = regex[1].exec(h1[2])) {
			group.items.push({
				text : li[1],
				prize : li[2]
			});
			li = [];
		}
		menue.push(group);
		h1 = [];
	}
	return (menue);
}

exports.getMenue = function(_mensa, _callback) {
	var url = 'http://rss.imensa.de/' + _mensa + '/speiseplan.rss';
	var xhr = Ti.Network.createHTTPClient({
		timeout : 20000,
		onload : function() {
			try {
				var json = Ti.XML2JSON.convert(this.responseText).rss;
				html = json.channel.item['content:encoded'].text.replace(/&amp;/g, '&').replace(/ style="(.*?)"/g, '').replace(/  /g, '').replace(/…/g, '');
				if (_callback && typeof (_callback) == 'function')
					_callback(parseRes(html));
				//var json = html2json(html);
				//console.log(json);
			} catch(E) {
				console.log(E);
				_callback(null);
			}
		},
		onerror : function() {
			alert('Kein Netz');
		}
	});
	xhr.open('GET', url);
	xhr.send();
}
exports.mensen = [{
	wus : 'BLS Hamburg',
	sw : 'hamburg',
	mensen : [{
		name : 'BLS Mensa',
		latlon : '53.5599226,9.9820622',
		url : 'hamburg/mensa-bucerius-law-school'
	}]
}, {
	wus : 'HCU Hamburg',
	sw : 'hamburg',
	mensen : [{
		name : 'Café Averhoffstraße',
		latlon : '53.5704664,10.0252604',
		url : 'hamburg/cafe-averhoffstrasse'
	}, {
		name : 'Mensa City Nord',
		latlon : '53.6073848,10.0311799',
		url : 'hamburg/mensa-city-nord'
	}]
}, {
	wus : 'HAW Hamburg',
	sw : 'hamburg',
	mensen : [{
		name : 'Café Alexanderstraße',
		url : 'hamburg/cafe-alexanderstrasse',
		latlon : '53.5549065,10.0185161',
	}, {
		name : 'Mensa Berliner Tor',
		url : 'hamburg/mensa-berliner-tor'
	}, {
		name : 'Mensa Armgartstraße',
		url : 'hamburg/mensa-armgartstrasse'
	}, {
		name : 'Mensa Finkenau',
		url : 'hamburg/mensa-finkenau'
	}]
}, {
	wus : 'Universität Hamburg',
	sw : 'hamburg',
	mensen : [{
		name : 'Mensa Stellingen',
		latlon : '53.5993500,9.9319100',
		url : 'hamburg/mensa-stellingen'
	}, {
		name : 'Mensa Botanischer Garten',
		url : 'hamburg/mensa-botanischer-garten',
		latlon : '53.5582243,9.8602935'
	}, {
		name : 'Mensa Campus',
		url : 'hamburg/mensa-campus',
		latlon : '53.5653055,9.9843407',
	}, {
		name : 'Mensa Philosophenturm',
		url : 'hamburg/mensa-philosophenturm',
		latlon : '53.5671800,9.9858200'
	}, {
		name : 'Mensa Studierendenhaus',
		url : 'hamburg/mensa-studierendenhaus',
		latlon : '53.5656846,9.9862504'
	}, {
		name : 'Café CFEL',
		url : 'hamburg/cafe-cfel',
		latlon : '53.5770154,9.8813009'
	}, {
		name : 'Café Jungiusstraße',
		latlon : '53.5587600,9.9818200',
		url : 'hamburg/cafe-jungiusstrasse'
	}, {
		name : 'Mensa Geomatikum',
		url : 'hamburg/mensa-geomatikum',
		latlon : '53.5681700,9.9742200'
	}]
}];

/*, {
 wus : 'Göttingen',
 sw : 'goettingen',
 mensen : [{
 name : 'Mensa Italia',
 url : 'goettingen/mensa-italia'
 }, {
 name : 'Mensa am Turm',
 url : 'goettingen/mensa-am-turm'
 }, {
 name : 'Nordmensa',
 url : 'goettingen/nordmensa'
 }, {
 name : 'Zentralmensa',
 url : 'goettingen/zentralmensa'
 }, {
 name : 'Bistro HAWK',
 url : 'goettingen/bistro-hawk'
 }]
 }, {
 wus : 'Lüneburg',
 sw : 'ostniedersachsen',
 mensen : [{
 name : 'Mensa Campus',
 url : 'lueneburg/mensa-campus'
 }, {
 name : 'Mensa Rotes Feld',
 url : 'mensa-rotes-feld'
 }]
 }, {
 wus : 'Eisenach',
 sw : 'thueringen',
 mensen : [{
 name : 'Mensa am Wartenberg',
 url : 'eisenach/mensa-am-wartenberg'
 }]
 }, {
 wus : 'Erfurt',
 sw : 'thueringen',
 mensen : [{
 name : 'Caféteria Leipziger Straße',
 url : 'erfurt/cafeteria-leipziger-strasse'
 }, {
 name : 'Mensa Altonaer Straße',
 url : 'erfurt/mensa-altonaer-strasse'
 }, {
 name : 'Cafeteria Schlüterstraße',
 url : 'erfurt/cafeteria-schlueterstrasse'
 }, {
 name : 'Mensa Nordhäuser Straße',
 url : 'erfurt/mensa-nordhaeuser-strasse'
 }]
 }, {
 wus : 'Ilmenau',
 sw : 'thueringen',
 mensen : [{
 name : 'Caféteria im Röntgenbau',
 url : 'ilmenau/cafeteria-im-roentgenbau'
 }, {
 name : 'Mensa Ehrenberg',
 url : 'ilmenau/mensa-ehrenberg'
 }, {
 name : 'NANOteria',
 url : 'ilmenau/nanoteria'
 }]*/
