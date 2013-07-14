exports.create = function() {
	Ti.UI.iPhone.hideStatusBar();
	Ti.UI.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	Ti.UI.backgroundImage = 'Default.png';
	var TabBar = require('me.izen.tabbar');
	var tabGroup = TabBar.createTabBar({
		tabBarColor : 'black',
		selectedImageTintColor : 'green',
		bottom : -50
	});
	tabGroup.open();
	var Map_Module = require('module/lokimap.window');
	var LokiMap = new Map_Module();
	console.log(LokiMap);
	console.log(LokiMap.createWindow());

	var mapTab = TabBar.createTab({
		icon : 'assets/signpost.png',
		title : 'Übersicht',
		window : LokiMap.createWindow()
	});
	tabGroup.addTab(mapTab);

	var taxoTab = TabBar.createTab({
		icon : 'assets/cabinet.png',
		title : 'Taxonomie',
		window : require('module/taxo.allfamilies.window').create('')
	});
	tabGroup.addTab(taxoTab);

	/*	var panoTab = TabBar.createTab({
	 icon : 'assets/panoramio.png',
	 title : 'Panoramio',
	 window : require('module/panoramio_map.window').create('')
	 });
	 tabGroup.addTab(panoTab);*/
	
	var deltaTab = TabBar.createTab({
		icon : 'assets/delta.png',
		title : 'iDelta',
		window : require('module/intkeyslist.window').create('')
	});
	tabGroup.addTab(deltaTab);
	var matrixTab = TabBar.createTab({
		icon : 'assets/flowericon.png',
		title : 'Taxomatrix',
		window : require('module/taxo.filter.window').create('')
	});
	tabGroup.addTab(matrixTab);
	var eventsTab = TabBar.createTab({
		icon : 'assets/calendar.png',
		title : 'Veranstaltungen',
		window : require('module/events.window').create('')
	});
	tabGroup.addTab(eventsTab);
	//tabGroup.setActiveTab(1);
	tabGroup.bottom = 0;
}
