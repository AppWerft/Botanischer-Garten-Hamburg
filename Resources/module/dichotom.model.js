var Dichotom = function() {
	this.dblink = Ti.Database.install('/depot/dichotom_skeleton.sql', 'dichotoms');
	this.dichtom_id = null;
	this.tree_id = null;
	this.tree_metadata = null;
	return this;
}

Dichotom.prototype.getAll = function(_args) {
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var dichotoms = Ti.App.XML2JSON.convert(xhr.responseText).MediawikiTemplateIndexer.Wiki.Page;
			_args.onload(dichotoms);
		}
	});
	xhr.open('GET', 'http://offene-naturfuehrer.de/w/index.php?title=Special:TemplateParameterExport&action=submit&do=export&template=MobileKey');
	xhr.send(null);
}

Dichotom.prototype.importDichotom = function(_args) {
	var self = this;
	_args.progress.show();
	var url = _args.dichotom['Exchange_4_URI'].text;
	try {
		var mtime = _args.dichotom['Creation_Time'].text;
	} catch(E) {
		var mtime = 0;
	}
	var dichotomid = Ti.Utils.md5HexDigest(_args.dichotom.Title.text);
	_args.row.dichotom_id = dichotomid;
	var dichotom_is_actual = false;
	var resultset = this.dblink.execute('SELECT mtime FROM dichotoms WHERE dichotomid=?', dichotomid);
	if (resultset.isValidRow())
		if (mtime == resultset.fieldByName('mtime'))
			dichotom_is_actual = true;
	resultset.close();
	if (dichotom_is_actual) {
		_args.progress.hide();
		_args.row.hasChild = true;
		return;
	}
	var xhr = Ti.Network.createHTTPClient({
		ondatastream : function(_e) {
			_args.progress.value = _e.progress;
		},
		onload : function() {
			var data = JSON.parse(xhr.responseText.striptags());
			self.dblink.execute('DELETE  FROM  dichotoms WHERE dichotomid="' + dichotomid + '"');
			self.dblink.execute('DELETE  FROM  decisiontrees WHERE dichotomid="' + dichotomid + '"');
			self.dblink.execute('DELETE  FROM  decisions WHERE dichotomid="' + dichotomid + '"');
			self.dblink.execute('INSERT INTO dichotoms (dichotomid,meta,mtime) VALUES (?,?,?)', dichotomid, JSON.stringify(data.metadata), mtime);
			for (var i = 0; i < data.content.length; i++) {
				if (data.content[i].type === 'decisiontree') {
					var treeid = data.content[i].id;
					self.dblink.execute('INSERT INTO decisiontrees (dichotomid,treeid,meta) VALUES (?,?,?)', dichotomid, treeid, JSON.stringify(data.content[i].metadata));
					for (var d = 0; d < data.content[i].decision.length; d++) {
						var decision = data.content[i].decision[d];
						if (decision.id)
							self.dblink.execute('INSERT INTO decisions (dichotomid,treeid,decisionid,decision) VALUES (?,?,?,?)', dichotomid, treeid, decision.id, JSON.stringify(decision.alternative));
						else
							console.log(decision);
					}
				}
			}
			_args.progress.hide();
			_args.row.hasChild = true;
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
	data = null;
}

Dichotom.prototype._getAll = function() {
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
	var resultset = this.dblink.execute(q);
	if (resultset.isValidRow()) {
		var alternatives = JSON.parse(resultset.fieldByName('decision'));
		resultset.close();
		return {
			meta : meta,
			alternatives : alternatives,
			tree_id : this.tree_id
		}
	} else {
		this.tree_id = _args.tree_id;
		var q = 'SELECT meta FROM decisiontrees WHERE dichotomid = "' + this.dichotom_id + '" AND treeid="' + this.tree_id + '"';
		var resultset = this.dblink.execute(q);
		if (resultset.isValidRow()) {
			var meta = JSON.parse(resultset.fieldByName('meta'));
			resultset.close();
		}
		var q = 'SELECT decision FROM decisions WHERE dichotomid = "' + this.dichotom_id + '" AND treeid="' + this.tree_id + '" LIMIT 0,1';
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

}
module.exports = Dichotom;
