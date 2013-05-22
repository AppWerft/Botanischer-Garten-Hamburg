function _parseKML(_kmlstring) {
	var xml2json = require('ti.xml2json');
	var json = xml2json.convert(_kmlstring);
	var polygones = json.kml.Document.Folder.Placemark;
	var vertices = {}, regions = {};
	for (var i = 0; i < polygones.length; i++) {
		var coords = polygones[i].Polygon.outerBoundaryIs.LinearRing.coordinates.text.split(' ');
		vertices[polygones[i].name.text] = [];
		regions[polygones[i].name.text] = {};
		var sumlat = 0, sumlon = 0;
		for (var c = 0; c < coords.length - 1; c++) {
			vertices[polygones[i].name.text].push({
				latitude : parseFloat(coords[c].split(',')[1]),
				longitude : parseFloat(coords[c].split(',')[0])
			});
			sumlat += parseFloat(coords[c].split(',')[1]);
			sumlon += parseFloat(coords[c].split(',')[0]);
		}
		regions[polygones[i].name.text].latitude = sumlat / (coords.length - 1);
		regions[polygones[i].name.text].longitude = sumlon / (coords.length - 1);
	}console.log(vertices);
	return {
		areas : vertices,
		centers_of_areas : regions
	}
}

exports._parseKML = _parseKML;

exports.getPolygonsFromLocalKML = function(filename) {
	var kmlstring = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, filename).read().toString();
	var res = _parseKML(kmlstring);
	return res;
}
