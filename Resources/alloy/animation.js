/**
 * @class Alloy.builtins.animation
 * A collection of useful animation utilities. To use the animation builtin library,
 * all you need to do is require it with the `alloy` root directory in your
 * `require` call. For example:
 *
 * var animation = require('alloy/animation');
 * animation.crossFade(view1, view2, 500, finishCallback);
 */

/**
 * @method crossFade
 * Transitions from one view to another using a cross-fade animation.
 * @param {Titanium.UI.View} from View to fade out.
 * @param {Titanium.UI.View} to View to fade in.
 * @param {Number} duration Fade duration in milliseconds.
 * @param {function()} [finishCallback] Callback function, invoked after the fade completes.
 */
exports.crossFade = function(from, to, duration, finishCallback) {
	if (from)
		from.animate({
			opacity : 0,
			duration : duration
		});
	if (to)
		to.animate({
			opacity : 1,
			duration : duration
		});
	if (finishCallback)
		setTimeout(finishCallback, duration + 300);
};

/**
 * @method fadeAndRemove
 * Fades out a view then removes it from its parent view.
 * @param {Titanium.UI.View} from View to remove.
 * @param {Number} duration Fade duration in milliseconds.
 * @param {Titanium.UI.View} container Parent container view.
 * @param {function()} [finishCallback] Callback function, invoked after the fadeAndRemove completes.
 */
exports.fadeAndRemove = function(from, duration, container, finishCallback) {
	if (from && container) {
		from.animate({
			opacity : 0,
			duration : duration
		}, function() {
			container.remove(from);
			container = from = duration = null;
			if (finishCallback)
				finishCallback();
		});
	}
};

/**
 * @method fadeIn
 * Fades in the specified view.
 * @param {Titanium.UI.View} to View to fade in.
 * @param {Number} duration Fade duration in milliseconds.
 * @param {function()} [finishCallback] Callback function, invoked after the fadeIn completes.
 */
exports.fadeIn = function(to, duration, finishCallback) {
	if (to) {
		to.animate({
			opacity : 1,
			duration : duration
		}, function() {
			if (finishCallback) {
				finishCallback();
			}
		});
	}
};

/**
 * @method fadeOut
 * Fades out the specified view.
 * @param {Titanium.UI.View} to View to fade out.
 * @param {Number} duration Fade duration in milliseconds.
 * @param {function()} [finishCallback] Callback function, invoked after the fadeOut completes.
 */
exports.fadeOut = function(to, duration, finishCallback) {
	if (to) {
		to.animate({
			opacity : 0,
			duration : duration
		}, function() {
			if (finishCallback) {
				finishCallback();
			}
		});
	}
};

/**
 * @method popIn
 * Makes the specified view appear using a "pop-in" animation, which combines a fade-in
 * with a slight expanding and contracting animation, to call attention to the new view.
 * @param {Titanium.UI.View} view View to animate.
 * @param {function()} [finishCallback] Callback function, invoked after the popIn completes.
 */
exports.popIn = function(view, finishCallback) {
	if (Ti.Platform.name != 'iPhone OS') {
		view.transform = Ti.UI.create2DMatrix();
		view.opacity = 1;
		return;
	}

	var animate1 = Ti.UI.createAnimation({
		opacity : 1,
		transform : Ti.UI.create2DMatrix().scale(1.05, 1.05),
		duration : 200
	});
	var animate2 = Ti.UI.createAnimation({
		transform : Ti.UI.create2DMatrix(),
		duration : 300
	});

	exports.chainAnimate(view, [animate1, animate2], finishCallback);
	view = null;
};

/**
 * @method shake
 * Creates a shake animation, moving the target view back and forth rapidly several times.
 *
 * @param {Titanium.UI.View} view View to animate.
 * @param {Number} [delay] If specified, animation starts after `delay` milliseconds.
 * @param {function()} [finishCallback] Callback function, invoked after the shake completes.
 */

/**
 * @method flash
 * Flashes the target view twice, fading to partially transparent then back to
 * fully-opaque.
 *
 * @param {Titanium.UI.View} view View to animate.
 * @param {Number} [delay] If specified, animation starts after `delay` milliseconds.
 * @param {function()} [finishCallback] Callback function, invoked after the flash completes.
 */
exports.flash = function(view, delay, finishCallback) {
	var flash1 = Ti.UI.createAnimation({
		opacity : 0.7,
		duration : 100
	});
	var flash2 = Ti.UI.createAnimation({
		opacity : 1,
		duration : 100
	});
	var flash3 = Ti.UI.createAnimation({
		opacity : 0.7,
		duration : 100
	});
	var flash4 = Ti.UI.createAnimation({
		opacity : 1,
		duration : 100
	});
	if (delay) {
		setTimeout(function() {
			exports.chainAnimate(view, [flash1, flash2, flash3, flash4], finishCallback);
			view = flash1 = flash2 = flash3 = flash4 = null;
		}, delay);
	} else {
		exports.chainAnimate(view, [flash1, flash2, flash3, flash4], finishCallback);
	}
};

/**
 * @method chainAnimate
 * Executes a series of animations on the target view.
 *
 * @param {Titanium.UI.View} view View to animate.
 * @param {Titanium.UI.Animation[]} animations A set of animations to execute on `view` in sequence.
 * @param {function()} [finishCallback] Callback to invoke once the chain animation is complete.
 */
exports.shake = function(view, delay, finishCallback) {
	var shakes = [],TOTAL = 5,LENGTH =10;
	for (var i = 0; i < TOTAL; i++) {
		var dir = (i%2)*2-1;
		if (i===TOTAL-1) LENGTH = LENGTH/2;
		shakes[i] = Ti.UI.createAnimation({
			transform : Ti.UI.create2DMatrix().translate(dir*LENGTH, 0),
			duration : 100
		});
	}
	shakes[TOTAL] =  Ti.UI.createAnimation({
			transform : Ti.UI.create2DMatrix().translate(-5, 0),
			duration : 500,
			curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
	});
	if (delay) {
		setTimeout(function() {
			exports.chainAnimate(view, shakes, finishCallback);
			view =  null;
			shakes = null;
		}, delay);
	} else {
		exports.chainAnimate(view, shakes, finishCallback);
	}
};


exports.chainAnimate = function(_view, _animations, _finishCallback) {
	function step() {
		if (_animations.length == 0) {
			_view = _animations = null;
			if (_finishCallback)
				_finishCallback();
			return;
		}
		var self = _animations.shift();
		console.log(self);
		console.log(_animations.length);
		_view.animate(self);
		self.addEventListener('complete', step);
	}
	step();
};

