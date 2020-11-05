'use strict';

anxeb.vue.include.component('list-providers', function (helpers) {
	return {
		template : '/lists/providers.vue',
		props    : ['allow-search', 'show-title', 'tenant', 'list-type'],
		mounted  : function () {

		},
		methods  : {
			getCategories : function (row) {
				var ids = [];
				if (row.institutions) {
					for (var i = 0; i < row.institutions.length; i++) {
						var institution = row.institutions[i];
						if (institution.categories) {
							for (var c = 0; c < institution.categories.length; c++) {
								var category = institution.categories[c];
								if (!ids.includes(category)) {
									ids.push(category);
								}
							}
						}
					}
				}
				return ids;
			},
			remove        : function (row) {
				var _self = this;
				_self.$parent.modal('¿Está seguro que quiere eliminar este proveedor?').confirm(function () {
					_self.$root.page.busy();
					helpers.api.delete('/providers/' + row.id).then(function (res) {
						_self.refresh();
						_self.$parent.log('Proveedor eliminado correctamente').information();
					}).catch(function () {});
				});
			},
			edit          : function (row) {
				var _self = this;
				helpers.root.navigate('/tenants/' + _self.tenant + '/providers/' + row.id + '/detail');
			},
			add           : function () {
				var _self = this;
				helpers.root.navigate('/tenants/' + _self.tenant + '/providers/create');
			},
			filter        : function (row) {
				return (this.filters.search === '' || JSON.stringify(row).toLowerCase().search(this.filters.search.toLowerCase()) > -1) && (row.state === this.filters.state || this.filters.state === '');
			},
			refresh(msg) {
				var _self = this;
				_self.$root.page.busy();

				helpers.api.get('/tenants/' + _self.tenant + '/providers').then(function (providers) {
					helpers.api.get('/categories/list').then(function (categories) {
						_self.categories = {};
						categories.data.map(function (item) {
							_self.categories[item.id] = item.name;
						});

						_self.providers = providers.data;
						if (msg === true) {
							_self.$parent.log('Centros recargados correctamente').information();
						} else {
							_self.$root.page.idle();
						}
					}).catch(function () {});
				}).catch(function () {});
			}
		},
		created  : function () {
			this.refresh();
		},
		computed : {},
		data     : function () {
			return {
				providers  : null,
				filters    : {
					search : ''
				},
				categories : {},
				enums      : {
					types   : {
						normal : 'Normal',
					},
					states  : {
						active   : 'Activa',
						inactive : 'Inactiva',
						canceled : 'Cancelada',
						expired  : 'Expirada'
					},
					modules : {
						control : 'Control',
						capital : 'Capital',
					},
					plans   : {
						base         : 'Base',
						plus         : 'Plus',
						professional : 'Profesional',
						unlimited    : 'Ilimitado'
					},
					periods : {
						daily     : 'Diario',
						weekly    : 'Semanal',
						monthly   : 'Mensual',
						quarterly : 'Trimestral',
						biannual  : 'Semestral',
						annual    : 'Anual'
					},
				}
			};
		}
	}
});