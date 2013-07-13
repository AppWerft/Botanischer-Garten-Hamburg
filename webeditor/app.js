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
			var id = 'v_' + poly.title.replace(/[^a-z]/g, '');
			/*if (!poly.modified && poly.run) {
				poly.run = false;
				poly.setEditable (false);
				$('#' + id).detach();
				return;
			}*/
			if (poly.run) {
				poly.run = false;
				var ok = false;
				poly.setEditable (false);	
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
						console.log('SUCCRSS');
						$('#' + id).detach();
					},
					url : 'api/',
					dataType : 'json',
					type : 'POST',
					data : 'key=' + encodeURI(key) + '&name=' + poly.title + '&vertex=' + encodeURI(JSON.stringify(points))
				});setTimeout(function(){$('#' + id).detach();},3000);
			} else {;
				poly.setEditable (true);	
				$('#display').append('<p id="' + id + '"><img style="display:none" src="css/ajax-loader.gif" />' + poly.title + '</p>');
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
			return;console.log(newtitle);
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
	var PDF_Overlay = new google.maps.GroundOverlay(
    	"http://lab.min.uni-hamburg.de/botanischergarten/gartenplan.png",
    new google.maps.LatLngBounds(
    	new google.maps.LatLng(53.5587, 9.8567),
    	new google.maps.LatLng(53.5655, 9.8641)),
    	{opacity:0.5,map:map,clickable:false}
    );
	PDF_Overlay.setMap(map); 
	
	$("#overlayslider").slider({
			min:0,max:1,
			value:0.5,
			step: 0.01,
			slide :function(event,ui){
				PDF_Overlay.setOpacity(ui.value);
				if (ui.value==0) {
					PDF_Overlay.setMap(null)
				} else PDF_Overlay.setMap(map);
			}
	});
	$("#polygoneslider").slider({
			min:0,max:1,
			value:0.5,
			step:0.01,
			change :function(event,ui){console.log(ui.value);
				for (var name in polygones) {console.log(polygones[name]);
					polygones[name].setOptions({fillOpacity:0.6*ui.value,strokeOpacity:0.5*ui.value});
				}	
			}
	});
}