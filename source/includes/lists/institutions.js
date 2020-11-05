'use strict';

anxeb.vue.include.component('list-institutions', function (helpers) {
	return {
		template : '/lists/institutions.vue',
		props    : ['allow-search', 'show-title'],
		mounted  : function () {

		},
		methods  : {
			remove : function (row) {
				var _self = this;
				_self.$parent.modal('¿Está seguro que quiere eliminar este centro?').confirm(function () {
					_self.$root.page.busy();
					helpers.api.delete('/institutions/' + row.id).then(function (res) {
						_self.refresh();
						_self.$parent.log('Centro eliminado correctamente').information();
					}).catch(function () {});
				});
			},
			edit   : function (row) {
				helpers.root.navigate('/institutions/' + row.id + '/detail');
			},
			add    : function () {
				this.$root.navigate('/institutions/create');
			},
			filter : function (row) {
				return (this.filters.search === '' || JSON.stringify(row).toLowerCase().search(this.filters.search.toLowerCase()) > -1);
			},
			refresh(msg) {
				var _self = this;

				_self.$root.page.busy();
				helpers.api.get('/institutions').then(function (res) {
					_self.institutions = res.data;
					if (msg === true) {
						_self.$parent.log('Centros recargados correctamente').information();
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
				enums        : {
					types : {
						primary   : 'Primaria',
						secundary : 'Secundaria',
						mixed     : 'Mixta',
						other     : 'Otra',
					},
				},
				institutions : null,
				filters      : {
					search : ''
				}
			};
		}
	}
});