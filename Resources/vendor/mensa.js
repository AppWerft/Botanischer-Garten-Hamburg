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
			var json = Ti.XML2JSON.convert(this.responseText).rss;
			html = json.channel.item['content:encoded'].text.replace(/ style="(.*?)"/g, '').replace(/  /g, '').replace(/…/g, '');
			if (_callback && typeof (_callback) == 'function')
				_callback(parseRes(html));
			//var json = html2json(html);
			//console.log(json);
		},
		onerror : function() {

		}
	});
	xhr.open('GET', url);
	xhr.send();
}
