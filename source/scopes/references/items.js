'use strict';

anxeb.vue.include.scope('references/items', function (helpers, instance) {
	return {
		mounted  : function () {
			var _self = this;
		},
		methods  : {
			filter : function (row) {
				return (this.filters.search == null || this.filters.search === '' || JSON.stringify(row).toLowerCase().search(this.filters.search.toLowerCase()) > -1);
			},
			refresh(msg) {
				var _self = this;
				_self.filters.search = null;
				_self.$parent.select(_self.$parent.selected.id, function () {
					if (msg === true) {
						_self.log('Elementos recargados correctamente').information();
					} else {
						_self.page.idle();
					}
				});
			}
		},
		watch    : {
			showSearch : function () {
				this.filters.search = null;
				this.$refs.grid.refresh();
			}
		},
		computed : {},
		data     : function () {
			return {
				filters    : {
					search : null
				},
				showSearch : false
			};
		}
	}
});