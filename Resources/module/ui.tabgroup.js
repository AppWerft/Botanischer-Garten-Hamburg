exports.create = function() {
	Ti.UI.iPhone.hideStatusBar();
	Ti.UI.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	Ti.UI.backgroundImage = '/assets/bg.png';
	var TabBar = require('me.izen.tabbar');
	var tabGroup = TabBar.createTabBar({
		tabBarColor : 'black',
		selectedImageTintColor : 'green'
	});
	
	var Maptab = require('module/pickermap.window');
	var mapTab = TabBar.createTab({
		icon : 'assets/signpost.png',
		title : 'Übersicht',
		window : new Maptab()
	});
	tabGroup.addTab(mapTab);
	
	

	var taxoTab = TabBar.createTab({
		icon : 'assets/cabinet.png',
		title : 'Taxonomie',
		window : require('module/taxo.allfamilies.window').create('')
	});
	tabGroup.addTab(taxoTab);

	
	var calTab = TabBar.createTab({
		icon : 'assets/calendar.png',
		title : 'Veranstaltungen',
		window : require('module/calendar.window').create('')
	});
	tabGroup.addTab(calTab);

	var panoTab = TabBar.createTab({
		icon : 'assets/panoramio.png',
		title : 'Panoramio',
		window : require('module/panoramio_map.window').create('')
	});
	tabGroup.addTab(panoTab);
	var uhhTab = TabBar.createTab({
		icon : 'assets/uhh.png',
		title : 'Intern',
		window : require('module/uhh.window').create('')
	});
	tabGroup.addTab(uhhTab);
	//tabGroup.setActiveTab(1);
	tabGroup.open();

}
