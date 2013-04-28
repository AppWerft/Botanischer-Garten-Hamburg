exports.create = function() {
	Ti.UI.iPhone.hideStatusBar();
	Ti.UI.backgroundColor = 'white';
	var TabBar = require('me.izen.tabbar');
	var tabGroup = TabBar.createTabBar({
		tabBarColor : 'black',
		selectedImageTintColor : 'green'
	});
	var searchTab = TabBar.createTab({
		icon : 'assets/magnify.png',
		title : 'Suche',
		window : require('module/search.window').create('')
	});
	tabGroup.addTab(searchTab);
	var calTab = TabBar.createTab({
		icon : 'assets/calendar.png',
		title : 'Veranstaltungen',
		window : require('module/calendar.window').create('')
	});
	tabGroup.addTab(calTab);
	tabGroup.open();
}
