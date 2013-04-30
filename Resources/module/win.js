exports.create = function(_title, _back) {
	var self = Ti.UI.createWindow({
		title : _title,
		titleImage : 'assets/titlebg.png'
	});
	return self;
}
