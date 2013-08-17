exports.create = function(_args) {
	var self = Ti.UI.createView({
		top : -40,
		height : 40
	});
	self.add(Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.6
	}));
	var slider = Titanium.UI.createSlider({
		min : 0,
		max : 1,
		width : '90%',
		value : 0.1
	});
	self.add(slider);
	slider.addEventListener('change', function(e) {
		_args.onchange(e.value);
	});
	slider.addEventListener('stop', function(e) {
		_args.onstop(e.value);
	});
	return self;
};
