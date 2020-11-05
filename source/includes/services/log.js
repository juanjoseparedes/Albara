'use strict';

anxeb.vue.include.service('log', function (helpers) {
	var broadcastNotification = function (from, alert) {
		from.$root.$broadcast('notifications', function (notifications) {
			notifications.push(alert)
		});
	};

	return function (component, obj) {
		var message = null;

		if (typeof obj === 'object') {
			if (obj.response && obj.response.data && obj.response.data.message) {
				obj = obj.response.data;
			}

			switch (obj.code) {
			case 401:
				message = 'Acceso Denegado';
				break;
			default:
				message = obj.message;
				break;
			}
		} else {
			message = obj;
		}

		return {
			exception   : function () {
				helpers.root.page.idle();
				if (message) {
					broadcastNotification(component, {
						type    : 'exception',
						message : message
					});
				}
			},
			information : function () {
				helpers.tools.unhighlight();
				helpers.root.page.idle();
				if (message) {
					broadcastNotification(component, {
						type    : 'information',
						message : message
					});
				}
			}
		}
	}
});