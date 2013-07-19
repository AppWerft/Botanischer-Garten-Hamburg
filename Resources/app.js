(function() {
	Ti.App.XML2JSON = require('ti.xml2json');
	Ti.App.Carousel = require('com.obscure.ticarousel');
	Ti.include('/vendor/prototypes.js');
	var dichotom = require('module/dichotom.model');
	Ti.App.Dichotom = new dichotom();
	var LokiModel = require('module/loki.model');
	Ti.App.LokiModel = new LokiModel();
	require('module/ui.tabgroup').create();

})();
