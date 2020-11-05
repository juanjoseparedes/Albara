'use strict';

anxeb.vue.include.component('category-tree', function (helpers) {

	return {
		template     : '/controls/category-tree.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'reference', 'level', 'branch'],
		mounted      : function () {
			var _self = this;
			_self.name = _self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null;
		},
		created      : function () {
			var _self = this;

			_self.$root.page.busy();
			helpers.api.get('/references/' + _self.reference, { params : { childs : 'all' } }).then(function (res) {
				_self.root = res.data;
				_self.$root.page.idle();
			}).catch(function (err) {
				_self.$root.log(err).exception();
			});
		},
		data         : function () {
			return {
				name        : null,
				root        : null,
				preselected : null,
				selected    : null,
				node        : null
			}
		},
		methods      : {
			select     : function (node) {
				var _self = this;
				_self.selected = node;
				_self.branch.value = node;
				_self.$emit('select', _self.branch);
			},
			drilldown  : function (node) {
				if (this.node === node) {
					this.node = null;
				} else {
					this.node = node;
				}
			},
			onSelected : function (node) {
				this.$emit('select', node);
			}
		},
		computed     : {}
	};
});