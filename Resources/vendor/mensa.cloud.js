var Cloud = require('ti.cloud');
var mensa_user, mensa_acl;
if (!Ti.App.Properties.hasProperty('mensa_user')) {
	Cloud.Users.create({
		username : Ti.Platform.id,
		password : "qwertz",
		password_confirmation : "qwertz",
		first_name : "MensaUser",
		last_name : "MensaUser"
	}, function(e) {
		if (e.success) {
			mensa_user = e.users[0].id;
			Ti.App.Properties.setString('mensa_user', mensa_user);
			console.log(mensa_user);
		} else {
			if (e.error && e.message) {
				console.log('Error :' + e.message);
			}
		}
	});
} else {
	mensa_user = Ti.App.Properties.getString('mensa_user');
}


function initSession(_args) {
	if (!Cloud.sessionId) {
		Cloud.Users.login({
			login : Ti.Platform.id,
			password : 'qwertz'
		}, function(e) {
			getACL();
			/*
			 if (e.success) {
			 _args.success({
			 user : e.users[0]
			 });
			 } else {
			 _args.error({
			 error : e.error
			 });
			 }*/
		});
	} else
		getACL();
}

function getACL() {
	var acl = Cloud.ACLs.create({
		name : 'all_mensa_user_' + Ti.Platform.id,
		public_read : true
	}, function(e) {
		console.log(e);
	});
}

initSession();








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
				name : 'all_mensa_user',
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
