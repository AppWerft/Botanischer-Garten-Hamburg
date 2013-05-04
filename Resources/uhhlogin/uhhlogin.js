exports.tryall = function(_user, _callback) {
	this.campusnet(_user, _callback);
	this.uhhaccount(_user, _callback);
	//this.aix(_user, _callback);
}
exports.campusnet = function(_user, _callback) {
	var doResponse = function() {
		if (this.getResponseHeader('refresh')) {
			var xhr = Ti.Network.createHTTPClient();
			xhr.onload = doResponse;
			xhr.open("GET", HOST + this.getResponseHeader('refresh').split('URL=')[1]);
			xhr.send();
		} else {
			var regex = /<h1>Herzlich Willkommen,[\s]+(.*?)!<\/h1>/mi;
			if (regex.test(this.responseText)) {
				var name = regex.exec(this.responseText)[1];
				_callback({
					success : true,
					type : 'campusnet',
					title : name + '@STiNE',
					name : name
				});
			} 
		}
	}
	var postvalues = {
		APPNAME : 'CampusNet',
		ARGUMENTS : 'clino,usrname,pass,menuno',
		PRGNAME : 'LOGINCHECK',
		clino : '<!$MG_SESSIONNO>',
		menuno : '<!$MG_MENUID>',
		usrname : _user.split(':')[0],
		pass : _user.split(':')[1]
	};
	var HOST = 'https://www.stine.uni-hamburg.de';
	var xhr_getcookie = Ti.Network.createHTTPClient();
	xhr_getcookie.onload = function() {
		var xhr_postcredentials = Ti.Network.createHTTPClient({
			onload : doResponse
		});
		xhr_postcredentials.open("POST", HOST + '/scripts/mgrqispi.dll');
		xhr_postcredentials.send(postvalues);
	}
	xhr_getcookie.open("GET", HOST + '/');
	xhr_getcookie.send();
};

exports.uhhaccount = function(_user, _callback) {
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			if (this.status === 200) {
				_callback({
					success : true,
					type : 'uhhaccount',
					title : _user.split(':')[0] + '@NetStorage',
					name : _user.split(':')[0]
				});
			}
		},
		onerror : function() {
		},
		username : _user.split(':')[0],
		password : _user.split(':')[1],
	});
	xhr.open("GET", 'https://uhhdisk.nds.uni-hamburg.de/oneNet/NetStorage');
	xhr.send(null);
}
/////////////////////////////////////////////////////////////////////////////
exports.aix = function(_user, _callback) {
	var HOST = 'https://user.rrz.uni-hamburg.de';
	var xhr_post = Ti.Network.createHTTPClient({
		onload : function() {
			var elems = this.responseText.match(/<input (.*?)\/>/gim);
			var nameregex = /name="(.*?)"/i, valueregex = /value="(.*?)"/i;
			var data = {
				PWAKT : _user.split(':')[0],
				PWKENN : _user.split(':')[1]
			};
			for (var i = 0; i < elems.length; i++) {
				var key = nameregex.exec(elems[i])[1];
				if (!data[key])
					data[key] = valueregex.exec(elems[i])[1];
			}
			var xhr = Ti.Network.createHTTPClient({
				onload : function() {
					var elems = this.responseText.match(/<input (.*?)\/>/gim);
					console.log(elems);
					// //cgi-bin/kenninf
					/*AIXSYS	AIXNIS
					 PWCHECK	9141914
					 PWCHECK	jwlRdFvloEM
					 PWCHECK	VJYojcWBsJ.
					 PWCHECK	/8vB7nVftxo
					 PWCHECK	.CqfJh.XRSQ
					 PWKENN	f6sv005
					 VOR_trans	k-i
					 end_button	Weiter*/
				}
			});
			xhr.open("POST", HOST + "/cgi-bin/eleaut/autcheck");
			xhr.send(data);
		},
		onerror : function() {
			console.log(this.error);
		}
	});
	xhr_post.open("POST", HOST + "/cgi-bin/eleaut/autcheck");
	xhr_post.setRequestHeader("Referer", HOST + "/fileadmin/benutzung_rrz/kenninf.html");
	xhr_post.send({
		RetSkript : '/cgi-bin/kenninf',
		VOR_trans : 'k-i'
	});

}
exports.shibboleth = function(_user, _callback) {
	var HOST = 'https://uhh-srv-olatweb.rrz.uni-hamburg.de';
	var xhr_getcookie = Ti.Network.createHTTPClient({
		onload : function() {
			var xhr_postselectuni = Ti.Network.createHTTPClient({
				autoRedirect : false,
				onload : function() {
					var url = this.getResponseHeader('Location');
					console.log(url);
					console.log(this.status)
				},
				onerror : function() {
					console.log(this.error);
				}
			});
			xhr_postselectuni.open("POST", HOST + "/olat/dmz/1%3A2%3A1001847566%3A1%3A0/");
			xhr_postselectuni.setRequestHeader("Referer", HOST + "/olat/dmz/");
			xhr_postselectuni.setRequestHeader("Host", 'uhh-srv-olatweb.rrz.uni-hamburg.de');
			xhr_postselectuni.setRequestHeader("User-Agent", 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:18.0) Gecko/20100101 Firefox/18.0');
			xhr_postselectuni.send({
				wayf_homesites : 'https://shib.stine.uni-hamburg.de/idp/shibboleth/',
				olat_fosm_0 : 'Zum Login'
			});
		}
	});
	xhr_getcookie.open("GET", HOST + "/olat/dmz/");
	xhr_getcookie.setRequestHeader("User-Agent", "Lecture2GoMobile 1.0");
	xhr_getcookie.send();
};
