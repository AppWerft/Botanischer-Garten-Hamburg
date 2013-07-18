var Dichotom = function() {
	this.dblink = Ti.Database.install('/depot/dichotoms.sql', 'dichotoms');
	this.dichtom_id = null;
	this.tree_id = null;
	this.tree_metadata = null;
	return this;
}

Dichotom.prototype.importDichotom = function(_name) {
	var self = this;
	function html2utf8(foo) {
		return foo.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
	}

	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'depot/dichotome', _name + '.json');
	var data = JSON.parse(html2utf8(f.read().text));
	var dichotomid = data.metadata.title.replace(/ /, '_');
	this.dblink.execute('DELETE  FROM  dichotoms WHERE dichotomid="' + dichotomid + '"');
	this.dblink.execute('DELETE  FROM  decisiontrees WHERE dichotomid="' + dichotomid + '"');
	this.dblink.execute('DELETE  FROM  decisions WHERE dichotomid="' + dichotomid + '"');
	this.dblink.execute('INSERT INTO dichotoms (dichotomid,meta) VALUES (?,?)', dichotomid, JSON.stringify(data.metadata));
	for (var i = 0; i < data.content.length; i++) {
		if (data.content[i].type === 'decisiontree') {
			var treeid = data.content[i].id;
			this.dblink.execute('INSERT INTO decisiontrees (dichotomid,treeid,meta) VALUES (?,?,?)', dichotomid, treeid, JSON.stringify(data.content[i].metadata));
			for (var d = 0; d < data.content[i].decision.length; d++) {
				var decision = data.content[i].decision[d];
				this.dblink.execute('INSERT INTO decisions (dichotomid,treeid,decisionid,decision) VALUES (?,?,?,?)', dichotomid, treeid, decision.id, JSON.stringify(decision.alternative));
			}
		}
	}
	data = null;
}

Dichotom.prototype.getAll = function() {
	var resultset = this.dblink.execute('SELECT * FROM dichotoms');
	var list = [];
	while (resultset.isValidRow()) {

		list.push({
			id : resultset.fieldByName('dichotomid'),
			meta : JSON.parse(resultset.fieldByName('meta'))
		});
		resultset.next();
	}
	resultset.close();
	return list;
}

Dichotom.prototype.getDecisionById = function(_args) {
	console.log('===================================');
	console.log(_args);
	if (_args.dichotom_id) {
		this.dichotom_id = _args.dichotom_id;
	}
	if (!_args.next_id) {
		var q = 'SELECT treeid, meta FROM decisiontrees WHERE dichotomid = "' + this.dichotom_id + '" LIMIT 0,1';
		console.log(q);
		var resultset = this.dblink.execute(q);
		this.tree_id = resultset.fieldByName('treeid');
		console.log('no nex_id ===> id initial setting to start-treeId "' + this.tree_id + '"')
		resultset.close();
	} else {
		var regex = /_decisiontree/i;
		if (_args.next_id.match(regex)) {// new tre
			this.tree_id = _args.next_id + '_';
			console.log('next_id was  new treeId ' + this.tree_id)
			_args.next_id = undefined;
		} else {
			this.tree_id = _args.tree_id;
		}
	}
	console.log('TREE_ID: ' + this.tree_id);
	console.log(_args);
	var q = 'SELECT meta FROM decisiontrees WHERE dichotomid = "' + this.dichotom_id + '" AND treeid="' + this.tree_id + '"';
	var resultset = this.dblink.execute(q);
	if (resultset.isValidRow()) {
		var meta = JSON.parse(resultset.fieldByName('meta'));
		resultset.close();
	}
	var q = 'SELECT decision FROM decisions WHERE dichotomid = "' + this.dichotom_id + '" AND treeid="' + this.tree_id + '"';
	if (_args.next_id) {
		q += ' AND decisionid ="' + _args.next_id + '"';
	}
	q += ' LIMIT 0,1';
	console.log(q);
	var resultset = this.dblink.execute(q);
	if (resultset.isValidRow()) {
		var alternatives = JSON.parse(resultset.fieldByName('decision'));
		resultset.close();
		return {
			meta : meta,
			alternatives : alternatives,
			tree_id : this.tree_id
		}
	}

}
module.exports = Dichotom;
