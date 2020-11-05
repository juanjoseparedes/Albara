'use strict';

anxeb.vue.include.component('top-header', function (helpers) {
	return {
		template : '/components/top-header.vue',
		methods  : {
			setup  : function (params) {
				this.title = params.title;
				this.caption = params.caption;
				this.icon = params.icon;
				this.action = params.action;
			},
			actionCall : function () {
				if (this.action) {
					this.action();
				}
			}
		},
		data     : function () {
			return {
				title   : '',
				icon    : '',
				action : null
			}
		},
		computed : {}
	}
});