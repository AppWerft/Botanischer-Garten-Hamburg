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
		window : require('module/taxo.allfamilies.window').create('')
	});
	var uhhTab = TabBar.createTab({
		icon : 'assets/uhh.png',
		title : 'Intern',
		window : require('module/uhh.window').create('')
	});
	var Mapwin = require('module/pickermap.window');
	var pickerTab = TabBar.createTab({
		icon : 'assets/signpost.png',
		title : 'Übersicht',
		window : new Mapwin()
	});
	var calTab = TabBar.createTab({
		icon : 'assets/calendar.png',
		title : 'Veranstaltungen',
		window : require('module/calendar.window').create('')
	});
	var mapTab = TabBar.createTab({
		icon : 'assets/panoramio.png',
		title : 'Panoramio',
		window : require('module/panoramio.window').create('')
	});
	tabGroup.addTab(pickerTab);
	tabGroup.addTab(taxoTab);
	tabGroup.addTab(calTab);
	tabGroup.addTab(mapTab);
	tabGroup.addTab(uhhTab);
	tabGroup.open();
}
