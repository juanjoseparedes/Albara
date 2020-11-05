'use strict';

anxeb.vue.include.component('field-input', function () {

	var formatValue = function (value, options) {
		if (options.forceUppercase) {
			value = value ? value.toUpperCase() : value;
		}
		if (!options.allowEmpty) {
			value = value === '' ? null : value;
		}
		if (options.percent != null) {
			value = parseFloat(value) * 100;
		}
		if (options.decimals != null) {
			value = parseFloat(value).toFixed(parseInt(options.decimals));
		}
		if (options.comma != null) {
			value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}
		return value;
	};

	return {
		template     : '/controls/field-input.vue',
		inheritAttrs : false,
		props        : ['label', 'value', 'focus', 'required', 'type', 'id', 'rows', 'allow-empty', 'force-uppercase', 'maxlength', 'readonly', 'decimals', 'prefix', 'percent', 'sufix', 'comma', 'field-name'],
		mounted      : function () {
			var _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);
		},
		data         : function () {
			return {
				name : null
			}
		},
		computed     : {
			post_value : function () {
				var _self = this;
				if (_self.value != null) {
					var value = formatValue(_self.value, {
						allowEmpty     : _self.allowEmpty === 'true',
						forceUppercase : _self.forceUppercase === 'true',
						decimals       : _self.decimals,
						percent        : _self.percent,
						comma          : _self.comma
					});

					var sufix = _self.sufix;
					if (_self.percent === 'true') {
						sufix = '%';
					}

					value = _self.prefix != null ? _self.prefix + value : value;
					value = sufix != null ? value + sufix : value;
					return value;
				} else {
					return _self.value;
				}
			},
			listener   : function () {
				var _self = this;
				return Object.assign({}, this.$listeners, {
						input : function (event) {
							_self.$emit('input', event.target.value);
							/*_self.$emit('input', formatValue(event.target.value, {
								allowEmpty     : _self.allowEmpty === 'true',
								forceUppercase : _self.forceUppercase === 'true',
								decimals       : _self.decimals
							}));*/
						}
					}
				)
			}
		}
	};
});