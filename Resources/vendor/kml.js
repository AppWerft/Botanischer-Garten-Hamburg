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

exports.getPolygonsFromLocalKML = function() {
	var kmlstring = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'Botanischer Garten Hamburg.kml').read().toString();
	var XMLTools = require("vendor/XMLTools");
	var kml = new XMLTools(kmlstring);
	var polygones = kml.toObject().Document.Folder.Placemark;
	var res = {};
	for (var i = 0; i < polygones.length; i++) {
		var coords = polygones[i].Polygon.outerBoundaryIs.LinearRing.coordinates.split(' ');
		res[polygones[i].name] = [];
		for (var c = 0; c < coords.length-1; c++) {
			res[polygones[i].name].push({
				latitude : parseFloat(coords[c].split(',')[1]),
				longitude : parseFloat(coords[c].split(',')[0])
			});
		}
	}
	return res;
}
