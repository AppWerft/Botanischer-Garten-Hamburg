Array.prototype.in_array = function(needle) {
	for (var i = 0; i < this.length; i++)
		if (this[i] === needle)
			return true;
	return false;
}
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.striptags = function() {
	return this.replace(/(<.*?>)/g).replace(/undefined/g,' ');
}

String.prototype.entities2utf8 = function() {
	return this.replace(/undefined/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ');
}

