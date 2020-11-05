'use strict';

anxeb.vue.include.component('field-barcode', function (helpers) {
	return {
		template     : '/controls/field-barcode.vue',
		inheritAttrs : false,
		props        : ['label', 'value', 'id', 'readonly', 'url', 'alt-url', 'height', 'width', 'field-name'],
		mounted      : function () {
			var _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);
			this.render();
		},
		data         : function () {
			return {
				name : null,
				code : null
			}
		},
		watch        : {
			value : function () {
				this.render();
			}
		},
		methods      : {
			render : function () {
				var _self = this;
				var container = _self.$refs.container;
				var value = _self.value;
				var format = undefined;

				if (value != null) {
					if (value.length === 13) {
						format = 'ean13'
					} else if (value.length === 8) {
						format = 'ean8'
					} else if (value.length === 5) {
						format = 'ean5'
					} else if (value.length === 2) {
						format = 'ean2'
					} else if (value.length === 12) {
						format = 'upc';
					}
				}

				var build = function (format) {
					JsBarcode(container, value, {
						width        : 1.3,
						height       : 80,
						displayValue : true,
						fontSize     : 18,
						lineColor    : 'black',
						marginLeft   : 30,
						marginRight  : 30,
						format       : format
					});
				};

				try {
					build(format);
				} catch (e) {
					build();
				}
			},
			edit   : function () {
				this.$emit('click');
			}
		},
		computed     : {}
	};
});