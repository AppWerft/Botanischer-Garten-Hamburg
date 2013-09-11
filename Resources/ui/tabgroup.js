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
	var Map_Module = require('ui/lokimap.window');
	var LokiMap = new Map_Module();
	var mapTab = TabBar.createTab({
		icon : 'assets/signpost.png',
		title : 'Übersicht',
		window : LokiMap.createWindow()
	});
	tabGroup.addTab(mapTab);

	var taxoTab = TabBar.createTab({
		icon : 'assets/cabinet.png',
		title : 'Pflanzenliste',
		window : require('ui/taxo.allfamilies.window').create('')
	});
	tabGroup.addTab(taxoTab);
	/*var naturTab = TabBar.createTab({
		icon : 'assets/natur.png',
		title : 'Naturführer',
		window : require('ui/dichotom.list').create()
	});
	tabGroup.addTab(naturTab);*/
	/*	var panoTab = TabBar.createTab({
	 icon : 'assets/panoramio.png',
	 title : 'Panoramio',
	 window : require('ui/panoramio_map.window').create('')
	 });
	 tabGroup.addTab(panoTab);*/
	
	/*var deltaTab = TabBar.createTab({
		icon : 'assets/delta.png',
		title : 'iDelta',    
		window : require('intkey/main.window').create('')
	});
	tabGroup.addTab(deltaTab);
	*/
	var mensaTab = TabBar.createTab({
		icon : 'assets/fork-and-knife.png',
		title : 'Mensa',    
		window : require('ui/mensa.window').create('')
	});
	tabGroup.addTab(mensaTab);
	var matrixTab = TabBar.createTab({
		icon : 'assets/flowericon.png',
		title : 'Familienfilter',
		window : require('ui/taxo.filter.window').create('')
	});
	//tabGroup.addTab(matrixTab);
	var eventsTab = TabBar.createTab({
		icon : 'assets/calendar.png',
		title : 'Veranstaltungen',
		window : require('ui/events.window').create('')
	});
	tabGroup.addTab(eventsTab);
	//tabGroup.setActiveTab(1);
	tabGroup.bottom = 0;
};
