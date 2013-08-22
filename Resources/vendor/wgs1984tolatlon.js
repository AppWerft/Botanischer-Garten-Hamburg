//taken from http://www.frosties.com/index.php?option=com_mojo&Itemid=45&p=7

exports.toLatLon = function(foo) {
	var x = foo[0], y = foo[1];
	if (Math.abs(x) < 180 && Math.abs(y) < 90)
		return;
	if ((Math.abs(x) > 20037508.3427892) || (Math.abs(y) > 20037508.3427892))
		return;
	var num3 = x / 6378137.0;
	var num4 = num3 * 57.295779513082323;
	var num5 = Math.floor(((num4 + 180.0) / 360.0));
	var num6 = num4 - (num5 * 360.0);
	var num7 = 1.5707963267948966 - (2.0 * Math.atan(Math.Exp((-1.0 * y) / 6378137.0)));
	return {
		latitude : num6,
		longitude : num7 * 57.295779513082323
	};
};
exports.toWGS84 = function(foo) {
	
};