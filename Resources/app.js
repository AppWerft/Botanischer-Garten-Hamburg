(function() {
	Ti.XML2JSON = require('ti.xml2json');
	Ti.include('/vendor/prototypes.js');
	var LokiModel = require('module/loki.model');
	Ti.App.LokiModel = new LokiModel();
//	Ti.App.botgartenModel.getAll();
	require('module/ui.tabgroup').create();
	
})();
