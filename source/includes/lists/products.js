'use strict';

anxeb.vue.include.component('list-products', function (helpers) {
	return {
		template : '/lists/products.vue',
		props    : ['allow-search', 'show-title', 'type', 'tenant', 'show-type'],
		mounted  : function () {

		},
		methods  : {
			remove : function (row) {
				var _self = this;
				_self.$parent.modal('¿Está seguro que quiere eliminar este producto?').confirm(function () {
					_self.$root.page.busy();
					helpers.api.delete('/products/' + row.id).then(function (res) {
						_self.refresh();
						_self.$parent.log('Producto eliminado correctamente').information();
					}).catch(function () {});
				});
			},
			edit   : function (row) {
				var _self = this;
				_self.$parent.modal('form-product').form(row.id).then(function (product) {
					_self.refresh();
					_self.$parent.log('Producto actualizado correctamente').information();
				}).catch(function () {});
			},
			add    : function () {
				var _self = this;
				_self.$parent.modal('form-product').form({
					type   : this.type,
					tenant : this.tenant
				}).then(function (product) {
					_self.refresh();
					_self.$parent.log('Producto creado correctamente').information();
				}).catch(function () {});
			},
			filter : function (row) {
				return (this.filters.search === '' || JSON.stringify(row).toLowerCase().search(this.filters.search.toLowerCase()) > -1) && (row.type === this.filters.type || this.filters.type === '');
			},
			refresh(msg) {
				var _self = this;
				_self.$root.page.busy();
				helpers.api.get('/products').then(function (res) {
					_self.products = res.data;
					if (msg === true) {
						_self.$parent.log('Productos recargados correctamente').information();
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
				products : null,
				filters  : {
					search : '',
					type   : '',
					types  : {
						''      : 'Todos',
						article : 'Artículos',
						service : 'Servicios'
					}
				},
				enums    : {
					types : {
						article : 'Artículo',
						service : 'Servicio'
					}
				}
			};
		}
	}
});