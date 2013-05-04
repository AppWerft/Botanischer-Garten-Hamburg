Ti.include('/libs/suds.lib.js');

exports.login = function(_params, _callback) {
	var portals = require('modules/login/portals').values;
	function tryLogin(_params, self) {
		var soap = new SudsClient({
			endpoint : 'http://www.commsy.uni-hamburg.de/soap.php',
			targetNamespace : 'http://www.commsy.uni-hamburg.de/soap_wsdl.php'
		});
		soap.invoke('authenticate', _params, function(_res) {
			var results = _res.xml.documentElement.getElementsByTagName('return');
			if (results && results.length > 0) {
				self.sessionid = results.item(0).textContent;
				var soap = new SudsClient({
					endpoint : 'http://www.commsy.uni-hamburg.de/soap.php',
					targetNamespace : 'http://www.commsy.uni-hamburg.de/soap_wsdl.php',
				});
				soap.invoke('getUserInfo', {
					session_id : self.sessionid,
					context_id : _params.portal_id
				}, function(_res) {
					var results = _res.xml.documentElement.getElementsByTagName('return');
					if (results && results.length > 0) {
						var r = results.item(0).textContent;
						portals[_params.portal_id].id = _params.portal_id;
						var user = {
							firstname : /<firstname><!\[CDATA\[(.*?)\]\]>/gm.exec(r)[1],
							lastname : /<lastname><!\[CDATA\[(.*?)\]\]>/gm.exec(r)[1],
							email : /<email><!\[CDATA\[(.*?)\]\]>/gm.exec(r)[1],
							lastlogin : /<lastlogin><!\[CDATA\[(.*?)\]\]>/gm.exec(r)[1],
							portal : portals[_params.portal_id]
						};
						if ( typeof _callback === 'function') {
							_callback(user);
						};

					}
				});

			} else {
				console.log('ERROR: ' + _params.portal_id)
			}
		});

	}
	var self = this;
	for (var cid in portals) {
		tryLogin({
			user_id : _params.user_id,
			password : _params.password,
			portal_id : cid
		}, self);
	}}