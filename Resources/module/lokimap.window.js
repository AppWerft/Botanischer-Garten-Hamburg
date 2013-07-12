//http://www.netfunctional.ca/apps/mapoverlay/documentation/
var Map = function() {
	var self = this;
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
	// retrieving araas from KML-file:

	// build all polygons:

	self.win.map.addEventListener('complete', function() {
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
				self.picker = require('module/areapicker').create({
					onchange : function(_e) {
					},
					area_names : _a.area_names
				})
				self.win.add(self.picker);
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
			self.picker.animate({
				opacity : 1
			});
			setTimeout(function() {
				self.picker.animate({
					opacity : 0
				})
			}, 20000);
		});
		/*		self.win.map.addEventListener('longpress', function(_e) {
		 var clickpoint = require('vendor/map.polygonclick').getClickPosition(_e);
		 var nameofclickedarea = undefined;
		 for (var name in self.areas) {
		 if (require('vendor/map.polygonclick').isPointInPoly(self.areas[name], clickpoint) === true) {
		 nameofclickedarea = name;
		 break;
		 };
		 }
		 console.log(nameofclickedarea);
		 self.setArea(nameofclickedarea);
		 });
		 self.win.map.addEventListener('click', function(_e) {
		 if (!_e.clicksource && _e.title) {
		 //self.setArea(_e.title);
		 return;
		 }
		 if (_e.clicksource == 'pin' && _e.annotation.layer == 'area') {
		 self.setArea(_e.annotation.title);
		 }
		 if (_e.clicksource == 'rightButton' && _e.annotation.layer == 'area') {
		 self.win.tab.open(require('module/bereich.window').create(_e.annotation.title));
		 }
		 });
		 */
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

 if (this.activearea && this.overlays_active[this.activearea]) {
 this.win.map.removeOverlay(this.overlays_active[this.activearea]);
 this.win.map.addOverlay(this.overlays_passive[this.activearea]);
 }
 try {
 this.win.map.removeOverlay(this.overlays_passive[_area]);
 this.win.map.addOverlay(this.overlays_active[_area]);
 console.log('selectPin ' + _area);
 setTimeout(function() {
 self.win.map.selectAnnotation(_area);
 }, 700);

 this.activearea = _area;
 } catch(E) {
 }
 var regiondx = 0;
 for (var name in self.areas) {
 if (name == _area) {
 self.locked = true;
 self.picker.setSelectedRow(0, regiondx);
 setTimeout(function() {
 self.locked = false;
 }, 2000);
 }
 regiondx++;
 }
 }*/
module.exports = Map;
