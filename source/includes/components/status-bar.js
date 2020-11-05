'use strict';

anxeb.vue.include.component('status-bar', function (helpers) {

	return {
		props    : ['app-name', 'app-version'],
		template : '/components/status-bar.vue',
		methods  : {
			setHint : function (item) {
				var _self = this;
				setTimeout(function () {
					_self.hint = '';
				}, 2000);
				_self.hint = item.hint;
			}
		},
		data     : function () {
			return {
				hint : ''
			}
		},
		computed : {}
	}
});