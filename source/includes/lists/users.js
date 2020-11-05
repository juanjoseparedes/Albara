'use strict';

anxeb.vue.include.component('list-users', function (helpers) {
	return {
		template : '/lists/users.vue',
		props    : ['allow-search', 'show-title', 'type', 'tenant', 'show-type'],
		mounted  : function () {

		},
		methods  : {
			remove : function (row) {
				var _self = this;
				_self.$parent.modal('¿Está seguro que quiere eliminar este usuario?').confirm(function () {
					_self.$root.page.busy();
					helpers.api.delete('/users/' + row.id).then(function (res) {
						_self.refresh();
						_self.$parent.log('Usuario eliminado correctamente').information();
					}).catch(function () {});
				});
			},
			edit   : function (row) {
				var _self = this;
				_self.$parent.modal('form-user').form(row.id).then(function (user) {
					_self.refresh();
					_self.$parent.log('Usuario actualizado correctamente').information();
				}).catch(function () {});
			},
			add    : function () {
				var _self = this;
				_self.$parent.modal('form-user').form({
					type   : this.type,
					tenant : this.tenant
				}).then(function (user) {
					_self.refresh();
					_self.$parent.log('Usuario creado correctamente').information();
				}).catch(function () {});
			},
			filter : function (row) {
				return (this.filters.search === '' || JSON.stringify(row).toLowerCase().search(this.filters.search.toLowerCase()) > -1) && (row.state === this.filters.state || this.filters.state === '') && (row.type === this.filters.type || this.filters.type === '');
			},
			refresh(msg) {
				var _self = this;
				_self.$root.page.busy();
				helpers.api.get('/users', {
					params : {
						type   : _self.type,
						tenant : _self.tenant
					}
				}).then(function (res) {
					_self.users = res.data;
					if (msg === true) {
						_self.$parent.log('Usuarios recargados correctamente').information();
					} else {
						_self.$root.page.idle();
					}
				}).catch(function () {});
			}
		},
		created  : function () {
			this.refresh();
		},
		computed : {},
		data     : function () {
			return {
				users   : null,
				filters : {
					search : '',
					state  : '',
					type   : ''
				},
				enums   : {
					alltypes : {
						admin  : 'Administrador',
						tenant : 'Afiliado'
					},
					types    : {
						''     : 'Todos',
						admin  : 'Administrador',
						tenant : 'Afiliado'
					},
					roles    : {
						administrator : 'Administrador',
						operator      : 'Operador'
					},
					states   : {
						''       : 'Todos',
						active   : 'Activo',
						inactive : 'Inactivo'
					}
				}
			};
		}
	}
});