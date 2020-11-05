'use strict';

anxeb.vue.include.helper('api', function () {
	var api = axios.create({
		baseURL : '/api'
	});

	api.interceptors.response.use(function (response) {
		return response;
	}, function (err) {
		anxeb.vue.root.page.idle();
		return Promise.reject(err);
	});

	api.interceptors.request.use(function (request) {
		var token = localStorage.token;
		if (token) {
			request.headers['Authorization'] = 'Bearer ' + token;
		}
		return request;
	}, function (err) {
		anxeb.vue.root.page.idle();
		return Promise.reject(err);
	});

	var call = function (method, url, params) {
		return new Promise(function (resolve, reject) {
			api[method](url, params).then(function (res) {
				resolve(res);
			}).catch(function (err) {
				err = err.response && err.response.data && err.response.data.message ? err.response.data : err;
				if (params && params.mute !== true) {
					anxeb.vue.root.log(err).exception();
				}
				if (reject) {
					reject(err);
				}
			});
		});
	};

	return {
		interceptors : api.interceptors,
		axios        : api,
		get          : function (url, params) {
			return call('get', url, params);
		},
		post         : function (url, params) {
			return call('post', url, params);
		},
		delete       : function (url, params) {
			return call('delete', url, params);
		},
		put          : function (url, params) {
			return call('put', url, params);
		}
	};
});