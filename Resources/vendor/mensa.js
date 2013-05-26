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
				html = json.channel.item['content:encoded'].text.replace(/ style="(.*?)"/g, '').replace(/  /g, '').replace(/…/g, '');
				if (_callback && typeof (_callback) == 'function')
					_callback(parseRes(html));
				//var json = html2json(html);
				//console.log(json);
			} catch(E) {
				_callback(null);
			}
		},
		onerror : function() {

		}
	});
	xhr.open('GET', url);
	xhr.send();
}

exports.mensen = [{
	city : 'Hamburg',
	sw : 'hamburg',
	mensen : [{
		name : 'Mensa Bucerius Law School',
		url : 'hamburg/mensa-bucerius-law-school'
	}, {
		name : 'Mensa Stellingen',
		url : 'hamburg/mensa-stellingen'
	}, {
		name : 'Mensa Botanischer Garten',
		url : 'hamburg/mensa-botanischer-garten'
	}, {
		name : 'Mensa Campus',
		url : 'hamburg/mensa-campus'
	}, {
		name : 'Mensa Philosophenturm',
		url : 'hamburg/mensa-philosophenturm'
	}, {
		name : 'Mensa Studierendenhaus',
		url : 'hamburg/mensa-studierendehaus'
	}, {
		name : 'Café CFEL',
		url : 'hamburg/cafe-cfel'
	}, {
		name : 'Café Jungiusstraße',
		url : 'hamburg/cafe-jungiusstrasse'
	}, {
		name : 'Mensa Geomatikum',
		url : 'mensa-geomatikum'
	}, {
		name : '',
		url : ''
	}]
}, {
	city : 'Eisenach',
	sw : 'thueringen',
	mensen : [{
		name : 'Mensa am Wartenberg',
		url : 'eisenach/mensa-am-wartenberg'
	}]
}, {
	city : 'Erfurt',
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
	city : 'Ilmenau',
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
	}]
}]
