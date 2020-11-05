'use strict';

anxeb.vue.include.component('field-select', function (helpers) {
	return {
		template     : '/controls/field-select.vue',
		inheritAttrs : false,
		props        : ['label', 'value', 'focus', 'required', 'id', 'items', 'value-bind', 'key-bind', 'show-first', 'field-name', 'source'],
		mounted      : function () {
			var _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);

			if (_self.source != null) {
				var options = typeof _self.source === 'string' ? { url : _self.source } : _self.source;
				_self.$root.page.busy();
				helpers.api.get(options.url, options.params).then(function (res) {
					_self.$root.page.idle();
					_self.data = res.data;
				}).catch(function () {});
			}
		},
		data         : function () {
			return {
				name : null,
				data : null
			}
		},
		computed     : {
			list     : function () {
				var _self = this;
				if (_self.data != null) {
					return _self.data;
				} else {
					return _self.items;
				}
			},
			listener : function () {
				var _self = this;
				return Object.assign({}, this.$listeners, {
						input : function (event) {
							_self.$emit('input', event.target.value)
						}
					}
				)
			}
		}
	};
});