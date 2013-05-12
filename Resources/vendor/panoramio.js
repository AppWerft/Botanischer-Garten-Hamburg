exports.get = function(_options, _callback) {
	var minx = _options.lon - _options.delta, miny = _options.lat - _options.delta, maxx = _options.lon + _options.delta, maxy = _options.lat + _options.delta;
	var url = 'http://www.panoramio.com/map/get_panoramas.php?mapfilter=true&set=full&mapfilter=true&from=0&to=60&minx=' + minx + '&miny=' + miny + '&maxx=' + maxx + '&maxy=' + maxy + '&size=original'
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var photos = JSON.parse(xhr.responseText).photos;
			var res = {};
			for (var i = 0; i < photos.length; i++) {
				res[photos[i].photo_id] = {
					lat : photos[i].latitude,
					lon : photos[i].longitude,
					title : photos[i].photo_title,
					owner : photos[i].owner_name,
					image : photos[i].photo_file_url,
					ratio : photos[i].width / photos[i].width,
					cdate : photos[i].upload_date
				};
			}
			_callback(res);
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
	Ti.App.addEventListener('app:abortpanoramio', function() {
		xhr.abort();
	});
}

exports.setThumb = function(_annotation) {
	var url = _annotation.data.image.replace(/original/g, 'mini_square');
	var imageDirectoryName = 'panoramiocache';
	var filename = Ti.Utils.md5HexDigest(url) + '.png';
	//var hiresfilename = Ti.Utils.md5HexDigest(url) + '@2x.png';
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName, filename);
	//var hiresfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName, hiresfilename);
	if (file.exists()) {
		_annotation.setImage(file.nativePath);
	} else {
		var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName);
		if (!g.exists()) {
			g.createDirectory();
		};
		var xhr = Ti.Network.createHTTPClient();
		xhr.onerror = function() {
			console.log(this.error);
		}
		xhr.onload = function() {
			if (xhr.status == 200) {
				file.write(xhr.responseData);
				//	hiresfile.write(xhr.responseData);
				if (_annotation)
					_annotation.setImage(file.nativePath);

			} else
				console.log(this.status);
		};
		xhr.open('GET', url);
		xhr.send();
	};
}