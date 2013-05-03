exports.create = function() {
	var self = Ti.UI.createWindow({
		navBarHidden : true
	});
	self.annotations = [];
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
	self.addEventListener('focus', function() {
		require('vendor/panoramio').get({
			lat : 53.5614057,
			lon : 9.8614097,
			delta : 0.003
		}, function(_datas) {
			for (var i = 0; i < _datas.length; i++) {
				var p = _datas[i];
				self.annotations[i] = Ti.Map.createAnnotation({
					latitude : p.lat,
					longitude : p.lon,
					title : p.title,
					image : '/assets/pin.png',
					animate : true,
					subtitle : p.owner
				});
			};
			console.log(self.annotations);
			self.map.addAnnotations(self.annotations);
		});
	});
	return self;
}
