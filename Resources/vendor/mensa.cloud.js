var Cloud = require('ti.cloud');
var mensa_userid, mensa_aclid, user_name = 'mu_' + Ti.Platform.id;
const USER = 'mensa_userid', PW = 'qwertz';
const TABLE = 'mensa';

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

function getPhoto(_item, _callback) {
	if (!_item.photo || !_item.photo.id)
		return;
	if (_item.photo_url)
		_callback(_item)
	else {// proccessed ?
		Cloud.Photos.show({
			photo_id : _item.photo.id
		}, function(_e) {
			if (_e.success && _e.photos) {
				_item.photo_url = _e.photos[0].urls;
				_callback(_item)
			} else {
				console.log('ERROR: ');
			}
		});
	}
}

/////////////////////////////////////////////////////////////////////////////////////////
/// Functional modules
exports.getDataByUserAndDish = function(_dish, _callback) {
	Cloud.Objects.query({
		classname : TABLE,
		where : {
			user_id : mensa_userid,
			dish : _dish
		}
	}, function(e) {
		if (e.success && e.meta.total_results) {
			console.log('===getDataByUserAndDish======');
			var item = e.mensa[0];
			if (!item.photo) {// without photo
				_callback(item)
			} else {
				getPhoto(item, _callback);
			};
		} else {
			console.log('===nothing found======');
			_callback(null);
		}
	});
}

exports.getDataByDishes = function(_dish, _callback) {
	Cloud.Objects.query({
		classname : TABLE,
		where : {
			dish : _dish
		}
	}, function(e) {
		if (e.success && e.meta.total_results) {
			for (var i = 0; i < e.mensa.length; i++) {
				getPhoto(e.mensa[i], function(_item) {
					_callback(_item.photo_url);
				});
			}

		} else {
			_callback(null);
		}
	});
}

exports.getVoting = function(_dish, _callback) {
	var bar = parseInt(Ti.Utils.md5HexDigest(_dish).replace(/[\D]+/g, '').substr(0, 3)) % 7;
	if (!bar)
		bar = 2;
	_callback(bar);
}


/* POSTING OF COMMENT AND PHOTO */
exports.postComment = function(_args) {
	function postPhoto(_args) {
		if (!_args.post.photo && _args.onsuccess && typeof (_args.onsuccess) == 'function') {
			_args.onsuccess(null);
			return;
		}
		console.log(_args.post.photo);
		console.log( typeof _args.post.photo);
		Cloud.Photos.create({
			photo : _args.post.photo,
			acl_id : mensa_aclid
		}, function(e) {
			Cloud.onsendstream = Cloud.ondatastream = null;
			console.log('===create Photo======');
			console.log(e);
			if (e.success) {
				if (_args.onsuccess && typeof (_args.onsuccess) == 'function')
					_args.onsuccess(e.photos[0]);
			} else {
				if (_args.onerror && typeof (_args.onerror) == 'function')
					_args.onerror(null);
			}
		});
	};
	// Code start:
	console.log('POSTING start');
	var post = _args.post, id = _args.id;
	postPhoto({
		post : post,
		onerror : function() {
		},
		onsuccess : function(_photo) {
			console.log('onsuccess in postPhoto');
			console.log(_photo);
			if (_photo != null)
				post.photo = _photo;
			post.user_id = mensa_userid;

			if (id == null) {
				Cloud.Objects.create({
					acl_id : mensa_aclid,
					classname : TABLE,
					fields : post
				}, function(e) {
					if (e.success) {
						if (_args.onsuccess && typeof (_args.onsuccess) == 'function')
							_args.onsuccess();
					} else {
						if (_args.onerror && typeof (_args.onerror) == 'function')
							_args.onerror();else console.log('no callback');
					}
				});
			} else {
				Cloud.Objects.update({
					classname : TABLE,
					id : id,
					fields : post
				}, function(_e) {
					if (_e.success) {
						if (_args.onsuccess && typeof (_args.onsuccess) == 'function')
							_args.onsuccess();
					} else {
						if (_args.onerror && typeof (_args.onerror) == 'function')
							_args.onerror();
					}
				});
			}
		}
	})
};
