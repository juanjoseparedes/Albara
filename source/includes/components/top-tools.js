'use strict';

anxeb.vue.include.component('top-tools', function (helpers) {

	var Icon = function (params) {
		var _self = this;

		if (typeof params === 'string') {
			_self.class = params;
			_self.color = null;
		} else {
			_self.class = params.class || null;
			_self.color = params.color || null;
			_self.image = params.image || null;
			_self.alt = params.alt || null;
		}
	};

	var Caption = function (params) {
		var _self = this;

		if (typeof params === 'string') {
			_self.title = params;
			_self.color = null;
		} else {
			_self.title = params.title || null;
			_self.subtitle = params.subtitle || null;
			_self.color = params.color || null;
		}
	};

	var Label = function (params) {
		var _self = this;

		if (typeof params === 'string') {
			_self.text = params;
			_self.color = null;
			_self.fill = null;
			_self.enabled = false;
		} else {
			_self.text = params.text || null;
			_self.color = params.color || null;
			_self.fill = params.fill || null;
			_self.enabled = params.enabled || null;
		}
	};

	var Page = function (params) {
		var _self = this;

		_self.refresh = function (path) {
			if (_self.isActive) {
				_self.active = _self.isActive(path);
			} else {
				_self.active = _self.path === path;
			}
			return _self.active;
		};

		_self.active = params.active || null;
		_self.caption = params.caption ? new Caption(params.caption) : null;
		_self.label = params.label ? new Label(params.label) : null;
		_self.hint = params.hint || null;
		_self.icon = params.icon ? new Icon(params.icon) : null;
		_self.path = params.path || null;
		_self.anchor = params.anchor || null;
		_self.action = params.action || null;
		_self.isActive = params.isActive || null;
		_self.role = params.role || null;
		_self.divider = params.divider || false;
	};

	var Group = function (params, pages) {
		var _self = this;

		_self.refresh = function (path) {
			if (_self.isActive) {
				_self.active = _self.isActive(path);
			} else {
				_self.active = _self.path === path;
				if (_self.pages) {
					for (var i = 0; i < _self.pages.length; i++) {
						var page = _self.pages[i];
						if (page.refresh(path) === true) {
							_self.active = true;
							break;
						}
					}
				}
			}
			return _self.active;
		};

		_self.active = params.active || null;
		_self.caption = params.caption ? new Caption(params.caption) : null;
		_self.label = params.label ? new Label(params.label) : null;
		_self.icon = params.icon ? new Icon(params.icon) : null;
		_self.hint = params.hint || null;
		_self.type = params.type || null;
		_self.action = params.action || null;
		_self.path = params.path || null;
		_self.isActive = params.isActive || null;
		_self.role = params.role || null;
		_self.pages = [];

		if (pages) {
			for (var i = 0; i < pages.length; i++) {
				_self.pages.push(new Page(pages[i]));
			}
		}
	};

	return {
		template : '/components/top-tools.vue',
		props    : ['init'],
		inject   : ['session', 'page'],
		created  : function () {
			var _self = this;

			_self.$router.afterEach(function (to, from) {
				_self.refresh();
			});

			_self.init(_self);

			_self.refresh();
		},
		methods  : {
			refresh  : function () {
				var _self = this;

				for (var g = 0; g < _self.groups.length; g++) {
					_self.groups[g].refresh(_self.$router.currentRoute.path);
				}
			},
			clear    : function () {
				this.groups = [];
			},
			addGroup : function (params, pages) {
				var group = new Group(params, pages);
				this.groups.push(group);
				return group;
			}
		},
		data     : function () {
			return {
				groups : []
			}
		}
	}
});