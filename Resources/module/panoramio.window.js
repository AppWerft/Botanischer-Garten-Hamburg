exports.create = function() {
	var self = require('module/win').create('Panoramio-Bilder');
	var annotations = [];
	self.map = Ti.Map.createView({
		mapType : Titanium.Map.HYBRID_TYPE,
		region : {
			latitude : 53.5614057,
			longitude : 9.8614097,
			latitudeDelta : 0.003,
			longitudeDelta : 0.003
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
		if (annotations.length)
			return;
		require('vendor/panoramio').get({
			lat : 53.5614057,
			lon : 9.8614097,
			delta : 0.004
		}, function(_datas) {
			for (var i = 0; i < _datas.length; i++) {
				var p = _datas[i];
				annotations[i] = Ti.Map.createAnnotation({
					latitude : p.lat,
					longitude : p.lon,
					title : p.title,
					image : '/assets/pin.png',
					animate : true,
					subtitle : p.owner,
					data : p,
					imageurl : p.image,
					ratio : p.ratio
				});
			};
			self.map.addAnnotations(annotations);
		});
	});
	return self;
}
