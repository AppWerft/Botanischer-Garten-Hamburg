var w = Ti.Platform.displayCaps.platformWidth;

exports.moveUp = Ti.UI.createAnimation({
	transform : Ti.UI.create2DMatrix().translate(0, -100),
	duration : 800
});
exports.moveCenter = Ti.UI.createAnimation({
	transform : Ti.UI.create2DMatrix().translate(0,0),
	duration : 200
});

exports.shake = function(_view, _finishCallback) {
	var shakes = [], TOTAL = 11, LENGTH = 10;
	for (var i = 0; i < TOTAL; i++) {
		var x = ((i % 2) * 2 - 1 ) * LENGTH;
		shakes[i] = Ti.UI.createAnimation({
			transform : Ti.UI.create2DMatrix().translate(x, 0),
			duration : 80,
			curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
	}
	shakes[TOTAL] = Ti.UI.createAnimation({
			transform : Ti.UI.create2DMatrix().translate(0, 0),
			duration : 100,
			curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
	function shaker(animationCount) {
		if (animationCount === TOTAL+1) {
			shakes = null;
			if (_finishCallback && typeof (_finishCallback) === 'function')
				_finishCallback();
			return;
		}
		_view.animate(shakes[animationCount]);
		shakes[animationCount].addEventListener('complete', function() {
			animationCount++;
			shaker(animationCount)
		});
	}
	shaker(0);
};
