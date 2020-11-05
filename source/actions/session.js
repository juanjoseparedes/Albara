'use strict';
const anxeb = require('anxeb');

module.exports = {
	type   : anxeb.Route.types.action,
	access : anxeb.Route.access.private,
	roles  : ['*'],
	childs : {
		login  : {
			methods : {
				post : function (context) {
					context.send({
						token : context.login()
					});
				}
			}
		},
		logout : {
			methods : {
				post : function (context) {
					context.send({
						result : context.logout()
					});
				}
			}
		}
	}
};