'use strict';

anxeb.vue.include.scope('tenants/detail/users', function (helpers, instance) {
	return {
		mounted  : function () {
		},
		created  : function () {
		},
		methods  : {
			createAdministrator : function () {
				var _self = this;
				_self.$parent.save(function (tenant) {
					_self.modal({
						title   : 'Administración',
						message : 'Ingresar Contraseña para ' + _self.$parent.tenant.administrator.first_name,
						prompt  : { labe : 'Contraseña', rows : 1 }
					}).confirm(function (button, modal) {
						helpers.api.post('/users', {
							user : {
								first_name  : tenant.administrator.first_name,
								last_name   : tenant.administrator.last_name,
								email       : tenant.administrator.email,
								password    : modal.value,
								role        : 'administrator',
								state       : 'active',
								type        : 'tenant',
								preferences : {},
								tenant      : tenant.id
							}
						}).then(function (res) {
							_self.log('Usuario administrador incluido correctamente').information();
							_self.$refs.users.refresh();
						}).catch(function (err) {
							modal.exception(err);
						});
					});
				});
			}
		},
		computed : {},
		data     : function () {
			return {};
		}
	}
});