'use strict';

anxeb.vue.include.service('page', function (helpers) {
	var _self = this;
	var _busy;

	_self.navigate = function (path, query, params) {
		if (params || query) {
			helpers.root.router.push({ path : path, params : params, query : query });
		} else {
			helpers.root.router.push(path);
		}
	};

	_self.menu = {
		add    : function (group, pages) {
			helpers.root.$fetch('top-menu').then(function (topMenu) {
				topMenu.add(group, pages);
				topMenu.refresh();
			}).catch(function () {});
		},
		clear  : function () {
			helpers.root.$fetch('top-menu').then(function (topMenu) {
				topMenu.clear();
			}).catch(function () {});
		},
		update : function (key, callback) {
			helpers.root.$fetch('top-menu').then(function (topMenu) {
				var group = topMenu.getGroup(key);
				if (group && callback) {
					callback(group);
				}
			}).catch(function () {});
		}
	};

	_self.busy = function () {
		_busy = true;
		setTimeout(function () {
			if (_busy) {
				helpers.root.flags.busy = true;
			}
		}, 300);
	};

	_self.idle = function () {
		_busy = false;
		helpers.root.flags.busy = false;
	};

	_self.title = function (title) {
		helpers.root.$fetch('top-header').then(function (topHeader) {
			topHeader.title = title;
		}).catch(function () {});
	};

	_self.setup = function (params) {
		_self.menu.clear();

		helpers.root.$fetch('top-header').then(function (topHeader) {
			topHeader.setup(params);
		}).catch(function () {});
	};

	_self.setHint = function (item) {
		helpers.root.$broadcast('status-bar', function (statusBar) {
			statusBar.setHint(item);
		});
	};

});