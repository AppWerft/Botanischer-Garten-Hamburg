 $(document).ready(initialize);
  function initialize() {
  	var run =false;
    var map = new google.maps.Map(document.getElementById("map"),{
    		zoom: 17,
            center: new google.maps.LatLng(53.5622341,9.8613453),
    		   disableDefaultUI: true,
				zoomControl: true,
	   			zoomControlOptions: {
        			style: google.maps.ZoomControlStyle.SMALL
			    },
    		mapTypeId: google.maps.MapTypeId.HYBRID
      });
     var h = $(window).height();
	 $('#map').height(h);	
	 $('#map').width($(window).width());
	 var polygones = {};	
	var key;
	function createPolygone(_polygone,name){		  
		var points = [];
    	for (var i=0;i<_polygone.length;i++) {
    	  		points.push(new google.maps.LatLng(_polygone[i][0],_polygone[i][1]));
    	}
    	var poly = new google.maps.Polygon({map : map,
        	strokeColor   : '#ff0000',
            strokeOpacity : 0.6,
            strokeWeight  : 3,
            path:points,   
            map:map,
            title : name,
            run:false
        });
        google.maps.event.addListener(poly, 'click', function(_e){
        	if (poly.run ) {
        		poly.run=false;
        		poly.stopEdit();
        		if (!key) key  = window.prompt("Um die Fläche zu speichern brauchts den geheimen Schlüssel.");
        		var vertex = poly.getPath().getArray();
        		var points = [];
        		for (var i=0;i<vertex.length;i++) {
        			points.push([vertex[i].lat(),vertex[i].lng()]);
        		}
        		$.ajax({
        			success: function(){
        			},
        			url : 'api/',
        			dataType : 'json',
        			type : 'POST',
        			data : 'key='+ encodeURI(key) + '&name='+ poly.title + '&vertex='+ encodeURI(JSON.stringify(points))
        		});
        		$('#v_'+ poly.title.replace(/[^a-z]/g,'')).detach();
        	} else {;
	        	poly.runEdit();
	        	$('#display').append('<p id="v_'+poly.title.replace(/[^a-z]/g,'')+'">'+poly.title+'</p>');
	        	poly.run=true;
	        }
        });

        return poly;
	}
	$.getJSON('api/',function(_polygones){
	for (var name  in _polygones) {
		  polygones[name] = createPolygone(_polygones[name],name);
    }});
   
    
  }