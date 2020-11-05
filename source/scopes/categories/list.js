'use strict';

anxeb.vue.include.scope('categories/list', function (helpers, instance) {
	return {
		mounted  : function () {
			var _self = this;

			_self.page.setup({
				title : 'Lista de Modalidades',
				icon  : 'fa-tags'
			});

			_self.page.menu.add({
				caption : 'Crear Modalidad',
				hint    : 'Crear Modalidad',
				icon    : 'fa-plus',
				action  : function () {
					_self.$refs.categories.add();
				}
			});

			_self.page.menu.add({
				caption : 'Refrescar',
				hint    : 'Refrescar Modalidades',
				icon    : 'fa-sync',
				action  : function () {
					_self.$refs.categories.refresh(true);
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