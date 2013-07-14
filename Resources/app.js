(function() {
	
	for (var i = 300; i <400; i++) {
		require('module/intkey.model').getKeys(i);	
	}
	
	Ti.XML2JSON = require('ti.xml2json');
	Ti.include('/vendor/prototypes.js');
	var LokiModel = require('module/loki.model');
	Ti.App.LokiModel = new LokiModel();
//	Ti.App.botgartenModel.getAll();
	require('module/ui.tabgroup').create();
	
})();
