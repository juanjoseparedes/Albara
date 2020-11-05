'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/billing',
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
		create    : {
			view    : 'billing/preview',
			methods : {
				get : function (context) {
					context.render();
				}
			}
		},
		manage    : {
			url     : ':billId/manage',
			view    : 'billing/preview',
			methods : {
				get : function (context) {
					context.render();
				}
			}
		},
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