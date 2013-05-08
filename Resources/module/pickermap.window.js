//http://www.netfunctional.ca/apps/mapoverlay/documentation/
var Map = function() {
	return this.create();
}
Map.prototype.create = function() {
	this.win = require('module/win').create('Gartenplan');
	this.win.oldarea = null;
	this.win.locked = false;
	Ti.include('/depot/icons.js');
	// special Map with overlays
	var Map = require('netfunctional.mapoverlay');
	this.win.map = Map.createMapView({
		mapType : Titanium.Map.HYBRID_TYPE,
		userLocation : true,
		region : {
			latitude : 53.5614057,
			longitude : 9.8614097,
			latitudeDelta : 0.004,
			longitudeDelta : 0.004
		}
	});
	//	this.win.map.myregion = this.win.map.getRegion();
	var overlays_passive = {}, overlays_active = {};
	// retrieving araas from KML-file:
	var Polygons = require('module/model').getAreas();
	var regions = Polygons.regions;
	var polygons = Polygons.polygons;
	// build all polygons:
	this.win.map.addEventListener('complete', function() {
		for (var name in polygons) {
			overlays_passive[name] = {
				name : name,
				type : "polygon",
				points : Polygons.polygons[name],
				strokeColor : "green",
				strokeAlpha : 1,
				fillColor : "green",
				fillAlpha : 0.1
			};
			overlays_active[name] = {
				name : name,
				type : "polygon",
				points : Polygons.polygons[name],
				strokeColor : "white",
				strokeAlpha : 1,
				fillColor : "white",
				fillAlpha : 0.2
			};
			that.win.map.addOverlay(overlays_passive[name]);
		}
	});
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
		// avoiding of hazards:
		if (that.win.locked == true)
			return;
		that.win.locked = true;
		setTimeout(function() {
			picker.animate({
				duration : 700,
				transform : Ti.UI.create2DMatrix({
					scale : 0.4
				})
			});
			that.win.locked = false;
		}, 100);
		// changing of window title
		that.win.setTitle(area);
		if (regions[area] && regions[area].latitude) {
			that.win.map.setLocation({
				animate : true,
				latitude : regions[area].latitude,
				longitude : regions[area].longitude,
				latitudeDelta : 0.003,
				longitudeDelta : 0.003
			});
		}
		try {
			if (that.win.oldarea) {
				that.win.map.removeOverlay(overlays_passive[that.win.oldarea]);
			}
			that.win.map.removeOverlay(overlays_passive[area]);
			that.win.map.addOverlay(overlays_active[area]);
			that.win.oldarea = area;
		} catch (E) {
		}
	});
	// trigger for picker, because picker has no click event:
	var cover = Ti.UI.createView({
		right : 0,
		width : 200,
		height : 200,
		top : 0,
	});
	var that = this;
	cover.addEventListener('click', function() {
		if (that.win.locked === true)
			return;
		picker.animate({
			transform : Ti.UI.create2DMatrix({
				scale : 1
			})
		});
	});
	var bereiche = require('module/model').getBereiche();
	var column1 = Ti.UI.createPickerColumn();
	for (var i = 0, ilen = bereiche.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : bereiche[i]
		});
		column1.addRow(row);
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
	this.win.map.addEventListener('longpress', function(_e) {
		var area = require('vendor/mapposition').getArea(require('vendor/mapposition').getPosition(_e),polygons);
	});
	return this.win;
}

Map.prototype.setArea = function(_area) {
	if (!_area)
		return
}
module.exports = Map;
