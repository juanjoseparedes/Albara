'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/rationing',
	container : 'private',
	roles     : ['administrator'],
	type      : anxeb.Route.types.view,
	access    : anxeb.Route.access.private,
	methods   : {
		get : function (context) {
			context.render();
		}
	},
	childs    : {
		providers : {
			url     : '/providers',
			methods : {
				get : function (context) {
					context.render();
				}
			},
			childs  : {
				institutions : {
					url     : '/:providerId/institutions',
					methods : {
						get : function (context) {
							context.render();
						}
					},
					childs  : {
						detail : {
							url     : '/:institutionId/detail',
							methods : {
								get : function (context) {
									context.render();
								}
							}
						}
					}
				}
			}
		}
	}
};