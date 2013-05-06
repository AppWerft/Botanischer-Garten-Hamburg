exports.create = function(_options, _callback) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var resetProgress = function() {
		clearInterval(cron);
		progressBar.hide();
		okBtn.show();
		progressBar.value = 0;
		cancelBtn.show();
	}
	var animations = require('uhhlogin/animations');
	var cron = null;
	var dialog = Ti.UI.createView({
		borderColor : '#eceded',
		borderWidth : 2,
		borderRadius : 10,
		width : 272,visible:false,
		height : 200,
		backgroundImage : '/uhhlogin/alert-bg.png'
	});
	var cancelBtn = Ti.UI.createButton({
		backgroundImage : '/uhhlogin/btn-inactive.png',
		width : 127,
		height : 43,
		title : 'Abbruch',
		bottom : 5,
		left : 5,
		borderRadius : 5,
		font : {
			fontWeight : 'bold'
		}
	});
	dialog.add(cancelBtn);
	dialog.add(Ti.UI.createLabel({
		color : '#fff',
		top : 15,
		width : 260,
		height : Ti.UI.SIZE,
		textAlign : 'center',
		font : {
			fontSize : 20
		},
		text : 'UHH-Identität'
	}));
	dialog.add(Ti.UI.createLabel({
		color : '#fff',
		top : 50,
		width : 260,
		height : Ti.UI.SIZE,
		textAlign : 'center',
		font : {
			fontSize : 12
		},
		text : 'STiNE oder RRZ-Benutzerkennung'
	}));
	var progressBar = Ti.UI.createProgressBar({
		bottom : 20,
		height : 20,
		min : 0,
		max : 10,
		value : 1,
		width : '95%'
	});
	dialog.add(progressBar);
	var passwordField = Ti.UI.createTextField({
		width : 260,
		height : 28,
		bottom : 60,
		backgroundColor : '#fff',
		hintText : 'Passwort',
		font : {
			fontSize : 16
		},
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		enableReturnKey : true,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_BEZEL,
		passwordMask : true
	});
	dialog.add(passwordField);
	var loginField = Ti.UI.createTextField({
		width : 260,
		height : 28,
		bottom : 100,
		backgroundColor : '#fff',
		hintText : 'User-ID',
		font : {
			fontSize : 16
		},
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		autocapitalization : Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect : false,
		enableReturnKey : true,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_BEZEL
	});
	dialog.add(loginField);
	loginField.addEventListener('focus', function() {
		dialog.animate(animations.moveUp);
	});
	passwordField.addEventListener('focus', function() {
		dialog.animate(animations.moveUp);
	});
	loginField.addEventListener('blur', function() {
		dialog.animate(animations.moveCenter);
	});
	passwordField.addEventListener('blur', function() {
		dialog.animate(animations.moveCenter);
	});
	var okBtn = Ti.UI.createButton({
		backgroundImage : '/uhhlogin/btn-active.png',
		width : 127,
		height : 43,
		bottom : 5,
		right : 5,
		borderRadius : 5,
		font : {
			fontWeight : 'bold'
		},
		title : 'OK'
	});
	dialog.add(okBtn);
	okBtn.addEventListener('click', function() {
		passwordField.blur();
		loginField.value = loginField.value.replace('@uni-hamburg.de', '');
		loginField.blur();
		cancelBtn.hide();
		okBtn.hide();
		progressBar.show();
		require('uhhlogin/uhhlogin').tryall(loginField.value + ':' + passwordField.value, function(_user) {
			if (_user === null) {
				console.log('Wrong credentials');
			} else {
				resetProgress();
				dialog.close();
				if (_callback)
					_callback(_user);
			}
		});
		cron = setInterval(function() {
			progressBar.value = progressBar.value + 0.1;
			if (progressBar.value > 10) {
				require('uhhlogin/animations').shake(dialog, function() {
					resetProgress();
				});
			}
		}, 50);
	});
	cancelBtn.addEventListener('click', function() {
		dialog.hide();
	});
	dialog.addEventListener('focus', function() {
		dialog.animate(animations.moveCenter);
		require('alloy/animation').popIn(dialog);
	});
	return dialog;
};
