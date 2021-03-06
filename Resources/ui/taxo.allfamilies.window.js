exports.create = function() {
	var self = require('ui/win').create('Übersicht');
	var rightButton = Ti.UI.createButton({
		width : 42,
		height : 36,
		borderRadius : 5,
		borderWidth : 1,
		backgroundImage : '/assets/flower.png'
	});
	rightButton.addEventListener('click', function() {
		self.tab.open(require('ui/taxo.filter.window').create());
	});
	self.rightNavButton = rightButton;
	var taxonomysections = [], searchresultsections = [], timer = undefined;
	var ordnungen = Ti.App.LokiModel.getFamilien();
	var template = {
		widthdetail : require('ui/TEMPLATES').activefamilyrow,
		widthoutdetail : require('ui/TEMPLATES').passivefamilyrow,
		searchresult : require('ui/TEMPLATES').plantrow,
	};
	self.listview_of_taxonomy = Ti.UI.createListView({
		top : 45,
		templates : {
			'widthdetail' : template.widthdetail,
			'widthoutdetail' : template.widthoutdetail,
			'searchresult' : template.searchresult
		},
		defaultItemTemplate : 'widthdetail'
	});
	for (var ordnung in ordnungen) {
		var familiensection_in_ordnung = [];
		for (var o = 0; o < ordnungen[ordnung].length; o++) {
			var children = ordnungen[ordnung][o].total;
			familiensection_in_ordnung.push({
				template : (children > 0) ? 'widthdetail' : 'widthoutdetail',
				title : {
					text : (ordnungen[ordnung][o].total) ? ordnungen[ordnung][o].name + ' (' + ordnungen[ordnung][o].total + ')' : ordnungen[ordnung][o].name
				},
				properties : {
					selectionStyle : Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
					allowsSelection : (children > 0) ? true : false,
					itemId : {
						familie : ordnungen[ordnung][o].name
					},
					accessoryType : (children > 0) ? Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE : Ti.UI.LIST_ACCESSORY_TYPE_NONE
				}
			});
		}
		taxonomysections.push(Ti.UI.createListSection({
			headerTitle : ordnung,
			items : familiensection_in_ordnung
		}));
	}
	self.listview_of_taxonomy.setSections(taxonomysections);
	// Maps the plai	nTemplate object to the 'plain' style name);
	var search = Ti.UI.createSearchBar({
		barColor : '#000',
		showCancel : true,
		showBookmark : false,
		top : 0,
		height : 50,
		hintText : 'Suche …'
	});
	self.add(search);
	self.dummy = Titanium.UI.createTableView({
		search : search,
		height : 50,
		top : -60,
		searchHidden : false,
	});
	self.add(self.dummy);
	search.addEventListener('focus', function(_e) {
		self.title = 'Suche';
		timer = setTimeout(function() {
			search.blur();
		}, 10000);
	});
	search.addEventListener('cancel', function(_e) {
		self.title = 'Taxonomy';
		self.listview_of_taxonomy.setSections(taxonomysections);
		search.blur();
	});
	search.addEventListener('change', function(_e) {
		if (_e.value.length === 0) {
			self.listview_of_taxonomy.setSections(taxonomysections);
			self.title = 'Taxonomy';
			if (timer)
				clearTimeout(timer);
			return;
		}
		if (timer)
			clearTimeout(timer);
		timer = setTimeout(function() {
			search.blur();
		}, 10000);
		var results = Ti.App.LokiModel.search({
			needle : _e.value,
			limit : [0, 500]
		});
		var resultsections = [];
		if (!results || !results.length)
			return;
		for (var i = 0; i < results.length; i++) {
			resultsections.push({
				template : 'searchresult',
				deutsch : {
					text : results[i].deutsch,
				},
				latein : {
					text : results[i].gattung + ' ' + results[i].art,
				},
				properties : {
					selectionStyle : Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
					allowsSelection : true,
					itemId : {
						searchresult : results[i]
					},
					accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
				}
			});
		}
		searchresultsections = Ti.UI.createListSection({
			items : resultsections
		});
		self.listview_of_taxonomy.setSections([searchresultsections]);

	});
	self.addEventListener('focus', function() {
		self.title = 'Taxonomie';
		self.listview_of_taxonomy.setSections(taxonomysections);
	});

	self.listview_of_taxonomy.addEventListener('itemclick', function(_e) {
		var item = _e.section.getItemAt(_e.itemIndex);
		if (item.properties.accessoryType === Ti.UI.LIST_ACCESSORY_TYPE_NONE)
			return;
		var detail = item.properties.itemId;
		if (detail.familie)
			self.tab.open(require('ui/taxo.gattungoffamily.window').create(detail.familie));
		if (detail.searchresult)
			self.tab.open(require('ui/detail.window').create(detail.searchresult));

	});

	self.add(self.listview_of_taxonomy);
	return self;
};
