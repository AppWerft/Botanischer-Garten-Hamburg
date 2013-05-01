exports.create = function(_title, _back) {
	var self = Ti.UI.createWindow({
		title : _title,
		barColor : 'black',
		titleImage : 'assets/titlebg.png'
	});
	self.addEventListener('swipe', function(_e) {
		if (_e.direction == 'right')
			win.close({
				animated : true
			});
	});
	return self;
}
