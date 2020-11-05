'use strict';

anxeb.vue.include.component('form-profile', function (helpers) {
	return {
		template : '/forms/profile.vue',
		created  : function () {
			var _self = this;
			var modal = _self.$parent;
			var reject = modal.component.reject;
			var resolve = modal.component.resolve;

			this.model.email = modal.$parent.session.user.email;

			modal.setup({
				icon  : 'fa-lock',
				title : 'Perfil de Usuario'
			}, [{
				text   : 'Actualizar',
				action : function () {
					helpers.api.post('/profile', { user : _self.model }).then(function (res) {
						modal.close();
						resolve(res.data);
					}).catch(function (err) {
						modal.exception(err);
					});
				}
			}, {
				text   : 'Cancelar',
				close  : true,
				action : function () {
					if (reject) {
						reject()
					}
				}
			}]);
			modal.loaded = true;
		},
		data     : function () {
			return {
				model : {
					email        : null,
					password     : null,
					password_new : null,
					password_rep : null,
				}
			};
		}
	}
});