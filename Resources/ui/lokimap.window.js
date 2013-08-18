//http://www.netfunctional.ca/apps/mapoverlay/documentation/
var Map = function() {
	var self = this;
	var Picker;
	this.area = {};
	this.win = require('ui/win').create('Loki-Schmidt-Gartenplan');

	this.activearea = null;
	this.locked = false;
	this.overlays_passive = {}, this.overlays_active = {};
	this.OverlayMap = require('netfunctional.mapoverlay');
	var pickerButton = Ti.UI.createButton({
		width : 35,
		height : 30,
		backgroundImage : 'assets/picker.png'
	});
	var areaButton = Ti.UI.createButton({
		width : 35,
		height : 30,
		backgroundImage : 'assets/areas.png'
	});

	this.win.rightNavButton = areaButton;
	Ti.include('/depot/icons.js');
	// special Map with overlays
	self.win.overlayslider = require('ui/overlayslider').create({
		onstop : function(_e) {
			self.setAlphaGroundOverlay(_e);
		},
		onchange : function(_e) {
		}
	});

	self.win.map = this.OverlayMap.createMapView({
		top : 0,
		mapType : Titanium.Map.HYBRID_TYPE,
		userLocation : true,
		regionFit : false,
		region : {
			latitude : 53.5614057,
			longitude : 9.8614097,
			latitudeDelta : 0.005,
			longitudeDelta : 0.005
		}
	});
	self.win.add(self.win.map);
	self.win.add(self.win.overlayslider);
	Ti.App.LokiModel.getAreas({
		onload : function(_a) {
			self.area = _a;
			for (var name in self.area.area_arrays) {
				
				self.overlays_passive[name] = {
					name : name,
					type : "polygon",
					points : self.area.area_arrays[name],
					strokeColor : "green",
					strokeAlpha : 0,
					fillColor : "green",
					fillAlpha : 0
				};
				self.overlays_active[name] = {
					name : name + '_',
					type : "polygon",
					points : self.area.area_arrays[name],
					strokeColor : "white",
					strokeWidth : 2,
					strokeAlpha : 0,
					fillColor : "black",
					fillAlpha : 0
				};
				self.win.map.addOverlay(self.overlays_passive[name]);
			}
			var pickermodule = require('ui/areapicker');
			Picker = new pickermodule({
				onchange : function(_name) {
					self.setArea(_name);
				},
				area_names : self.area.area_names
			});
			self.win.add(Picker.getView());
			self.win.map.addEventListener('longpress', function(_e) {
				if (self.locked)
					return;
				self.locked = true;
				if (self.win.map.annotation) {
					self.win.map.removeAnnotation(self.win.map.annotation);
					self.win.map.annotation = null;
				}
				var clickpoint = require('vendor/map.polygonclick').getClickPosition(_e);
				var nameofclickedarea = undefined;
				for (var i = 0; i < self.area.area_names.length; i++) {
					if (require('vendor/map.polygonclick').isPointInPoly(self.area.area_arrays[self.area.area_names[i]], clickpoint) === true) {
						nameofclickedarea = self.area.area_names[i];
						break;
					};
				}
				if (nameofclickedarea != undefined) {
					self.win.map.annotation = self.OverlayMap.createAnnotation({
						latitude : self.area.area_regions[nameofclickedarea].latitude,
						longitude : self.area.area_regions[nameofclickedarea].longitude,
						title : nameofclickedarea,
						layer : 'area',
						rightButton : Ti.UI.iPhone.SystemButton.DISCLOSURE,
						image : '/assets/null.png'
					});
					var total = self.area.area_regions[nameofclickedarea].total;
					if (total > 0) {
						self.win.map.annotation.rightButton = Ti.UI.iPhone.SystemButton.DISCLOSURE;
						self.win.map.annotation.subtitle = total + ' Pflanzen';
					}
					self.win.map.addAnnotation(self.win.map.annotation);
					self.win.map.selectAnnotation(self.win.map.annotation);
				}
				setTimeout(function() {
					self.locked = false
				}, 3000);
			});
		} //  onload
	});

	for (var i = 0; i < icons.length; i++) {
		self.win.map.addAnnotation(self.OverlayMap.createAnnotation({
			latitude : icons[i].latlon.split(',')[0],
			title : icons[i].title,
			animate : true,
			longitude : icons[i].latlon.split(',')[1],
			image : 'assets/' + icons[i].name + '.png'
		}));
	}
	self.win.leftNavButton = pickerButton;
	self.addGroundOverlay();
	pickerButton.addEventListener('click', function() {
		if (Picker) {
			Picker.show();
			setTimeout(function() {
				Picker.hide();
			}, 20000);
		}
	});
	areaButton.addEventListener('click', function(_e) {
		if (!_e.source.overlayadded) {
			self.win.overlayslider.animate({
				top : 0
			});
			_e.source.overlayadded = true;
		} else {
			self.win.overlayslider.animate({
				top : -40
			});
			_e.source.overlayadded = false;
		}
	});
	this.win.map.addEventListener('click', function(_e) {
		if (_e.clicksource == 'rightButton' && _e.annotation.layer == 'area') {
			self.win.tab.open(require('ui/bereich.window').create(_e.annotation.title));
		}
	});
	return this;
};

Map.prototype.createWindow = function() {
	return this.win;
};
/*
 *
 *
 *
 */

Map.prototype.setArea = function(_name) {
	this.win.setTitle(_name);
	var self = this;
	var region = self.area.area_regions[_name];
	var total = self.area.area_regions[_name].total;
	region.animate = true;
	self.win.map.setLocation(region);
	if (self.win.map.annotation) {
		self.win.map.removeAnnotation(self.win.map.annotation);
		self.win.map.annotation = null;
	}
	self.win.map.annotation = self.OverlayMap.createAnnotation({
		latitude : self.area.area_regions[_name].latitude,
		longitude : self.area.area_regions[_name].longitude,
		title : _name,
		layer : 'area',
		animate : true,
		image : '/assets/null.png'
	});
	if (total > 0) {
		self.win.map.annotation.rightButton = Titanium.UI.iPhone.SystemButton.DISCLOSURE;
		self.win.map.annotation.subtitle = total + ' Pflanzen';
	}
	self.win.map.addAnnotation(self.win.map.annotation);
	self.win.map.selectAnnotation(self.win.map.annotation);
};

var overlay = {
	name : 'loki_esri_map',
	type : 'image',
	northWestCoord : {
		latitude : 53.5655,
		longitude : 9.856730
	},
	southEastCoord : {
		latitude : 53.5587,
		longitude : 9.8641
	},
	alpha : 0.6,
	img : 'assets/gartenplan.png'
};

Map.prototype.addGroundOverlay = function() {
	this.win.map.addOverlay(overlay);
};
Map.prototype.removeGroundOverlay = function() {
	this.win.map.removeOverlay({
		name : 'loki_esri_map'
	});
};
Map.prototype.setAlphaGroundOverlay = function(alpha) {
	overlay.alpha = alpha;
	this.win.map.removeOverlay({
		name : 'loki_esri_map'
	});
	this.win.map.addOverlay(overlay);

};
module.exports = Map;
