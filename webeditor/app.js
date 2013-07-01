$(document).ready(initialize);
function initialize() {
	var run = false;
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom : 17,
		center : new google.maps.LatLng(53.5605, 9.8613),
		disableDefaultUI : true,
		zoomControl : true,
		zoomControlOptions : {
			style : google.maps.ZoomControlStyle.SMALL
		},
		mapTypeId : google.maps.MapTypeId.HYBRID
	});
	var h = $(window).height();
	$('#map').height(h);
	$('#map').width($(window).width());
	var polygones = {};
	var key;
	function createPolygone(_polygone, name) {
		var points = [];
		for (var i = 0; i < _polygone.length; i++) {
			points.push(new google.maps.LatLng(_polygone[i][0], _polygone[i][1]));
		}
		var poly = new google.maps.Polygon({
			map : map,
			strokeColor : '#ff0000',
			strokeOpacity : 0.6,
			strokeWeight : 3,
			path : points,
			map : map,
			title : name,
			run : false,
			modified : false
		});
		google.maps.event.addListener(poly, 'click', function(_e) {
			console.log('M=' + poly.modified + '  R=' + poly.run + '   K=' + key);
			var id = 'v_' + poly.title.replace(/[^a-z]/g, '');
			if (!poly.modified && poly.run) {
				poly.run = false;
				poly.stopEdit();
				$('#' + id).detach();
				return;
			}
			if (poly.run) {
				poly.run = false;
				var ok = false;
				poly.stopEdit();
				if (!key) {
					key = window.prompt("Um die Fläche zu speichern brauchts den geheimen Schlüssel.");
				} else {
					ok = window.confirm("Neue Kurve abspeichern?");
				}
				var vertex = poly.getPath().getArray();
				var points = [];
				for (var i = 0; i < vertex.length; i++) {
					points.push([vertex[i].lat(), vertex[i].lng()]);
				}
				$('#' + id + ' img').show();
				$.ajax({
					success : function() {
						poly.modified = false;
						$('#' + id).detach();
					},
					url : 'api/',
					dataType : 'json',
					type : 'POST',
					data : 'key=' + encodeURI(key) + '&name=' + poly.title + '&vertex=' + encodeURI(JSON.stringify(points))
				});
			} else {;
				poly.runEdit();
				$('#display').append('<p id="' + id + '"><img style="display:none" src="css/ajax-loader.gif" /> ' + poly.title + '</p>');
				poly.run = true;
			}
		});
		return poly;
	}


	$.getJSON('api/', function(_polygones) {
		for (var name in _polygones) {
			polygones[name] = createPolygone(_polygones[name], name);
		}
	});
	$('#newpolygone').bind('click', function() {
		var newtitle = window.prompt('Geben Sie den Namen der Fläche ein. Dann können Sie den Startpunkt auf der Karte wählen.');
		if (!newtitle)
			return;
		var myListener = google.maps.event.addListener(map, 'click', function(_e) {
			var marker = new google.maps.Marker({
				position : _e.latLng,
				map : map
			});
			var lat = marker.getPosition().lat();
			var lng = marker.getPosition().lng();
			marker.setMap(null);
			marker = null;
			google.maps.event.removeListener(myListener);
			var delta = 0.0002;
			createPolygone([[lat + delta, lng - delta], [lat + delta, lng + delta], [lat - delta, lng + delta], [lat - delta, lng - delta]], newtitle)
		});
	});
}