'use strict';

anxeb.vue.include.component('form-user', function (helpers) {
	return {
		template : '/forms/user.vue',
		created  : function () {
			var _self = this;
			var modal = _self.$parent;
			var params = modal.component.params;
			var reject = modal.component.reject;
			var resolve = modal.component.resolve;

			var setup = function (title) {
				modal.setup({
					icon  : 'fa-user',
					title : title
				}, [{
					text   : 'Guardar',
					action : function () {
						helpers.api.post('/users', { user : _self.model }).then(function (res) {
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
			};


			if (typeof params === 'string') {
				helpers.api.get('/users/' + params).then(function (res) {
					_self.model = res.data;
					setup(res.data.first_name + ' ' + res.data.last_name);
				}).catch(function () {});
			} else {
				if (params) {
					if (params.tenant) {
						this.model.tenant = params.tenant || null;
						this.model.type = 'tenant';
					} else {
						this.model.tenant = null;
						this.model.type = params.type || null;
					}
				}
				setup('Nuevo Usuario');
			}
		},
		data     : function () {
			return {
				model : {
					first_name : null,
					last_name  : null,
					email      : null,
					password   : null,
					role       : null,
					state      : null,
					type       : null,
					tenant     : null
				}
			};
		}
	}
});