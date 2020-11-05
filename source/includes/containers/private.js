'use strict';

anxeb.vue.include.scope('private', {
	data    : function () {
		return {
			modalIsActive : false
		};
	},
	methods : {
		navigation : function (navigator) {
			var _self = this;

			var admin = navigator.addSection('Menú General');

			admin.addGroup({
				caption : 'Estado',
				icon    : 'fa-home',
				hint    : 'Estado',
			}, [{
				caption : 'Inicio',
				hint    : 'Estado / Inicio',
				path    : '/home'
			}]);

			admin.addGroup({
				caption : 'Sesión',
				icon    : 'fa-user',
				hint    : 'Sesión de Usuario'
			}, [{
				caption : 'Perfil Usuario',
				hint    : 'Sesión de Usuario / Perfil de Usuario',
				path    : '/profile'
			}, {
				caption : 'Cerrar',
				hint    : 'Sesión / Cerrar',
				action  : function () {
					_self.$parent.modal({ title : 'Albará', message : '¿Está seguro que quiere cerrar la sesión?' }).confirm(function () {
						_self.$parent.session.logout().then(function () {
							_self.$parent.$router.push('/');
						}).catch(function (err) {
							_self.$parent.log(err).exception();
						});
					});
				}
			}]);

			admin.addGroup({
				caption : 'Administración',
				icon    : 'fa-cog',
				hint    : 'Administración',
				role    : ['administrator']
			}, [{
				caption : 'Usuarios del Sistema',
				hint    : 'Administración / Usuarios',
				path    : '/users'
			}, {
				caption  : 'Afiliados y Proveedores',
				hint     : 'Administración / Afiliados y Proveedores',
				path     : '/tenants/list',
				owners   : ['admin'],
				isActive : function (path) {
					return path.startsWith('/tenants/');
				}
			}, {
				caption  : 'Raciones por Proveedor',
				hint     : 'Administración / Raciones por Proveedor',
				path     : '/rationing/providers',
				owners   : ['admin'],
				isActive : function (path) {
					return path.startsWith('/rationing/providers');
				}
			}]);

			admin.addGroup({
				caption : 'Información',
				icon    : 'fa-info-circle',
				hint    : 'Información de Sistema',
				role    : ['administrator']
			}, [{
				caption : 'Acerca',
				hint    : 'Información / Acerca',
				path    : '/about'
			}]);


			var operations = navigator.addSection('Menú Operativo');

			operations.addGroup({
				caption : 'Registro Operativo',
				icon    : 'fa-suitcase',
				hint    : 'Registro Operativo',
				owners  : ['admin'],
				role    : ['administrator']
			}, [{
				caption : 'Productos y Artículos',
				hint    : 'Listas / Productos y Artículos',
				path    : '/products/list'
			}, {
				caption  : 'Catálogo de Modalidades',
				hint     : 'Listas / Catálogo de Modalidades',
				path     : '/categories/list',
				isActive : function (path) {
					return path.startsWith('/categories');
				}
			}, {
				caption  : 'Centros o Instituciones',
				hint     : 'Listas / Centros o Instituciones',
				path     : '/institutions/list',
				isActive : function (path) {
					return path.startsWith('/institutions');
				}
			}]);

			operations.addGroup({
				caption : 'Procedimientos',
				icon    : 'fa-check-double',
				hint    : 'Acciones',
				owners  : ['tenant'],
				role    : ['administrator']
			}, [{
				caption  : 'Emitir Conduces',
				hint     : 'Acciones / Generar Conduces',
				path     : '/composing/providers',
				isActive : function (path) {
					return path.startsWith('/composing/providers');
				}
			}, {
				caption  : 'Emitir Facturas',
				hint     : 'Acciones / Generar Facturas',
				path     : '/billing/providers',
				isActive : function (path) {
					return path.startsWith('/billing/');
				}
			}/*, {
				caption : 'Generar Nota de Débito',
				hint    : 'Acciones / Nota de Débito',
				path    : '/modules/debits'
			}, {
				caption : 'Generar Nota de Crédito',
				hint    : 'Acciones / Nota de Crédito',
				path    : '/modules/credits'
			}*/]);

			/*operations.addGroup({
				caption : 'Reportes',
				icon    : 'fa-file-alt',
				hint    : 'Reportes',
				owners  : ['tenant'],
				role    : ['administrator']
			}, [{
				caption : 'Facturas Pentiendes',
				hint    : 'Reportes / Facturas Pentiendes',
				path    : '/lists/products'
			}, {
				caption : 'Facturas Pagadas',
				hint    : 'Reportes / Facturas Pagadas',
				path    : '/lists/products'
			}, {
				caption : 'Conduces Emitidos',
				hint    : 'Reportes / Conduces',
				path    : '/lists/categories'
			}, {
				caption : 'Conduces por Factura',
				hint    : 'Reportes / Notas de Crédito',
				path    : '/lists/categories'
			}, {
				caption : 'Notas de Crédito',
				hint    : 'Reportes / Notas de Crédito',
				path    : '/lists/categories'
			}, {
				caption : 'Notas de Débito',
				hint    : 'Reportes / Notas de Crédito',
				path    : '/lists/categories'
			}]);*/

			operations.addGroup({
				caption : 'Listas Globales',
				icon    : 'fa-globe',
				hint    : 'Listas Globales',
				owners  : ['admin', 'god'],
				role    : ['administrator']
			}, [{
				caption  : 'Regiones y Provincias',
				hint     : 'Listas Globales / Regiones',
				path     : '/references/regions',
				isActive : function (path) {
					return path.startsWith('/references/regions') || path.startsWith('/references/provinces') || path.startsWith('/references/cities');
				}
			}, {
				caption  : 'Unidades de Medida',
				hint     : 'Listas Globales / Unidades de Medida',
				path     : '/references/units',
				isActive : function (path) {
					return path.startsWith('/references/units');
				}
			}, {
				caption  : 'Clases Impositivas',
				hint     : 'Listas Globales / Clases Impositivas',
				path     : '/references/vats',
				isActive : function (path) {
					return path.startsWith('/references/vats');
				}
			}]);

		},
		tooling    : function (tools) {
			var _self = this;

			tools.addGroup({
				icon : 'fa-home',
				hint : 'Inicio',
				path : '/home'
			});

			tools.addGroup({
				icon : 'fa-info-circle',
				hint : 'Acerca',
				path : '/about'
			});

			tools.addGroup({
				icon : { image : '/api/storage/profile/info/user/image', alt : 'images/page/user-black.png' },
				hint : 'Mi Perfil'
			}, [{
				caption : 'Mi Perfil',
				icon    : 'fa-user',
				hint    : 'Sesión de Usuario / Perfil de Usuario',
				path    : '/profile'
			}, {
				divider : true,
				caption : 'Cerrar Sesión',
				icon    : 'fa-sign-out',
				hint    : 'Sesión / Cerrar',
				action  : function () {
					_self.$parent.modal({ title : 'Albará', message : '¿Está seguro que quiere cerrar la sesión?' }).confirm(function () {
						_self.$parent.session.logout().then(function () {
							_self.$parent.$router.push('/');
						}).catch(function (err) {
							_self.$parent.log(err).exception();
						});
					});
				}
			}]);
		}
	}
});