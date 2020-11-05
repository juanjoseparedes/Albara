'use strict';

anxeb.vue.include.scope('rationing/providers/institutions/detail', function (helpers, instance) {
	return {
		updated : function () {
			if (this.$refs.pivot) {
				this.$refs.pivot.refresh();
			}
		},
		created : function () {

		},
		data    : function () {
			return {
				showAll : false
			};
		}
	}
});