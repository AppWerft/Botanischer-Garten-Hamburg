/*
 * USAGE:
 *
 this.win.map.addEventListener('longpress', function(_e) {
 var clickpoint = require('vendor/map.polygonclick').getClickPosition(_e);
 var nameofclickedarea = undefined;
 for (var name in areas) {
 if (require('vendor/map.polygonclick').isPointInPoly(areas[name], clickpoint) === true) {
 nameofclickedarea = name;
 break;
 };
 }
 if (nameofclickedarea) this.map.changeArea(nameofclickedarea);
 });
 *
 */
exports.getClickPosition = function(_options) {
	var region = _options.source.region, x = _options.x, y = _options.y, width = _options.source.rect.width, height = _options.source.rect.height;
	return {
		latitude : region.latitude + region.latitudeDelta / 2 - y * parseFloat(region.latitudeDelta) / height,
		longitude : region.longitude - region.longitudeDelta / 2 + x * parseFloat(region.longitudeDelta) / width
	};
}

exports.isPointInPoly = function(poly, pt) {
	var len = poly.length;
	for (var found = false, i = -1, j = len - 1; ++i < len; j = i) {
		((poly[i].latitude <= pt.latitude && pt.latitude < poly[j].latitude) || (poly[j].latitude <= pt.latitude && pt.latitude < poly[i].latitude)) && (pt.longitude < (poly[j].longitude - poly[i].longitude) * (pt.latitude - poly[i].latitude) / (poly[j].latitude - poly[i].latitude) + poly[i].longitude) && ( found = !found);
	}
	return found;
}


exports.isInCircle = function(_options) {
	var myposition = _options.myposition, radius = _options.radius, center = _options.center;
	var R = 6371000;
	var dLat = (center.lat - myposition)*Math.PI/180;
	var dLon = (center.lon- myposition.lon)*Math.PI/180;
	var lat1 = myposition.lat*Math.PI/180;
	var lat2 = center.lat.Math.PI/180;

	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return (radius>d) ? true : false;
}
