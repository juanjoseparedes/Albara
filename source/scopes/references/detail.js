'use strict';

anxeb.vue.include.scope('references/detail', function (helpers, instance) {
	return {
		mounted : function () {
			var _self = this;
			_self.reference = helpers.tools.data.copy(_self.$parent.selected);
		},
		methods : {},
		data    : function () {
			return {
				reference : null
			};
		}
	}
});