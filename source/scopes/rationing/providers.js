'use strict';

anxeb.vue.include.scope('rationing/providers', function (helpers, instance) {
	return {
		mounted : function () {
			var _self = this;

			_self.page.setup({
				title : 'Racionalización por Proveedor',
				icon  : 'fa-boxes'
			});

			if (helpers.root.profile.tick === null) {
				helpers.root.profile.tick = Date.now();
			}
		},
		watch   : {
			$route(to, from) {
				if (to.path === '/rationing/providers') {
					this.reset();
				}
			}
		},
		methods : {
			reset             : function () {
				var _self = this;
				_self.selectedInstitutionId = null;
				_self.selectedProviderId = null;
				_self.selection.provider = null;
				_self.selection.institution = null;
			},
			selectProvider    : function (provider) {
				var _self = this;
				_self.selection.provider = provider;

				if (_self.loaded === false && _self.$route.params.providerId != null) {
					_self.loaded = true;

					if (_self.selectedInstitutionId != null) {
						var institution = provider.institutions.filter(function (item) {
							return item.id === _self.selectedInstitutionId;
						})[0];
						_self.selection.institution = institution;
					}
				} else {
					_self.selection.institution = null;
					_self.selectedInstitutionId = null;
					helpers.root.navigate('/rationing/providers/' + provider.id + '/institutions');
				}
			},
			selectInstitution : function (institution) {
				var _self = this;
				_self.selection.institution = institution;
				_self.selectedInstitutionId = institution.id;
				helpers.root.navigate('/rationing/providers/' + _self.$route.params.providerId + '/institutions/' + institution.id + '/detail');
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
				selectedInstitutionId : this.$route.params.institutionId || null
			};
		}
	}
});