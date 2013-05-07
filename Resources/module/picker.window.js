//http://www.netfunctional.ca/apps/mapoverlay/documentation/
exports.create = function() {
	var self = require('module/win').create('Gartenplan');
	var icons = [{
		name : 'cafe',
		latlon : '53.5612591,9.8610395',
		title : 'Café Palme'
	}, {
		name : 'wc',
		latlon : '53.5618549,9.8600739',
		title : 'Toiletten'
	}, {
		name : 'wc',
		latlon : '53.5592772,9.8624182',
		title : 'Toiletten'
	}, {
		name : 'velo',
		latlon : '53.5592549,9.8626864',
		title : 'Toiletten'
	}];
	var Map = require('netfunctional.mapoverlay');
	self.map = Map.createMapView({
		mapType : Titanium.Map.HYBRID_TYPE,
		userLocation : true,
		bubbleParent : true,
		region : {
			latitude : 53.5614057,
			longitude : 9.8614097,
			latitudeDelta : 0.003,
			longitudeDelta : 0.003
		}

	});
	self.locked = false;
	var overlays = {};
	var Polygons = require('module/model').getAreas();
	var regions = Polygons.regions;
	for (var name in Polygons.polygons) {
		overlays[name] = {
			name : name,
			type : "polygon",
			points : Polygons.polygons[name],
			strokeColor : "green",
			strokeAlpha : 1,
			fillColor : "red",
			fillAlpha : 0.2
		};
		self.map.addOverlay(overlays[name]);

	}
	var picker = Ti.UI.createPicker({
		minified : true,
		top : 0,
		selectionIndicator : true,
		anchorPoint : {
			x : 1,
			y : 0
		},
		useSpinner : true,
		transform : Ti.UI.create2DMatrix({
			scale : 0.4
		})
	});
	picker.addEventListener('change', function(_e) {
		if (self.locked == true)
			return;
		self.locked = true;
		setTimeout(function() {
			picker.animate({
				duration : 700,
				transform : Ti.UI.create2DMatrix({
					scale : 0.4
				})
			});
			self.locked = false;
		}, 1000);
		self.setTitle(picker.getSelectedRow(0).title);
		setTimeout(function() {
			if (regions[self.title]) {
				self.map.setLocation({
					animate : true,
					latitude : regions[self.title].latitude,
					longitude : regions[self.title].longitude,
					latitudeDelta : 0.001,
					longitudeDelta : 0.001
				});
			}
		}, 700);
	});
	var cover = Ti.UI.createView({
		right : 0,
		width : 200,
		height : 200,
		top : 0,
	});

	cover.addEventListener('click', function() {
		if (self.locked == true)
			return;
		picker.animate({
			transform : Ti.UI.create2DMatrix({
				scale : 1
			})
		});
	});

	var bereiche = require('module/model').getBereiche();
	var color = ['red', 'green', 'blue', 'orange'];
	var column1 = Ti.UI.createPickerColumn();
	for (var i = 0, ilen = bereiche.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : bereiche[i]
		});
		column1.addRow(row);
	}
	var column2 = Ti.UI.createPickerColumn();
	for (var i = 0, ilen = color.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : color[i]
		});
		column2.addRow(row);
	}
	picker.add([column1]);
	self.add(self.map);
	self.add(picker);
	self.add(cover);
	for (var i = 0; i < icons.length; i++) {
		self.map.addAnnotation(Map.createAnnotation({
			latitude : icons[i].latlon.split(',')[0],
			title : icons[i].title,
			animate : true,
			longitude : icons[i].latlon.split(',')[1],
			image : 'assets/' + icons[i].name + '.png'
		}));
	}
	self.addEventListener('touch', function(_e) {
		console.log(_e)
	});

	Ti.Gesture.addEventListener('shake', function() {
		require('module/model').savePOI(self.getTitle());
	});
	return self;
}
