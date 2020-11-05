'use strict';

anxeb.vue.include.scope('login', function (helpers, instance) {
	return {
		methods : {
			login  : function () {
				var _self = this;

				_self.session.login({
					email    : _self.email,
					password : _self.password,
				}).then(function (user) {
					if (_self.email && _self.email.length && _self.remember) {
						helpers.storage.save('login', {
							email : _self.email
						})
					} else if (!_self.remember) {
						helpers.storage.save('login', {
							email : null
						})
					}
					_self.log('Bienvenido ' + user.first_name).information();
					setTimeout(function () {
						helpers.root.profile.tick = null;
						instance.navigate('home');
					}, 1500);
				}).catch(function (err) {
					_self.password = '';
					_self.log(err).exception();
				});
			},
			logout : function () {
				_self.session.logout().then(function () {

				}).catch(function (err) {
					_self.log(err).exception();
				});
			}
		},
		data    : function () {
			return {
				email    : null,
				password : null,
				remember : null
			}
		},
		created : function () {
			var loginStore = helpers.storage.fetch('login');
			if (loginStore) {
				this.remember = loginStore.email && loginStore.email.length;
				this.email = loginStore.email;
			}
		}
	}
});