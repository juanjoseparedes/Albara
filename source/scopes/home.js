'use strict';

anxeb.vue.include.scope('home', function (helpers, instance) {
	return {
		mounted : function () {
			var _self = this;

			_self.page.setup({
				title : 'Inicio',
				icon  : 'fa-home'
			});

			if (helpers.root.profile.tick === null) {
				helpers.root.profile.tick = Date.now();
			}
		},
		methods : {
		},
		data    : function () {
			return {};
		}
	}
});