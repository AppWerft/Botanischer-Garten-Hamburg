//http://www.netfunctional.ca/apps/mapoverlay/documentation/
var Map = function() {
	return this.create();
}

Map.prototype.create = function() {
	var that = this;
	this.win = require('module/win').create('Loki-Schmidt-Gartenplan');
	this.activearea = null;
	this.locked = false;
	// for picker.
	this.bereiche = Ti.App.botgartenModel.getBereiche();
	this.overlays_passive = {}, this.overlays_active = {};
	var pickerButton = Ti.UI.createButton({
		width : 50,
		height : 40,
		backgroundImage : 'assets/picker.png'
	});

	Ti.include('/depot/icons.js');
	// special Map with overlays
	var Map = require('netfunctional.mapoverlay');

	that.win.map = Map.createMapView({
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
	// retrieving araas from KML-file:
	//var Polygons = require('module/model').getAreas();
	that.areas = require('module/botanicgarden.model').getAreas().areas;
	that.centers_of_areas = require('module/botanicgarden.model').getAreas().centers_of_areas;

	// build all polygons:
	that.win.map.addEventListener('complete', function() {
		for (var name in that.areas) {
			that.overlays_passive[name] = {
				name : name,
				type : "polygon",
				points : that.areas[name],
				strokeColor : "green",
				strokeAlpha : 1,
				fillColor : "green",
				fillAlpha : 0
			};
			that.overlays_active[name] = {
				name : name + '_',
				type : "polygon",
				points : that.areas[name],
				strokeColor : "white",
				strokeWidth : 2,
				strokeAlpha : 1,
				fillColor : "black",
				fillAlpha : 0
			};
			that.win.map.addOverlay(that.overlays_passive[name]);
		}
	});

	for (var i = 0; i < icons.length; i++) {
		that.win.map.addAnnotation(Map.createAnnotation({
			latitude : icons[i].latlon.split(',')[0],
			title : icons[i].title,
			animate : true,
			longitude : icons[i].latlon.split(',')[1],
			image : 'assets/' + icons[i].name + '.png'
		}));
	}
	for (var name in that.centers_of_areas) {
		that.win.map.addAnnotation(Map.createAnnotation({
			latitude : that.centers_of_areas[name].latitude,
			title : name,
			subtitle : require('module/botanicgarden.model').getArtenByBereich(name).length + ' Pflanzen',
			rightButton : Ti.UI.iPhone.SystemButton.DISCLOSURE,
			layer : 'area',
			longitude : that.centers_of_areas[name].longitude,
			image : 'assets/null.png'
		}));
	}

	//Picker:
	that.win.leftNavButton = pickerButton;
	that.picker = Ti.UI.createPicker({
		minified : true,
		top : 0,
		selectionIndicator : true,
		useSpinner : true,
		opacity : 0,
	});
	that.picker.addEventListener('change', function(_e) {
		var area = that.picker.getSelectedRow(0).title;
		that.setArea(area);
	});
	// trigger for picker, because picker has no click event:
	var column1 = Ti.UI.createPickerColumn();
	for (var i = 0, ilen = that.bereiche.length; i < ilen; i++) {
		var row = Ti.UI.createPickerRow({
			title : that.bereiche[i]
		});
		column1.addRow(row);
	}
	that.picker.add([column1]);
	that.win.add(that.win.map);
	that.win.add(that.picker);
	pickerButton.addEventListener('click', function() {
		that.picker.animate({
			opacity : 1
		});
		setTimeout(function() {
			that.picker.animate({
				opacity : 0
			})
		}, 20000);
	});
	that.win.map.addEventListener('longpress', function(_e) {
		console.log('longpressed');
		var clickpoint = require('vendor/map.polygonclick').getClickPosition(_e);
		var nameofclickedarea = undefined;
		for (var name in that.areas) {
			if (require('vendor/map.polygonclick').isPointInPoly(that.areas[name], clickpoint) === true) {
				nameofclickedarea = name;
				break;
			};
		}
		console.log(nameofclickedarea);
		that.setArea(nameofclickedarea);
	});
	that.win.map.addEventListener('click', function(_e) {
		if (!_e.clicksource && _e.title) {
			//that.setArea(_e.title);
			return;
		}
		if (_e.clicksource == 'pin' && _e.annotation.layer == 'area') {
			that.setArea(_e.annotation.title);
		}
		if (_e.clicksource == 'rightButton' && _e.annotation.layer == 'area') {
			that.win.tab.open(require('module/bereich.window').create(_e.annotation.title));
		}
	});

	return this.win;
}
/*
 *
 *
 *
 */
Map.prototype.setArea = function(_area) {
	if (!_area || this.locked == true)
		return;
	this.locked = true;
	var that = this;
	setTimeout(function() {
		that.picker.animate({
			duration : 700,
			opacity : 0
		});
		that.locked = false;
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
			that.win.map.selectAnnotation(_area);
		}, 700);

		this.activearea = _area;
	} catch(E) {
	}
	var regiondx = 0;
	for (var name in that.areas) {
		if (name == _area) {
			that.locked = true;
			that.picker.setSelectedRow(0, regiondx);
			setTimeout(function() {
				that.locked = false;
			}, 2000);
		}
		regiondx++;
	}
}
/*
 *
 *
 *
 *
 */
module.exports = Map;
