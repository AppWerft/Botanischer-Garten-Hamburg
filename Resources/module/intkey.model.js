var Intkey = function() {
	return this;
}

Intkey.prototype.getList = function() {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'depot', 'intkeys.json');
	var list = JSON.parse(f.read().text);
	return list;
}
Intkey.prototype.getKey = function(_id) {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'intkeys', _id + '.json');
	if (f.exists()) {
		var text = f.read().text;
		var key = JSON.parse(text);
		return key;
	}
	return [];
}
module.exports = Intkey;
