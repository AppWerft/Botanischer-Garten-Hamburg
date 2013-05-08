var kml = require('vendor/kml');
describe('kml tests', function() {
	it('should display all areas', function() {
		var kmlstring = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom"><Document>	<name>Botanischer Garten Hamburg.kml</name>	<Folder>		<name>Botanischer Garten Hamburg</name>		<open>1</open>		<Placemark>			<name>Alpinum-Moor</name>			<styleUrl>#msn_ylw-pushpin</styleUrl>			<Polygon><tessellate>1</tessellate><outerBoundaryIs>	<LinearRing>		<coordinates>			9.859875458994578,53.56336771854064,0 9.859730721438318,53.56331028760234,0 9.859570016998603,53.56318350969446,0 9.859811140865256,53.56307247952857,0 9.859885351886323,53.56300041442461,0 9.860053477727593,53.5630629368252,0 9.860211846559361,53.56322234116389,0 9.860108233600549,53.56348008867586,0 9.859875458994578,53.56336771854064,0 		</coordinates>	</LinearRing></outerBoundaryIs>			</Polygon>		</Placemark>	</Folder></Document></kml>';
		var res = kml._parseKML(kmlstring);
		expect(res).toBeDefined();
	});
});
