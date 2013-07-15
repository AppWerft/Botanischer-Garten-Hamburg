(function() {
	Ti.XML2JSON = require('ti.xml2json');
	Ti.App.Carousel = require('com.obscure.ticarousel');
	Ti.include('/vendor/prototypes.js');
	
	var LokiModel = require('module/loki.model');
	Ti.App.LokiModel = new LokiModel();
	
	var IntkeyModel = require('module/intkey.model');
	Ti.App.IntkeyModel = new IntkeyModel();
	require('module/ui.tabgroup').create();

})();
