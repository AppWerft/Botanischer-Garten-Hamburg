//http://www.netfunctional.ca/apps/mapoverlay/documentation/
var Map = function() {
	return this.create();
}
Map.prototype.create = function() {
	this.win = require('module/win').create('Gartenplan');
	this.win.oldarea = null;
	Ti.include('/depot/icons.js');
	var Map = require('netfunctional.mapoverlay');
	this.win.map = Map.createMapView({
		mapType : Titanium.Map.HYBRID_TYPE,
		userLocation : true,
		region : {
			latitude : 53.5614057,
			longitude : 9.8614097,
			latitudeDelta : 0.003,
			longitudeDelta : 0.003
		}

	});
	this.win.locked = false;
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
		this.win.map.addOverlay(overlays[name]);

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
		var area = picker.getSelectedRow(0).title;
		if (this.win.locked == true)
			return;
		this.win.locked = true;
		setTimeout(function() {
			picker.animate({
				duration : 700,
				transform : Ti.UI.create2DMatrix({
					scale : 0.4
				})
			});
			this.win.locked = false;
		}, 100);
		this.win.setTitle(area);
		if (regions[area] && regions[area].latitude) {
			this.win.map.setLocation({
				animate : true,
				latitude : regions[area].latitude,
				longitude : regions[area].longitude,
				latitudeDelta : 0.001,
				longitudeDelta : 0.001
			});
			overlays[area].fillColor = 'yellow';
		}

	});
	var cover = Ti.UI.createView({
		right : 0,
		width : 200,
		height : 200,
		top : 0,
	});

	cover.addEventListener('click', function() {
		if (this.win.locked == true)
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
	this.win.add(this.win.map);
	this.win.add(picker);
	this.win.add(cover);
	for (var i = 0; i < icons.length; i++) {
		this.win.map.addAnnotation(Map.createAnnotation({
			latitude : icons[i].latlon.split(',')[0],
			title : icons[i].title,
			animate : true,
			longitude : icons[i].latlon.split(',')[1],
			image : 'assets/' + icons[i].name + '.png'
		}));
	}
	this.win.addEventListener('touch', function(_e) {
		console.log(_e)
	});

	Ti.Gesture.addEventListener('shake', function() {
		require('module/model').savePOI(this.win.getTitle());
	});
	return this.win;
}


module.exports = Map;
