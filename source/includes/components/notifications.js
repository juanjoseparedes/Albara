'use strict';

anxeb.vue.include.component('notifications', function (helpers) {
	var Alert = function (params) {
		var _self = this;

		_self.type = params.type;
		_self.message = params.message;
		_self.visible = false;

		_self.show = function (callback) {
			_self.visible = true;
			setTimeout(function () {
				if (_self.visible) {
					_self.hide(callback);
				}
			}, params.delay || 2000);
		};

		_self.hide = function (callback) {
			_self.visible = false;
			setTimeout(function () {
				if (callback) {
					callback();
				}
			}, 250);
		}
	};

	return {
		template : '/components/notifications.vue',
		props    : ['max', 'delay', 'reversed', 'disabled'],
		methods  : {
			push  : function (params) {
				var _self = this;
				var max = this.max || 1;
				params.delay = params.delay || this.delay;

				if (max > 0) {
					for (var i = 0; i <= _self.list.length - max; i++) {
						var hid = _self.list[i];
						for (var d = _self.list.length - 1; d >= 0; d--) {
							if (_self.list[d] === hid) {
								_self.list.splice(d, 1);
							}
						}
					}
				}

				if (_self.current) {
					if (_self.current.type === params.type && _self.current.message === params.message) {
						return;
					}
				}

				var alert = new Alert(params);
				_self.list.push(alert);
				alert.show(function () {
					for (var d = _self.list.length - 1; d >= 0; d--) {
						if (_self.list[d] === alert) {
							_self.list.splice(d, 1);
						}
					}
				});
			},
			clear : function () {
				this.list = [];
			}
		},
		data     : function () {
			return {
				list : []
			}
		},
		computed : {
			current : function () {
				return this.list.length ? this.list[this.list.length - 1] : null;
			},
			items   : function () {
				if (this.reversed === 'false') {
					return this.list;
				} else {
					return this.list.slice().reverse();
				}
			}
		}
	}
});