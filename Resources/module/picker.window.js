exports.create = function() {
	var self = require('module/win').create('Gartenplan');

	var Map = require('netfunctional.mapoverlay');
	self.map = Map.createMapView({
		mapType : Titanium.Map.HYBRID_TYPE,
		region : {
			latitude : 53.5614057,
			longitude : 9.8614097,
			latitudeDelta : 0.003,
			longitudeDelta : 0.003
		}
	});
	var overlays = {};
	var Polygons = require('vendor/kml').getPolygonsFromLocalKML();
	var regions = Polygons.regions;
	for (var name in Polygons.polygons) {
		overlays[name] = {
			name : name,
			type : "polygon",
			points : Polygons.polygons[name],
			strokeColor : "red",
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
			scale : 0.3
		})
	});
	picker.addEventListener('change', function(_e) {
		picker.animate({
			duration : 700,
			transform : Ti.UI.create2DMatrix({
				scale : 0.3
			})
		});
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
		width : 100,
		height : 60,
		top : 0,
	});

	cover.addEventListener('click', function() {
		picker.animate({
			transform : Ti.UI.create2DMatrix({
				scale : 0.8
			})
		});
	});

	var bereiche = require('module/model').getBereiche();
	var color = ['red', 'green', 'blue', 'orange'];
	var column1 = Ti.UI.createPickerColumn();
	console.log(bereiche);
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
	return self;
}
