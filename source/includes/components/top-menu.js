'use strict';

anxeb.vue.include.component('top-menu', function (helpers) {

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

		_self.update = function (params, pages) {
			_self.key = params.key || null;
			_self.active = params.active || null;
			_self.caption = params.caption ? new Caption(params.caption) : null;
			_self.label = params.label ? new Label(params.label) : null;
			_self.icon = params.icon ? new Icon(params.icon) : null;
			_self.hint = params.hint || null;
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

		_self.add = function (params) {
			var page = new Page(params);
			_self.pages.push(page);
			return params;
		};

		_self.update(params, pages);
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
		_self.action = params.action || null;
		_self.isActive = params.isActive || null;
		_self.role = params.role || null;
		_self.divider = params.divider || false;
	};

	return {
		template : '/components/top-menu.vue',
		inject   : ['session', 'page'],
		created  : function () {
			var _self = this;

			this.$router.afterEach(function (to, from) {
				_self.refresh();
			});
		},
		methods  : {
			clear    : function () {
				this.groups = [];
			},
			add      : function (groupParams, pages) {
				var group = null;

				if (groupParams.key != null) {
					group = this.groups.filter(function (item) {
						return item.key === groupParams.key;
					})[0];
				}

				if (group == null) {
					group = new Group(groupParams, pages);
					this.groups.push(group);
				} else {
					group.update(groupParams, pages);
				}

				return group;
			},
			refresh  : function () {
				var _self = this;

				for (var g = 0; g < _self.groups.length; g++) {
					_self.groups[g].refresh(_self.$router.currentRoute.path);
				}
			},
			getGroup : function (key) {
				var _self = this;
				for (var g = 0; g < _self.groups.length; g++) {
					var group = _self.groups[g];
					if (group.key === key) {
						return group;
					}
				}
			}
		},
		data     : function () {
			return {
				groups : []
			}
		}
	}
});