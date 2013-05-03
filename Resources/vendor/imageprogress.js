exports.get = function(_options) {
	var url = _options.url, view = _options.view;
	var pb = Ti.UI.createProgressBar({
		min : 0,
		max : 1,
		bottom : 5,
		height : 5,
		width : '100%'
	});
	pb.show();
	if (!view)
		var view = Ti.UI.createImageView();
	view.add(pb);
	var xhr = Ti.Network.createHTTPClient({
		timeout : 20000,
		ondatastream : function(_e) {
			pb.value = _e.progress
		},
		onload : function() {
			view.setImage(this.responseData);
			setTimeout(function() {
				view.remove(pb);
				pb = null;
			}, 1000);
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
	return view;
}
