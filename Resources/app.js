(function() {
	Ti.XML2JSON = require('ti.xml2json');
	Ti.include('/vendor/prototypes.js');
	Ti.App.botgartenModel = require('module/botanicgarden.model');
	Ti.App.botgartenModel.getAll();
	require('module/ui.tabgroup').create();
	
})();
