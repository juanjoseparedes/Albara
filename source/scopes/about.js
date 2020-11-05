'use strict';

anxeb.vue.include.scope('about', function (helpers, instance) {
	return {
		mounted  : function () {
			this.page.setup({
				title : 'Acerca de Albará',
				icon  : 'fa-info-circle'
			});
		},
		created  : function () {

		},
		computed : {
			date : function () {
				return 'computed ' + this.name;
			}
		},
		data     : function () {
			return {};
		}
	}
});