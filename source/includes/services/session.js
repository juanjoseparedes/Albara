'use strict';

anxeb.vue.include.service('session', function (helpers) {
	var _self = this;
	_self.user = null;

	Object.defineProperty(_self, 'token', {
		get : function () {
			return localStorage.token;
		},
		set : function (value) {
			if (value) {
				localStorage.token = value;
			} else {
				delete localStorage.token;
			}
		}
	});

	_self.setup = function (user) {
		_self.user = user;
		if (_self.user) {
			Object.defineProperty(_self.user, "full_name", {
				get : function () {
					return this.first_name + ' ' + this.last_name
				}
			});

			for (var p in helpers.root.profile) {
				helpers.root.profile[p] = _self.user[p];
			}
		} else {
			_self.token = null;
			helpers.root.profile.tick = Date.now();
		}

		return _self.user;
	};

	axios.interceptors.request.use(function (request) {
		var token = _self.token;
		if (token) {
			request.headers['Authorization'] = 'Bearer ' + token;
		}
		return request;
	}, function (err) {
		return Promise.reject(err);
	});

	_self.refresh = function () {
		if (_self.token) {
			helpers.api.get('/profile').then(function (res) {
				_self.setup(res.data);
			}).catch(function (err) {
				_self.setup(null);
			});
		}
	};

	axios.interceptors.response.use(function (response) {
		return response;
	}, function (err) {
		return Promise.reject(err);
	});

	_self.login = function (params) {
		return new Promise(function (resolve, reject) {
			helpers.api.post('/auth', params).then(function (res) {
				_self.token = res.data.token;
				helpers.api.post('/session/login').then(function () {
					resolve(_self.setup(res.data.user));
				}).catch(reject);
			}).catch(reject);
		});
	};

	_self.logout = function () {
		return new Promise(function (resolve, reject) {
			helpers.api.post('/session/logout').then(function (res) {
				resolve(_self.setup(null));
			}).catch(reject);
		});
	};
});