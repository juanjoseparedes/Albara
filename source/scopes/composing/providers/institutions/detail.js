'use strict';

anxeb.vue.include.scope('composing/providers/institutions/detail', function (helpers, instance) {
	return {
		updated : function () {
			if (this.$refs.composer) {
				this.$refs.composer.refresh();
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