exports.create = function() {
	var self = require('module/win').create('Übersicht');
	var taxonomysections = [], searchresultsections = [], timer = undefined;
	var ordnungen = require('module/model').getFamilien();
	var template = {
		widthdetail : require('module/TEMPLATES').activefamilyrow,
		widthoutdetail : require('module/TEMPLATES').passivefamilyrow,
		searchresult : require('module/TEMPLATES').plantrow,
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
		var results = require('module/model').search({
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
			self.tab.open(require('module/taxo.gattungoffamily.window').create(detail.familie));
		if (detail.searchresult)
			self.tab.open(require('module/detail.window').create(detail.searchresult));

	});

	self.add(self.listview_of_taxonomy);
	return self;
}
