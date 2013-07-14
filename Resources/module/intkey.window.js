exports.create = function(_id) {
	var self = require('module/win').create('iDelta');
	self.scrollableview = Ti.UI.createScrollableView();
	var intkey = Ti.App.IntkeyModel.getKey(_id);
	self.title = intkey.title;
	var views = [];
	for (var i = 0; i < intkey.characters.length; i++) {
		views.push(require('module/intkey.character').create(intkey.characters[i]));
	}
	self.scrollableview.setViews(views);
	self.add(self.scrollableview);

	return self;
}