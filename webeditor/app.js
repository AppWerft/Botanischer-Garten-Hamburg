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
	
	function createPolygone(_polygone){		  
		var points = [];
    	for (var i=0;i<_polygone.length;i++) {
    	  		points.push(new google.maps.LatLng(_polygone[i][0],_polygone[i][1]));
    	}
    	var poly = new google.maps.Polygon({map : map,
                                        strokeColor   : '#ff0000',
                                        strokeOpacity : 0.6,
                                        strokeWeight  : 3,
                                        path:points,
                                        map:map,run:false
        });
        google.maps.event.addListener(poly, 'click', function(_e){
        	if (poly.run ) {
        		poly.run=false;
        		poly.stopEdit();
        	} else {;
	        	poly.runEdit();
	        	poly.run=true;
	        }
        });

        return poly;
	}
	$.getJSON('api/',function(_polygones){
	for (var name  in _polygones) {
		  polygones[name] = createPolygone(_polygones[name]);
    }});
    $('#start').live('click',function(){ 
        if (run) {
        	for (var name in polygones) {
        		polygones[name].stopEdit(true);
    			run = false;
    		}	
    	} else {	
		    for (var name in polygones) {
        		polygones[name].runEdit(true);
    			run = false;
    		}	
   			run = true;
   			
    	}
    });
    
  }