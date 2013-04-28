exports.create = function() {
	var self = Ti.UI.createWindow({
		navBarHidden : true
	});

	self.tv = Ti.UI.createTableView({
		top : 50,
		height : Ti.UI.FILL
	});
	return self;
}
