'use strict';

anxeb.vue.include.scope('profile', function (helpers, instance) {
	return {
		mounted : function () {
			var _self = this;

			_self.page.setup({
				title : 'Perfil de Usuario',
				icon  : 'fa-user'
			});

			_self.page.menu.add({
				caption : 'Mi Perfil',
				hint    : 'Mi Perfil',
				icon    : 'fa-user'
			}, [{
				caption : 'Actualizar',
				hint    : 'Mi Perfil / Actualizar',
				action  : function () {
					_self.modal('form-profile').form().then(function (user) {
						_self.session.setup(user);
						_self.log('Perfil actualizado correctamente').information();
					}).catch(function (err) {
						_self.log(err).exception();
					});
				}
			}]);
		},
		methods : {
			picture : function () {
				var _self = this;

				helpers.browse.image().then(function (image) {
					helpers.api.post('/profile/picture', { picture : image.data }).then(function () {
						helpers.root.profile.tick = Date.now();
						_self.log('Imagen de perfil actualizada correctamente').information();
					}).catch(function (err) {
						_self.log('Error cargando imagen').exception();
					});
				}).catch(function (err) {
					_self.log('Error cargando imagen').exception();
				});
			}
		},
		data    : function () {
			return {
				enums : {
					states : {
						active   : 'Activo',
						inactive : 'Inactivo'
					},
					roles  : {
						administrator : 'Adminsitrador',
						inactive      : 'Inactivo'
					},
					types  : {
						admin  : 'Representante Albará',
						tenant : 'Afiliado'
					}
				}
			};
		}
	}
});