'use strict';

anxeb.vue.include.component('form-tenant', function (helpers) {
	return {
		template : '/forms/tenant.vue',
		created  : function () {
			var _self = this;
			var modal = _self.$parent;
			var params = modal.component.params;
			var reject = modal.component.reject;
			var resolve = modal.component.resolve;

			var setup = function (title) {
				modal.setup({
					icon  : 'fa-user-circle',
					title : title,
					large : true
				}, [{
					text   : 'Guardar',
					action : function () {
						helpers.api.post('/tenants', { tenant : _self.model }).then(function (res) {
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
				helpers.api.get('/tenants/' + params).then(function (res) {
					_self.model = res.data;
					setup(res.data.name + ' (' + res.data.alias + ')');
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
				setup('Nuevo Afiliado');
			}
		},
		data     : function () {
			return {
				model : {
					name          : null,
					alias         : null,
					identity      : {
						type   : null,
						number : null
					},
					administrator : {
						first_name : null,
						last_name  : null,
						phone      : null,
						email      : null
					},
					location      : null,
					address       : null,
					state         : null
				},
				enums : {
					identity_types : {
						rnc      : 'RNC',
						id       : 'Cédula',
						passport : 'Pasaporte'
					},
				}
			};
		}
	}
});