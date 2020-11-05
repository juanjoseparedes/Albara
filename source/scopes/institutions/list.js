'use strict';

anxeb.vue.include.scope('institutions/list', function (helpers, instance) {
	return {
		mounted  : function () {
			var _self = this;

			_self.page.setup({
				title : 'Lista de Centros',
				icon  : 'fa-building'
			});

			_self.page.menu.add({
				caption : 'Crear Centro',
				hint    : 'Crear Centro',
				icon    : 'fa-plus',
				action  : function () {
					_self.$refs.institutions.add();
				}
			});

			_self.page.menu.add({
				caption : 'Refrescar',
				hint    : 'Refrescar Centro',
				icon    : 'fa-sync',
				action  : function () {
					_self.$refs.institutions.refresh(true);
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