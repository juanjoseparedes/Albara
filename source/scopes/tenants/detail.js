'use strict';

anxeb.vue.include.scope('tenants/detail', function (helpers, instance) {
	return {
		mounted  : function () {
		},
		created  : function () {
			var _self = this;
			_self.refresh();
		},
		methods  : {
			close       : function (tenant) {
				helpers.root.navigate('/tenants/list');
			},
			saveAndBack : function () {
				var _self = this;
				_self.save(function () {
					_self.close();
				});
			},
			save        : function (callback) {
				var _self = this;

				helpers.api.post('/tenants', {
					tenant : helpers.tools.data.copy(_self.tenant)
				}).then(function (res) {
					if (callback) {
						callback(res.data);
					}
					_self.log('Afiliado actualizado correctamente').information();
				}).catch(function (err) {
					helpers.tools.highlight(err, {
						prefix : 'tenant'
					});
				});
			},
			inactivate  : function () {
				var _self = this;
				_self.modal({
					message : '¿Está seguro que quiere desactivar este afiliado?',
					prompt  : 'Indicar las razones'
				}).confirm(function (button, modal) {
					helpers.api.post('/tenants/' + _self.$route.params.tenantId + '/inactivate', {
						notes : modal.value
					}).then(function (res) {
						_self.log('Afiliado desactivado').information();
						_self.close(res.data);
					}).catch(function (err) {
						helpers.tools.highlight(err, {
							prefix : 'tenant'
						});
					});
				});
			},
			activate    : function () {
				var _self = this;
				_self.modal({
						message : '¿Está seguro que quiere activar este afiliado?',
						prompt  : 'Indicar criterio de activación'
					}
				).confirm(function (button, modal) {
					helpers.api.post('/tenants/' + _self.$route.params.tenantId + '/activate', {
						notes : modal.value
					}).then(function (res) {
						_self.log('Afiliado activado').information();
						_self.close(res.data);
					}).catch(function (err) {
						helpers.tools.highlight(err, {
							prefix : 'tenant'
						});
					});
				});
			},
			refresh(msg) {
				var _self = this;

				_self.page.busy();
				helpers.api.get('/tenants/' + _self.$route.params.tenantId).then(function (res) {
					_self.tenant = res.data;

					_self.page.idle();

					_self.page.setup({
						title   : 'Afiliado ' + _self.tenant.name + ' (' + _self.tenant.alias + ')',
						caption : 'Detalle Afiliado',
						icon    : 'fa-arrow-left',
						action  : function () {
							_self.close();
						}
					});

					_self.page.menu.add({
						caption : 'Refrescar',
						hint    : 'Refrescar',
						icon    : 'fa-sync',
						action  : function () {
							_self.refresh(true);
						}
					});

					if (msg === true) {
						_self.log('Afiliado recargado correctamente').information();
					} else {
						_self.page.idle();
					}
				}).catch(function (err) {
					_self.log(err).exception();
				});
			}
		},
		computed : {
			isNew : function () {
				return this.$route.params.providerId === undefined;
			}
		},
		data     : function () {
			return {
				tenant : null,
				enums  : {
					identity_types : {
						rnc      : 'RNC',
						id       : 'Cédula',
						passport : 'Pasaporte'
					},
					states         : {
						new      : 'Nuevo',
						active   : 'Activo',
						inactive : 'Inactivo'
					},
				}
			};
		}
	}
});