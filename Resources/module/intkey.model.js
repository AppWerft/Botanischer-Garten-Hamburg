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
		if (key.characters) {
			for (var i = 0; i < key.characters.length; i++) {
				var character = key.characters[i];
				if (character.name == undefined)
					continue;
				try {
					console.log(character.name.split(': '));
					character.title = character.name.split(': ')[0].capitalize();
					character.subtitle = character.name.split(': ')[1].capitalize();
				} catch(E) {
					character.title = character.name.capitalize();
					character.subtitle = ' ';
				}
			}
			return key;
		}

	}
	return []
}
module.exports = Intkey;
