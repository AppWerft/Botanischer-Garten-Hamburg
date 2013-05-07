exports.getImages = function(_item, _callback) {
	console.log(_item);
	var xhr = Ti.Network.createHTTPClient({
		tlsVersion : Ti.Network.TLS_VERSION_1_2,
		onload : function() {
			try {
				var search = JSON.parse(xhr.responseText).query.search;
			} catch (E) {
				return;
			}
			var titles = [];
			for (var i = 0; i < search.length; i++) {
				titles.push(encodeURI(search[i].title));
			}
			var sub = Ti.Network.createHTTPClient({
				tlsVersion : Ti.Network.TLS_VERSION_1_2,
				onload : function() {
					try {
						var res = JSON.parse(sub.responseText).query.pages;
						var images = [];
						for (var key in res) {
							if (key < 0)
								continue;
							images.push(res[key].imageinfo[0].url);
						}
						_callback(images);
					} catch(E) {
						console.log(E);
					}
				}
			});
			sub.open('POST', 'https://commons.wikimedia.org/w/api.php');
			sub.send({
				action : 'query',
				titles : titles.join('|'),
				prop : 'imageinfo',
				iiprop : 'url',
				iiurlwidth : '800',
				format : 'json'
			});

		}
	});
	xhr.open('POST', 'https://commons.wikimedia.org/w/api.php');
	xhr.send({
		action : 'query',
		list : 'search',
		srnamespace : 6,
		srsearch : _item,
		srlimit : 20,
		sroffset : 0,
		prop : 'imageinfo',
		format : 'json'
	});
}
