exports.create = function(_id) {
	var self = require('module/win').create('iDelta');
	

	self.carousel = Ti.App.Carousel.createCarouselView({
		top : 10,
		carouselType : Ti.App.Carousel.CAROUSEL_TYPE_CYLINDER,
		views : [],
		itemWidth : 280,
		numberOfVisibleItems : 12,
		wrap : true,
	});

	self.add(self.carousel);
	//self.add(require('module/intkey.character').create(intkey.characters[1]));

	self.addEventListener('close', function() {
		self.removeAllChildren();
		self = null;
	});
	var intkey = Ti.App.IntkeyModel.getKey(_id);
	self.title = intkey.title;
	var views = [];
	for (var i = 0; i < intkey.characters.length; i++) {
		views.push(require('intkey/intkey.character').create(intkey.characters[i]));
	}
	self.carousel.views = views;
	self.carousel.reloadData();
	return self;
}