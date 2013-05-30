var Cloud = require('ti.cloud');
var mensa_userid, mensa_aclid, user_name = 'mu_' + Ti.Platform.id;

var createUser = function(_args, _callback) {
	if (!Ti.App.Properties.hasProperty('mensa_userid')) {
		Cloud.Users.create({
			username : user_name,
			password : "qwertz",
			password_confirmation : "qwertz",
			first_name : "MensaUser",
			last_name : "MensaUser"
		}, function(e) {
			if (e.success) {
				mensa_userid = e.users[0].id;
				Ti.App.Properties.setString('mensa_userid', mensa_userid);
				console.log(mensa_userid);
				_callback(mensa_userid);
			} else {
				if (e.error && e.message) {
					console.log('Error :' + e.message);
				}
			}
		});
	} else {
		mensa_userid = Ti.App.Properties.getString('mensa_userid');
		_callback(mensa_userid);
	}
}
var loginUser = function(_args, _callback) {
	if (!Cloud.sessionId) {
		Cloud.Users.login({
			login : Ti.Platform.id,
			password : 'qwertz'
		}, function(e) {
			if (e.success) {
				_callback();
			}
		});
	} else
		_callback();
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

/// modules
exports.getVotingbyUser = function(_callback) {
	Cloud.Objects.query({
		classname : 'mensa',
	}, function(e) {
		if (e.success) {
			for (var i = 0; i < e.mensa.length; i++) {
				var mensa = e.mensa[i];
				_callback(mensa);
			}
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

exports.getVoting = function(_dish, _callback) {
	var bar = parseInt(Ti.Utils.md5HexDigest(_dish).replace(/[\D]+/g, '').substr(0, 3)) % 7;
	if (!bar)
		bar = 2;
	_callback(bar);
}

exports.postComment = function(_params) {
	Cloud.Users.login({
		login : Ti.Platform.id,
		password : 'qwertz',
	}, function(e) {
		if (e.success) {
			var acl = Cloud.ACLs.create({
				name : 'all_mensa_userid',
				public_read : true
			}, function(e) {
				if (e.success) {
					Cloud.Objects.create({
						acls : acl,
						classname : 'mensa',
						fields : _params
					}, function(e) {
						if (e.success) {
							alert('Kommmentar erfolgreich gespeichert.');
						} else {
							console.log(e);
						}
					});
				}
			});

		}
	});
};
