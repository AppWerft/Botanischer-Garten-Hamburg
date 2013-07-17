var Dichotom = function(_name) {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'depot', _name + '.json');
	this.tree = JSON.parse(f.read().text);
	var key = this.tree.metadata.page_context_id.split('_');
	key.pop();
	this.id = key.join('_') ; 
	return this;
}
Dichotom.prototype.getId = function() {
	return this.id
};
Dichotom.prototype.getDecisionByCode = function(_args) {
	var code = _args.code || 1;
	var id = _args.id + '_';
	for (var i = 0; i < this.tree.content.length; i++) {
		if (this.tree.content[i].type == 'decisiontree' &&  this.tree.content[i].id== id) {
			var decisions = this.tree.content[i].decision;
			for ( c = 0; c < decisions.length; c++) {
				if (decisions[c].code == code || code == '*') {
					return {
						alternatives : decisions[c].alternative,
						meta : this.tree.content[i].metadata
					};
				}
			}
		}
	}
	return null;
}
module.exports = Dichotom;
