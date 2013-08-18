(function() {
	Ti.App.Carousel = require('com.obscure.ticarousel');
	Ti.include('/vendor/prototypes.js');
//	var dichotom = require('model/dichotom.model');
//	Ti.App.Dichotom = new dichotom();
	var LokiModel = require('model/loki.model');
	Ti.App.LokiModel = new LokiModel();
	require('ui/tabgroup').create();

})();
