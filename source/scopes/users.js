'use strict';

anxeb.vue.include.scope('users', function (helpers, instance) {
	return {
		mounted  : function () {
			var _self = this;

			_self.page.setup({
				title : 'Usuarios',
				icon  : 'fa-users'
			});

			_self.page.menu.add({
				caption : 'Crear Usuario',
				hint    : 'Crear Usuario',
				icon    : 'fa-user-plus',
				action  : function () {
					_self.$refs.users.add();
				}
			});

			_self.page.menu.add({
				caption : 'Refrescar',
				hint    : 'Refrescar Usuarios',
				icon    : 'fa-sync',
				action  : function () {
					_self.$refs.users.refresh(true);
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