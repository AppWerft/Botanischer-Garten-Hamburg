//http://www.netfunctional.ca/apps/mapoverlay/documentation/
var Map = function() {
	var self = this;
	var Picker;
	this.win = require('module/win').create('Loki-Schmidt-Gartenplan');
	this.activearea = null;
	this.locked = false;
	this.overlays_passive = {}, this.overlays_active = {};
	var pickerButton = Ti.UI.createButton({
		width : 50,
		height : 40,
		backgroundImage : 'assets/picker.png'
	});

	Ti.include('/depot/icons.js');
	// special Map with overlays
	var OverlayMap = require('netfunctional.mapoverlay');
	self.win.map = OverlayMap.createMapView({
		mapType : Titanium.Map.HYBRID_TYPE,
		userLocation : true,
		regionFit : true,
		region : {
			latitude : 53.5614057,
			longitude : 9.8614097,
			latitudeDelta : 0.005,
			longitudeDelta : 0.005
		}
	});
	self.win.add(self.win.map);
	Ti.App.LokiModel.getAreas({
		onload : function(_a) {
			for (var name in _a.area_arrays) {
				self.overlays_passive[name] = {
					name : name,
					type : "polygon",
					points : _a.area_arrays[name],
					strokeColor : "green",
					strokeAlpha : 1,
					fillColor : "green",
					fillAlpha : 0
				};
				self.overlays_active[name] = {
					name : name + '_',
					type : "polygon",
					points : _a.area_arrays[name],
					strokeColor : "white",
					strokeWidth : 2,
					strokeAlpha : 1,
					fillColor : "black",
					fillAlpha : 0
				};
				self.win.map.addOverlay(self.overlays_passive[name]);
			}
			var pickermodule = require('module/areapicker');
			Picker = new pickermodule({
				onchange : function(_name) {
					self.win.setTitle(_name);
					var region = _a.area_regions[_name];
					region.animate = true;
					self.win.map.setLocation(region);
					if (self.win.map.annotation) {
						self.win.map.removeAnnotation(self.win.map.annotation);
						self.win.map.annotation = null;
					}
					self.win.map.annotation = OverlayMap.createAnnotation({
						latitude : _a.area_regions[_name].latitude,
						longitude : _a.area_regions[_name].longitude,
						title : _name,
						layer : 'area',
						animate : true,
						image : '/assets/null.png'
					});
					var total = _a.area_regions[_name].total;
					if (total > 0) {
						self.win.map.annotation.rightButton = Titanium.UI.iPhone.SystemButton.DISCLOSURE;
						self.win.map.annotation.subtitle = total + ' Pflanzen';
					}
					self.win.map.addAnnotation(self.win.map.annotation);
					self.win.map.selectAnnotation(self.win.map.annotation);
				},
				area_names : _a.area_names
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
				for (var i = 0; i < _a.area_names.length; i++) {
					if (require('vendor/map.polygonclick').isPointInPoly(_a.area_arrays[_a.area_names[i]], clickpoint) === true) {
						nameofclickedarea = _a.area_names[i];
						break;
					};
				}
				if (nameofclickedarea != undefined) {
					self.win.map.annotation = OverlayMap.createAnnotation({
						latitude : _a.area_regions[nameofclickedarea].latitude,
						longitude : _a.area_regions[nameofclickedarea].longitude,
						title : nameofclickedarea,
						layer : 'area',
						rightButton : Titanium.UI.iPhone.SystemButton.DISCLOSURE,
						image : '/assets/null.png'
					});
					var total = _a.area_regions[nameofclickedarea].total;
					if (total > 0) {
						self.win.map.annotation.rightButton = Titanium.UI.iPhone.SystemButton.DISCLOSURE;
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
		self.win.map.addAnnotation(OverlayMap.createAnnotation({
			latitude : icons[i].latlon.split(',')[0],
			title : icons[i].title,
			animate : true,
			longitude : icons[i].latlon.split(',')[1],
			image : 'assets/' + icons[i].name + '.png'
		}));
	}
	self.win.leftNavButton = pickerButton;
	pickerButton.addEventListener('click', function() {
		if (Picker) {
			Picker.show();
			setTimeout(function() {
				Picker.hide();
			}, 20000);
		}
	});

	self.win.map.addEventListener('click', function(_e) {
		if (_e.clicksource == 'rightButton' && _e.annotation.layer == 'area') {
			self.win.tab.open(require('module/bereich.window').create(_e.annotation.title));
		}
	});

	return this;
}

Map.prototype.createWindow = function() {
	return this.win;
}
/*
 *
 *
 *
 */

/*
 Map.prototype.setArea = function(_area) {
 if (!_area || this.locked == true)
 return;
 this.locked = true;
 var self = this;
 setTimeout(function() {
 self.picker.animate({
 duration : 700,
 opacity : 0
 });
 self.locked = false;
 }, 100);
 if (this.centers_of_areas[_area] && this.centers_of_areas[_area].latitude) {
 this.win.map.setLocation({
 animate : true,
 latitude : this.centers_of_areas[_area].latitude,
 longitude : this.centers_of_areas[_area].longitude,
 latitudeDelta : this.win.map.getLatitudeDelta(),
 longitudeDelta : this.win.map.getLongitudeDelta()
 });
 }

 i
 }
 regiondx++;
 }
 }*/
module.exports = Map;
