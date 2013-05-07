exports.getPolygon = function(_name) {
	var kmlstring = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'Botanischer Garten Hamburg.kml').read().toString();
	var XMLTools = require("vendor/XMLTools");
	var kml = new XMLTools(kmlstring);
	var polygones = kml.toObject().Document.Folder.Placemark;
	for (var i = 0; i < polygones.length; i++) {
		if (polygones[i].name == _name) {
			var coords = polygones[i].Polygon.outerBoundaryIs.LinearRing.coordinates.split(' ');
			console.log(polygones[i].Polygon);
		}

	}
}

exports.getPolygonsFromLocalKML = function(filename) {
	var kmlstring = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,filename).read().toString();
	var XMLTools = require("vendor/XMLTools");
	var kml = new XMLTools(kmlstring);
	var polygones = kml.toObject().Document.Folder.Placemark;
	var vertices = {}, regions = {};
	for (var i = 0; i < polygones.length; i++) {
		var coords = polygones[i].Polygon.outerBoundaryIs.LinearRing.coordinates.split(' ');
		vertices[polygones[i].name] = [];
		regions[polygones[i].name] = {};
		var sumlat = 0, sumlon = 0;
		for (var c = 0; c < coords.length - 1; c++) {
			vertices[polygones[i].name].push({
				latitude : parseFloat(coords[c].split(',')[1]),
				longitude : parseFloat(coords[c].split(',')[0])
			});
			sumlat += parseFloat(coords[c].split(',')[1]);
			sumlon += parseFloat(coords[c].split(',')[0]);
		}
		regions[polygones[i].name].latitude = sumlat / (coords.length - 1);
		regions[polygones[i].name].longitude = sumlon / (coords.length - 1);

	}
	return {
		polygons : vertices,
		regions : regions
	};
}
