var Cloud = require('ti.cloud');
var mensa_userid, mensa_aclid, user_name = 'mu_' + Ti.Platform.id;
const USER = 'mensa_userid', PW = 'qwertz';

var createUser = function(_args, _callback) {
	if (!Ti.App.Properties.hasProperty(USER)) {
		Cloud.Users.create({
			username : user_name,
			password : PW,
			password_confirmation : PW,
			first_name : "MensaUser",
			last_name : "MensaUser"
		}, function(e) {
			if (e.success) {
				mensa_userid = e.users[0].id;
				Ti.App.Properties.setString(USER, mensa_userid);
				_callback(mensa_userid);
			} else {
				if (e.error && e.message) {
					console.log('Error :' + e.message);
				}
			}
		});
	} else {
		mensa_userid = Ti.App.Properties.getString(USER);
		_callback(mensa_userid);
	}
}
var loginUser = function(_args, _callback) {
	if (!Cloud.sessionId) {
		Cloud.Users.login({
			login : user_name,
			password : PW
		}, function(e) {
			if (e.success) {
				console.log('Login with ' + user_name + ' successful ;-))');
				_callback();
			} else
				console.log('ERROR: Login with ' + user_name + ' unsuccessful');
		});
	} else {
		console.log('SessionId exists');
		_callback();
	}
}
var createACL = function(_args, _callback) {
	if (!Ti.App.Properties.hasProperty('acl_id')) {
		Cloud.ACLs.create({
			name : 'acl_' + user_name,
			public_read : true
		}, function(e) {
			if (!e.error)
				Ti.App.Properties.setString('acl_id', e.acls[0].id)
		});
	}
}
///  START :
createUser({}, function() {
	loginUser({}, function() {
		createACL({}, function() {
		})
	})
});
//// End of Cloud initialisation

/////////////////////////////////////////////////////////////////////////////////////////
/// Functional modules
exports.getDataByUserAndDish = function(_dish, _callback) {
	Cloud.Objects.query({
		classname : 'mensa',
		where : {
			user_id : mensa_userid,
			dish : _dish
		}
	}, function(e) {
		if (e.success) {
			console.log('===getDataByUserAndDish======');
			console.log(e);
			_callback((e.meta.total_results) ? e.mensa[0] : null);
		} else
			_callback(null);
	});
}
exports.getVoting4Dish = function(_dish, _callback) {
	Cloud.Objects.query({
		classname : 'mensa',
		where : {
			dish : _dish
		}
	}, function(e) {
		console.log(e);
		if (e.success) {
			for (var i = 0; i < e.mensa.length; i++) {
				var mensa = e.mensa[i];
				_callback(mensa);
			}
		} else {
			//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}
exports.getVoting = function(_dish, _callback) {
	var bar = parseInt(Ti.Utils.md5HexDigest(_dish).replace(/[\D]+/g, '').substr(0, 3)) % 7;
	if (!bar)
		bar = 2;
	_callback(bar);
}

exports.postComment = function(_params, _callback) {
	_params.user_id = mensa_userid;
	Cloud.Objects.create({
		acl_id : mensa_aclid,
		classname : 'mensa',
		fields : _params
	}, function(e) {
		if (e.success) {
			alert('Kommmentar erfolgreich gespeichert.');
		} else {
			console.log(e);
		}
		_callback();
	});
};
