'use strict';

anxeb.vue.include.scope('billing/providers/institutions/detail', function (helpers, instance) {
	return {
		mounted : function () {

		},
		updated : function () {
			var _self = this;
			if (_self.$refs.bills) {
				_self.$refs.bills.refresh();
			}
		},
		methods : {
			getYear : function () {
				return moment().year();
			}
		},
		created : function () {

		},
		data    : function () {
			return {};
		}
	}
});