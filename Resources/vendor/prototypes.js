Array.prototype.in_array = function(needle) {
	for (var i = 0; i < this.length; i++)
		if (this[i] === needle)
			return true;
	return false;
}
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}