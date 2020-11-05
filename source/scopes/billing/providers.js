'use strict';

anxeb.vue.include.scope('billing/providers', function (helpers, instance) {
	return {
		mounted : function () {
			var _self = this;


			if (helpers.root.profile.tick === null) {
				helpers.root.profile.tick = Date.now();
			}

			_self.$root.page.busy();
			helpers.api.get('/providers').then(function (res) {
				_self.providers = res.data;

				if (_self.selectedProviderId == null) {
					_self.selectedProviderId = _self.$route.params.providerId
				}

				if (_self.selectedProviderId != null) {
					_self.selection.provider = _self.providers.filter(function (item) {
						return item.id === _self.selectedProviderId;
					})[0];

					if (_self.selection.provider == null) {
						_self.$root.log('Proveedor no encontrado').exception();
						_self.selectedProviderId = null;
						helpers.root.navigate('/billing/providers');
					}
				}

				_self.selectProvider();
				_self.updateHeader();
				_self.$root.page.idle();
			}).catch(function () {});
		},
		created : function () {
			this.selectedMonth = this.$route.query.month || (moment().month() + 1);
		},
		watch   : {
			$route(to, from) {
				if (to.path === '/billing/providers') {
					this.reset();
				}
			},
			selectedInstitutionId : function (value) {
				var _self = this;
				_self.updateHeader();
			}
		},
		methods : {
			updateHeader      : function () {
				var _self = this;
				_self.page.setup({
					title : 'Emisión de Facturas',
					icon  : 'fa-file-invoice'
				});

				if (_self.selectedInstitutionId != null) {
					_self.page.menu.add({
						key     : 'composing',
						caption : 'Ver Conduces',
						hint    : 'Conduces',
						icon    : 'fa-calendar-alt',
						path    : '/composing/providers/' + _self.$route.params.providerId + '/institutions/' + _self.selectedInstitutionId + '/detail?month=' + _self.selectedMonth
					});
					_self.page.menu.add({
						key     : 'billing',
						caption : 'Emitir Factura',
						hint    : 'Emitir Factura',
						icon    : 'fa-plus',
						path    : '/billing/create?provider=' + _self.$route.params.providerId + '&institution=' + _self.selectedInstitutionId + '&year=' + _self.selectedYear + '&month=' + _self.selectedMonth
					});
				} else {
					_self.page.menu.clear();
				}
			},
			reset             : function () {
				var _self = this;
				_self.selection.provider = null;
				_self.selection.institution = null;
				_self.selectedProviderId = null;
				_self.selectedInstitutionId = null;
				_self.selectedYear = moment().year();
				_self.selectedMonth = moment().month() + 1;
				_self.currentMonth = moment().month() + 1;
				_self.provider = null;
			},
			selectProvider    : function () {
				var _self = this;

				_self.selection.provider = _self.providers.filter(function (item) {
					return item.id === _self.selectedProviderId;
				})[0];

				if (_self.selection.provider) {
					if (_self.loaded === false && _self.$route.params.providerId != null) {
						if (_self.selectedInstitutionId != null) {
							var institution = _self.selection.provider.institutions.filter(function (item) {
								return item.id === _self.selectedInstitutionId;
							})[0];
							_self.selection.institution = institution;
							helpers.root.navigate('/billing/providers/' + _self.$route.params.providerId + '/institutions/' + institution.id + '/detail');
						} else {
							helpers.root.navigate('/billing/providers/' + _self.selection.provider.id + '/institutions');
						}
					} else {
						_self.selection.institution = null;
						_self.selectedInstitutionId = null;

						helpers.root.navigate('/billing/providers/' + _self.selection.provider.id + '/institutions');
					}
				}

				_self.loaded = true;
			},
			selectInstitution : function (institution) {
				var _self = this;
				_self.selection.institution = institution;
				_self.selectedInstitutionId = institution.id;
				helpers.root.navigate('/billing/providers/' + _self.$route.params.providerId + '/institutions/' + institution.id + '/detail');
			}
		},
		data    : function () {
			return {
				loaded                : false,
				enums                 : {
					identity_types : {
						rnc      : 'RNC',
						id       : 'Cédula',
						passport : 'Pasaporte'
					},
					types          : {
						primary   : 'Jornada Primaria',
						secundary : 'Jornada Secundaria',
						mixed     : 'Jornada Mixta',
						other     : 'Jornada General'
					}
				},
				selection             : {
					provider    : null,
					institution : null
				},
				selectedProviderId    : this.$route.params.providerId || null,
				selectedInstitutionId : this.$route.params.institutionId || null,
				selectedYear          : moment().year(),
				selectedMonth         : moment().month() + 1,
				currentMonth          : moment().month() + 1,
				providers             : null,
				hideLeftPannel        : false,
				months                : [
					{},
					{ label : 'Enero', index : 1 },
					{ label : 'Febrero', index : 2 },
					{ label : 'Marzo', index : 3 },
					{ label : 'Abril', index : 4 },
					{ label : 'Mayo', index : 5 },
					{ label : 'Junio', index : 6 },
					{ label : 'Julio', index : 7 },
					{ label : 'Agosto', index : 8 },
					{ label : 'Septiembre', index : 9 },
					{ label : 'Octubre', index : 10 },
					{ label : 'Noviembre', index : 11 },
					{ label : 'Diciembre', index : 12 },
				]
			};
		}
	}
});