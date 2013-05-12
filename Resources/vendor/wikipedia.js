//https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch=Asimina+triloba&srprop=timestamp&format=json
exports.search4Article = function(_lang, _item, _callback) {

	var post = {
		action : 'query',
		list : 'search',
		srsearch : _item.replace(/ /g, '+'),
		format : 'json'
	};
	var url = 'https://' + _lang + '.wikipedia.org/w/api.php'
	var xhr = Ti.Network.createHTTPClient({
		tlsVersion : Ti.Network.TLS_VERSION_1_2,
		onload : function() {
			try {
				var query = JSON.parse(xhr.responseText).query;
				if (parseInt(query.searchinfo.totalhits) > 0) {
					var title = query.search[0].title;
					if (title.split(' ').length < 4) {
						_callback({
							lang : _lang,
							dir : (_lang == 'he' || _lang == 'ar' || _lang == 'fa') ? 'rtl' : 'ltr',
							title : query.search[0].title
						});
					}
				}
			} catch (E) {
				console.log(E);
				return;
			}
		},
		onerror : function() {
			console.log(this.error)
		}
	});
	xhr.open('POST', url);
	xhr.send(post);
}

exports.getImages = function(_item, _callback) {
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

					}
				}
			});
			sub.open('POST', 'https://commons.wikimedia.org/w/api.php');
			sub.send({
				action : 'query',
				titles : titles.join('|'),
				prop : 'imageinfo',
				iiprop : 'url',
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
