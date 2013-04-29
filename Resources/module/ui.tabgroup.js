exports.create = function() {
	Ti.UI.iPhone.hideStatusBar();
	Ti.UI.backgroundImage = '/assets/bg.png';
	var TabBar = require('me.izen.tabbar');
	var tabGroup = TabBar.createTabBar({
		tabBarColor : 'black',
		selectedImageTintColor : 'green'
	});
	var taxoTab = TabBar.createTab({
		icon : 'assets/cabinet.png',
		title : 'Taxonomie',
		window : require('module/taxo.window').create('')
	});
	var searchTab = TabBar.createTab({
		icon : 'assets/magnify.png',
		title : 'Suche',
		window : require('module/search.window').create('')
	});

	var calTab = TabBar.createTab({
		icon : 'assets/calendar.png',
		title : 'Veranstaltungen',
		window : require('module/calendar.window').create('')
	});
	var mapTab = TabBar.createTab({
		icon : 'assets/radar.png',
		title : 'Plan',
		window : require('module/map.window').create('')
	});
	tabGroup.addTab(taxoTab);
	tabGroup.addTab(searchTab);
	tabGroup.addTab(calTab);
	tabGroup.addTab(mapTab);
	tabGroup.open();
}
