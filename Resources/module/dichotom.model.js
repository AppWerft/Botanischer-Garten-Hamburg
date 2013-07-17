var Dichotom = function(_name) {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'depot', _name + '.json');
	this.tree = JSON.parse(f.read().text);
	var key = this.tree.metadata.page_context_id.split('_');
	key.pop();
	this.treeId = key.join('_') + '_decisiontree';
	return this;
}

Dichotom.prototype.getDecisionById = function(_id) {
	if (!_id) {
		console.log('id initial setting to start-treeId "' + this.treeId + '"')
		_id = this.treeId;
	}
	var regex = /_decisiontree/i;
	if (_id.match(regex)) {// new tre
		console.log('Id was new treeId "' + _id + '"')
		this.treeId = _id + '_';
		// persist
		_id = undefined;
		// id is invalid, we take the first decision of tree
	} else {
		console.log('we leave in tree: ' + this.treeId);
	}
	// Findig  tree:
	for (var i = 0; i < this.tree.content.length; i++) {
		if (this.tree.content[i].type == 'decisiontree' && (this.tree.content[i].id == this.treeId || this.tree.content[i].id == this.treeId + '_')) {
			var decisions = this.tree.content[i].decision;
			var meta = this.tree.content[i].metadata;
			// Finding  decision
			if (_id != undefined) {
				console.log('==> Looking for "' + _id + '"');
				for ( c = 0; c < decisions.length; c++) {
					if (decisions[c].id == _id) {
						return {
							alternatives : decisions[c].alternative,
							meta : meta
						};
					}
				}
			} else {
				console.log('==> Looking for first entry of new tree "' + this.treeId + '"');
				return {
					alternatives : decisions[0].alternative,
					meta : meta
				};
			}
		}
	}
	return null;

}
module.exports = Dichotom;
