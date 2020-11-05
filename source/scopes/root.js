'use strict';

anxeb.vue.include.root({
	name    : 'root',
	created : function () {
		var _self = this;

		_self.$router.beforeEach(function (to, from, next) {
			next();
		});

		_self.$router.beforeResolve(function (to, from, next) {
			next();
		});

		_self.$router.afterEach(function (to, from) {

		});

		$(window).resize(function () {
			_self.screen.height = $(window).height();
			_self.screen.width = $(window).width();
		});
		_self.screen.height = $(window).height();
		_self.screen.width = $(window).width();
	},
	mounted : function () {
		this.refreshTheme();
		this.session.refresh();

		anxeb.vue.helpers.api.interceptors.request.use(function (request) {

			return request;
		}, function (err) {
			return Promise.reject(err);
		});
	},
	methods : {
		onScopeCreated : function (component) {

		},
		onError        : function (err) {
			this.log(err).exception();
		},
		refreshTheme   : function () {
			for (var key in this.settings.theme.colors) {
				var color = this.settings.theme.colors[key];
				if (typeof color !== 'string') {
					continue;
				}

				document.documentElement.style.setProperty('--app-' + key + '-lighter', chroma(color).brighten(2.0).alpha(0.28).hex());
				document.documentElement.style.setProperty('--app-' + key + '-medium', chroma(color).brighten(1.8).alpha(0.5).hex());
				document.documentElement.style.setProperty('--app-' + key + '-soft', chroma(color).brighten(1.4).alpha(0.9).hex());
				document.documentElement.style.setProperty('--app-' + key + '-color', color);
				document.documentElement.style.setProperty('--app-' + key + '-dark', chroma(color).darken(0.5).hex());
				document.documentElement.style.setProperty('--app-' + key + '-darker', chroma(color).darken(1.2).hex());
			}
		},
		navigate       : function (path, query, params) {
			if (params || query) {
				this.$router.push({ path : path, params : params, query : query });
			} else {
				this.$router.push(path);
			}
		}
	},
	data    : {
		screen   : {
			width  : null,
			height : null
		},
		flags    : {
			busy : false
		},
		app      : {
			name    : 'Albará',
			version : '0.0.1'
		},
		profile  : {
			tick       : Date.now(),
			id         : null,
			first_name : null,
			last_name  : null,
			full_name  : null,
			email      : null,
			role       : null,
			type       : null,
			state      : null,
			tenant     : null
		},
		settings : {
			theme : {
				colors : {
					foreground  : '#ffffff',
					secundary   : '#ffb950',
					watermark   : '#bfbcc2',
					background  : '#4b9b3a',
					active      : '#fff49d',
					information : '#6887ff',
					success     : '#6cc788',
					warning     : '#f75e6e'
				}
			}
		}
	}
});