exports.create = function() {
	var self = require('module/win').create('Panoramio-Bilder');
	var LAT = 53.5614057, LON = 9.8614097, DELTA = 0.004;
	var Panoramio = require('vendor/panoramio');
	var locked = false;
	var annotations = {};
	var updateAnnotations = function(_datas) {
		for (var id in _datas) {
			if (!annotations[id]) {
				var p = _datas[id];
				annotations[id] = Ti.Map.createAnnotation({
					latitude : p.lat,
					longitude : p.lon,
					title : p.title,
					image : '/assets/pin.png',
					animate : false,
					subtitle : p.owner + ' ' + p.cdate,
					data : p,
					imageurl : p.image,
					ratio : p.ratio
				});
				Panoramio.setThumb(annotations[id]);
				self.map.addAnnotation(annotations[id]);
			}
		};
		locked = false;

	};
	self.map = Ti.Map.createView({
		mapType : Titanium.Map.STANDARD_TYPE,
		region : {
			latitude : LAT,
			longitude : LON,
			latitudeDelta : DELTA,
			longitudeDelta : DELTA
		},
		regionFit : true,
		userLocation : false,

	});
	self.add(self.map);
	self.map.addEventListener('click', function(_e) {
		if (_e.clicksource != 'pin') {
			self.tab.open(require('module/panoramioimage.window').create(_e.annotation));
		}
	});
	self.addEventListener('focus', function() {
		locked = true;
		Panoramio.get({
			lat : LAT,
			lon : LON,
			delta : DELTA
		}, updateAnnotations)
	});
	self.map.addEventListener('regionchanged', function(_e) {
		if (locked === true)
			return;
		Ti.App.fireEvent('app:abortpanoramio');
		locked = true;
		Panoramio.get({
			lat : _e.latitude,
			lon : _e.longitude,
			delta : _e.latitudeDelta
		}, updateAnnotations);
		// Garbage Collection:
		for (var id in annotations) {
			var a = annotations[id];
			if (a.getLatitude() > _e.latitude + _e.latitudeDelta / 2 || a.getLatitude() < _e.latitude - _e.latitudeDelta / 2 || a.getLongitude() > _e.longitude + _e.longitudeDelta / 2 || a.getLongitude() < _e.longitude - _e.longitudeDelta / 2) {
				self.map.removeAnnotation(a);
				delete a;
			}
		}
	})
	return self;
}
