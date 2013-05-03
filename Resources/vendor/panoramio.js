exports.get = function(_options, _callback) {
	var minx = _options.lon - _options.delta, miny = _options.lat - _options.delta, maxx = _options.lon + _options.delta, maxy = _options.lat + _options.delta;
	var url = 'http://www.panoramio.com/map/get_panoramas.php?set=full&mapfilter=true&from=0&to=100&minx=' + minx + '&miny=' + miny + '&maxx=' + maxx + '&maxy=' + maxy + '&size=thumbnail'
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var photos = JSON.parse(xhr.responseText).photos;
			var res = [];
			for (var i = 0; i < photos.length; i++) {
				res.push({
					lat : photos[i].latitude,
					lon : photos[i].longitude,
					title : photos[i].photo_title,
					owner : photos[i].owner_name,
					image : photos.photo_file_url
				});
			}
			_callback(res);
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
}
