'use strict';

anxeb.vue.include.component('grid', {
	props    : ['source', 'paging', 'filter', 'list-type', 'empty-options', 'show-paging'],
	created  : function () {
		this.$paging = this.paging || 7;
		this.data = this.source.slice();
	},
	watch    : {
		source : function () {
			this.data = this.source.slice();
		}
	},
	mounted  : function () {

	},
	computed : {
		type    : function () {
			return this.listType;
		},
		from    : function () {
			return this.page * this.$paging;
		},
		to      : function () {
			return this.from + this.$paging;
		},
		rows    : function () {
			var _self = this;
			if (_self.$sorter) {
				return _self.data.sort(function (a, b) {
					if (_self.$sorter(a) < _self.$sorter(b)) {
						return _self.$sorterDesc;
					}
					if (_self.$sorter(a) > _self.$sorter(b)) {
						return _self.$sorterAsc;
					}
					return 0;
				}).slice(_self.from, _self.to);
			} else {
				return _self.data.slice(_self.from, _self.to);
			}
		},
		visible : function () {
			return 0
		},
		pages   : function () {
			if (this.data.length >= this.$paging) {
				return Math.ceil(this.data.length / this.$paging);
			} else {
				return 1;
			}
		},
		total   : function () {
			return this.pages - 1;
		},
		current : function () {
			return this.page + 1;
		}
	},
	methods  : {
		exists  : function (slot) {
			return this.$scopedSlots[slot] !== undefined;
		},
		sort    : function (field) {
			if (this.$sorterDesc === -1) {
				this.$sorterDesc = 1;
				this.$sorterAsc = -1;
			} else {
				this.$sorterDesc = -1;
				this.$sorterAsc = 1;
			}

			var parts = field.split('.');
			if (parts.length > 1) {
				this.$sorter = function (item) {
					return item[parts[0]][parts[1]];
				};
			} else {
				this.$sorter = function (item) {
					return item[parts[0]];
				};
			}
			this.page++;
			this.page--;
		},
		refresh : function () {
			if (this.filter) {
				this.data = this.source.filter(row => this.filter(row));
			} else {
				this.data = this.source.slice();
			}

			if (this.page >= this.pages) {
				this.page = this.pages - 1;
			}
		},
		unsort  : function () {
			this.$sorter = null;
		},
		next    : function () {
			if (this.page < this.total) {
				this.page++;
			}
		},
		prev    : function () {
			if (this.page > 0) {
				this.page--;
			}
		},
		first   : function () {
			this.page = 0;
		},
		last    : function () {
			this.page = this.total;
		}
	},
	data     : function () {
		return {
			slots : {},
			data  : [],
			page  : 0
		};
	},
	template : '/components/grid.vue'
});