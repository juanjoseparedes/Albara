'use strict';

anxeb.vue.include.scope('tenants/list', function (helpers, instance) {
	return {
		mounted  : function () {
			var _self = this;
			_self.page.setup({
				title : 'Lista de Afiliados',
				icon  : 'fa-address-book'
			});

			_self.page.menu.add({
				caption : 'Crear Afiliado',
				hint    : 'Crear Afiliado',
				icon    : 'fa-plus',
				action  : function () {
					_self.add();
				}
			});

			_self.page.menu.add({
				caption : 'Refrescar',
				hint    : 'Refrescar Afiliados',
				icon    : 'fa-sync',
				action  : function () {
					_self.refresh(true);
				}
			});
		},
		methods  : {
			filter : function (row) {
				return (this.search === '' || JSON.stringify(row).toLowerCase().search(this.search.toLowerCase()) > -1) && (row.state === this.state || this.state === '');
			},
			add    : function () {
				var _self = this;
				_self.$parent.modal('form-tenant').form({
					type   : this.type,
					tenant : this.tenant
				}).then(function (user) {
					_self.refresh();
					_self.$parent.log('Usuario creado correctamente').information();
				}).catch(function () {});
			},
			refresh(msg) {
				var _self = this;
				_self.page.busy();
				helpers.api.get('/tenants').then(function (res) {
					_self.tenants = res.data;
					if (msg === true) {
						_self.log('Afiliados recargados correctamente').information();
					} else {
						_self.page.idle();
					}
				}).catch(function (err) {
					_self.log(err).exception();
				});
			}
		},
		created  : function () {
			this.refresh();
		},
		computed : {},
		data     : function () {
			return {
				tenants : null,
				search  : '',
				state   : '',
				filters : {
					states : {
						''       : 'Todos',
						new      : 'Nuevos',
						active   : 'Activos',
						inactive : 'Inactivos'
					},
				},
				enums   : {
					states         : {
						new      : 'Nuevo',
						active   : 'Activo',
						inactive : 'Inactivo'
					},
					states_color   : {
						new      : '#3333ff',
						active   : '',
						inactive : '#a7a7a7'
					},
					identity_types : {
						rnc      : 'RNC',
						id       : 'CED',
						passport : 'PAS'
					},
				}
			};
		}
	}
});