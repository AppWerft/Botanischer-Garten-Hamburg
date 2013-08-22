//taken from http://www.frosties.com/index.php?option=com_mojo&Itemid=45&p=7
exports.toLatLon = function(_foo) {
	var x = _foo[0], y = _foo[1];
	if (Math.abs(x) < 180 && Math.abs(y) < 90)
		return;
	if ((Math.abs(x) > 20037508.3427892) || (Math.abs(y) > 20037508.3427892))
		return;
	var num3 = x / 6378137.0;
	var num4 = num3 * 57.295779513082323;
	var num5 = Math.floor(((num4 + 180.0) / 360.0));
	var num6 = num4 - (num5 * 360.0);
	var num7 = 1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * y) / 6378137.0)));
	return {
		latitude : num6,
		longitude : num7 * 57.295779513082323
	};
};

exports.toWGS84 = function(_foo) {
	var lat = _foo.lat || _foo.latitude;
	var lon = _foo.lon || _foo.lng || _foo.longitude;
	if ((lat < -90.0) || (lon > 90.0))
		return null;
	var a = lon * 0.017453292519943295;
	return [6378137.0 * lat * 0.017453292519943295, 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))];

}; 