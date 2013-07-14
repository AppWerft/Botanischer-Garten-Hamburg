exports.getKeys = function(id) {
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			console.log(this.responseText);
			if (this.responseText && this.responseText.length > 20) {
				var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, id + '.json');
				f.write(this.responseText);
			}
		}
	});
	xhr.open('GET', 'http://www.pathkey.org/php/data.php?datasetId=' + id);
	xhr.send();
}
