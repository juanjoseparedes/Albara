'use strict';

anxeb.vue.include.component('modal', function (helpers) {

	var Button = function (params, modal) {
		var _self = this;
		_self.modal = modal;

		_self.key = params.key;
		_self.close = params.close;
		_self.class = params.class;
		_self.disabled = params.disabled;
		_self.prompted = params.prompted;
		_self.action = function () {
			if (params.action) {
				params.action(_self, _self.modal);
			}

			if (_self.close === true) {
				_self.modal.close();
			}
		};
		_self.text = params.text;
	};

	return {
		template : '/components/modal.vue',
		watch    : {
			active : function (value) {
				this.$emit('state-change', value);
			}
		},
		methods  : {
			enter       : function () {
				var _self = this;
				if (_self.value != null && _self.value.length > 0 && _self.prompt.enterEvent === true) {
					for (var b = 0; b < _self.buttons.length; b++) {
						var button = this.buttons[b];
						if (button.prompted) {
							button.action();
						}
					}
				}
			},
			reset       : function () {
				this.component = null;
				this.$refs.notifications.clear();
			},
			cancel      : function () {
				if (this.onCancel) {
					this.onCancel({
						key : 'CANCEL'
					});
				}
			},
			close       : function () {
				$('#dis_' + this.id).click();
				this.active = false;
			},
			setup       : function (params, buttons) {
				this.onCancel = params.onCancel || this.onCancel;
				this.title = params.title || this.title;
				this.prompt = params.prompt;
				this.large = params.large != null ? params.large : false;
				this.icon = params.icon || this.icon;
				this.message = params.message || this.message;
				this.component = params.component || this.component;
				this.loaded = params.loaded !== undefined ? params.loaded : true;

				this.buttons = [];
				if (params.buttons) {
					for (var b = 0; b < params.buttons.length; b++) {
						this.buttons.push(new Button(params.buttons[b], this));
					}
				}

				if (buttons) {
					for (var b = 0; b < buttons.length; b++) {
						this.buttons.push(new Button(buttons[b], this));
					}
				}

			},
			show        : function (params, buttons) {
				var _self = this;
				_self.key = (_self.$vnode.data.ref || 'modal') + Date.now();
				_self.value = null;
				_self.message = null;
				_self.setup(params, buttons);
				_self.active = true;
				$('#tog_' + _self.id).click();
				if (typeof _self.prompt === 'object' && _self.prompt.value) {
					_self.value = _self.prompt.value;
				}

				setTimeout(function () {
					if (_self.$refs.promptElement) {
						var el = $(_self.$refs.promptElement.$el).find(':input');
						if (el) {
							el.focus();
							setTimeout(function () {
								el.select();
							}, 0);
						}
					}
				}, 250);
			},
			exception   : function (err) {
				err = err.response && err.response.data && err.response.data.message ? err.response.data : err;
				var message = typeof err === 'string' ? err : err.message;
				helpers.tools.highlight(err);

				this.$refs.notifications.push({
					type    : 'exception',
					message : message
				})
			},
			information : function (message) {
				this.$refs.notifications.push({
					type    : 'information',
					message : message
				})
			}
		},
		computed : {
			promptLabel : function () {
				return typeof this.prompt === 'string' ? this.prompt : this.prompt.label;
			}
		},
		data     : function () {
			return {
				id        : this.$vnode.data.ref || 'modal',
				key       : null,
				title     : null,
				prompt    : null,
				value     : null,
				icon      : null,
				loaded    : true,
				component : null,
				buttons   : [],
				message   : null,
				onCancel  : null,
				active    : false,
				large     : false,
			}
		}
	}
});