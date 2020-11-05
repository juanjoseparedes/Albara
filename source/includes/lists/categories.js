'use strict';

anxeb.vue.include.component('list-categories', function (helpers) {
	return {
		template : '/lists/categories.vue',
		props    : ['allow-search', 'show-title'],
		mounted  : function () {

		},
		methods  : {
			remove : function (row) {
				var _self = this;
				_self.$parent.modal('¿Está seguro que quiere eliminar esta modalidad?').confirm(function () {
					_self.$root.page.busy();
					helpers.api.delete('/categories/' + row.id).then(function (res) {
						_self.refresh();
						_self.$parent.log('Modalidad eliminado correctamente').information();
					}).catch(function () {});
				});
			},
			edit   : function (row) {
				helpers.root.navigate('/categories/' + row.id + '/detail');
			},
			add    : function () {
				this.$root.navigate('/categories/create');
			},
			filter : function (row) {
				return (this.filters.search === '' || JSON.stringify(row).toLowerCase().search(this.filters.search.toLowerCase()) > -1);
			},
			refresh(msg) {
				var _self = this;

				_self.$root.page.busy();
				helpers.api.get('/categories').then(function (res) {
					_self.categories = res.data;
					if (msg === true) {
						_self.$parent.log('Modalidades recargadas correctamente').information();
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
				categories : null,
				filters    : {
					search : ''
				}
			};
		}
	}
});