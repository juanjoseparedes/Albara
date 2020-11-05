'use strict';

anxeb.vue.include.scope('tenants/providers/detail', function (helpers, instance) {
	return {
		created  : function () {
			var _self = this;
			_self.refresh();
		},
		methods  : {
			refresh(msg) {
				var _self = this;

				_self.page.busy();
				helpers.api.get('/tenants/' + _self.$route.params.tenantId).then(function (res) {
					_self.tenant = res.data;
					if (_self.$refs.logo) {
						_self.$refs.logo.reset();
					}

					if (_self.isNew) {
						_self.institutions = [];
						_self.page.setup({
							title  : 'Nuevo Proveedor para ' + _self.tenant.name,
							icon   : 'fa-arrow-left',
							action : function () {
								_self.close();
							}
						});
						_self.page.idle();
					} else {

						helpers.api.get('/providers/' + _self.$route.params.providerId).then(function (res) {
							_self.setupProvider(res.data);

							_self.page.setup({
								title  : _self.tenant.name + ' / ' + _self.provider.name,
								icon   : 'fa-arrow-left',
								action : function () {
									_self.close();
								}
							});

							_self.page.menu.add({
								caption : 'Refrescar',
								hint    : 'Refrescar Detalle',
								icon    : 'fa-tags',
								action  : function () {
									_self.refresh(true);
								}
							});

							if (msg === true) {
								_self.log('Proveedor recargado correctamente').information();
							} else {
								_self.page.idle();
							}
						}).catch(function (err) {
							_self.$root.log(err).exception();
						});
					}
				}).catch(function (err) {
					_self.log(err).exception();
				});
			},
			saveAndBack         : function () {
				var _self = this;
				_self.save(function () {
					_self.log('Proveedor actualizado correctamente').information();
					_self.close(true);
				});
			},
			save                : function (callback) {
				var _self = this;
				if (_self.tenant != null) {
					helpers.api.post('/providers', {
						provider : helpers.tools.data.copy(_self.provider, {
							tenant       : _self.tenant.id,
							institutions : _self.institutions.map(function (item) {
								return item.id
							})
						})
					}).then(function (res) {
						if (_self.isNew) {
							_self.setupProvider(res.data);
							helpers.root.navigate('/tenants/' + _self.tenant.id + '/providers/' + _self.provider.id + '/detail');
						}
						if (callback) {
							callback(res.data);
						} else {
							_self.log('Proveedor actualizado correctamente').information();
						}
					}).catch(function (err) {
						helpers.tools.highlight(err, {
							prefix : 'provider'
						});
					});
				}
			},
			close               : function (force) {
				var _self = this;
				if (!_self.$route.params.providerId && !force) {
					_self.$parent.modal('¿Está seguro que quiere desestimar este proveedor?').confirm(function () {
						helpers.root.navigate('/tenants/' + _self.$route.params.tenantId + '/detail/providers');
					});
				} else {
					helpers.root.navigate('/tenants/' + _self.$route.params.tenantId + '/detail/providers');
				}
			},
			setupProvider       : function (data) {
				var _self = this;
				_self.provider = data;
				_self.provider.images = {};
				_self.provider.institutions = _self.provider.institutions || [];
				_self.provider.institutions = _self.provider.institutions.map(function (item) {
					return typeof item === 'string' ? item : item.id
				});
				_self.refreshInstitutions();
			},
			refreshInstitutions : function (msg, callback) {
				var _self = this;

				if (_self.provider.institutions && _self.provider.institutions.length > 0) {
					helpers.api.get('/institutions', {
						params : {
							ids : _self.provider.institutions || []
						}
					}).then(function (res) {
						_self.institutions = res.data;

						if (msg === true) {
							_self.log('Centros recargados correctamente').information();
						} else {
							_self.page.idle();
						}
						if (callback) {
							callback();
						}
					}).catch(function (err) {
						_self.$root.log(err).exception();
					});
				} else {
					_self.institutions = [];
					if (callback) {
						callback();
					}
				}
			},
			flashSave           : function (callback) {
				var _self = this;
				_self.refreshInstitutions(false, function () {
					if (!_self.isNew) {
						_self.save(callback);
					} else {
						callback();
					}
				});
			},
			removeInstitution   : function (institution) {
				var _self = this;

				_self.modal({ title : 'Centros Asociados', message : '¿Está seguro que quiere desasociar este centro?' }).confirm(function () {
					_self.provider.institutions = _self.provider.institutions.filter(function (institutionId) {
						return institutionId !== institution.id;
					});

					_self.flashSave(function () {
						_self.$parent.log('Centro desasociado correctamente').information();
					});
				});
			},
			addInstitution      : function () {
				var _self = this;
				if (_self.provider != null) {
					_self.$parent.modal('lookup-institution').form({ invalidate : _self.provider.institutions }).then(function (institutionId) {
						_self.provider.institutions = _self.provider.institutions || [];
						_self.provider.institutions.push(institutionId);
						_self.flashSave(function () {
							_self.$parent.log('Centro asociado correctamente').information();
						});
					}).catch(function () {});
				}
			},
		},
		computed : {
			isNew : function () {
				return this.$route.params.providerId === undefined;
			}
		},
		data     : function () {
			return {
				enums        : {
					identity_types : {
						rnc      : 'RNC',
						id       : 'Cédula',
						passport : 'Pasaporte'
					},
					types          : {
						primary   : 'Primaria',
						secundary : 'Secundaria',
						mixed     : 'Mixta',
						other     : 'Otra',
					},
					states         : {
						active   : 'Activo',
						inactive : 'Inactivo'
					}
				},
				categories   : null,
				institutions : null,
				tenant       : null,
				provider     : {
					name          : null,
					identity      : {
						type   : null,
						number : null
					},
					code          : null,
					phone         : null,
					email         : null,
					administrator : {
						first_name : null,
						last_name  : null,
						phone      : null,
						email      : null,
					},
					location      : null,
					address       : null,
					categories    : null,
					institutions  : null,
					tenant        : null,
					images        : {
						logo : null
					}
				}
			};
		}
	}
});