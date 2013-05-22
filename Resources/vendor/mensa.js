exports.getMenue = function(_mensa, _callback) {
	var url = 'http://rss.imensa.de/' + _mensa + '/speiseplan.rss';
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			Ti.include('vendor/html2json.js');
			var XMLTools = require("vendor/XMLTools");
			var parser = new XMLTools(this.responseXML);
			var html = parser.toObject().channel.item['content:encoded'];
			_callback(html);
			//var json = html2json(html);
			//console.log(json);
		}
	});
	xhr.open('GET', url);
	xhr.send();

}
