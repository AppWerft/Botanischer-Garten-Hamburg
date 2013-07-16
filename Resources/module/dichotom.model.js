var Dichton = function(_name) {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'depot', _name + '.json');
	this.tree = JSON.parse(f.read().text);
	this.id = this.tree.metadata.page_context_id;
	return this;
}
Dichton.prototype.getMeta = function() {
	return this.tree.metadata
};
Dichton.prototype.getDecisiontree = function(_id) {
	var id = (_id == undefined) ? this.id : _id
	for (var i = 0; i < this.tree.content.length; i++) {
		if (this.tree.content[i].type == 'decisiontree' && this.tree.content[i].metadata.page_context_id == id)
			return this.tree.content[i];
	}
	return null;
}
module.exports = Dichton;
