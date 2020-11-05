'use strict';

anxeb.vue.include.scope('products', function (helpers, instance) {
	return {
		mounted  : function () {
			var _self = this;

			_self.page.setup({
				title : 'Productos',
				icon  : 'fa-tag'
			});

			_self.page.menu.add({
				caption : 'Crear Producto',
				hint    : 'Crear Producto',
				icon    : 'fa-plus',
				action  : function () {
					_self.$refs.products.add();
				}
			});

			_self.page.menu.add({
				caption : 'Refrescar',
				hint    : 'Refrescar Producto',
				icon    : 'fa-sync',
				action  : function () {
					_self.$refs.products.refresh(true);
				}
			});
		},
		methods  : {},
		created  : function () {

		},
		computed : {},
		data     : function () {
			return {};
		}
	}
});