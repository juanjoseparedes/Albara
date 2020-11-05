'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/tenants',
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
		list      : {
			url     : '/list',
			methods : {
				get : function (context) {
					context.render();
				}
			},
		},
		detail    : {
			url     : '/:tenantId/detail',
			methods : {
				get : function (context) {
					context.render();
				}
			},
			childs  : {
				users     : {
					methods : {
						get : function (context) {
							context.render();
						}
					},
				},
				providers : {
					methods : {
						get : function (context) {
							context.render();
						}
					}
				}
			}
		},
		providers : {
			url     : '/:tenantId/providers',
			methods : {
				get : function (context) {
					context.render();
				}
			},
			childs  : {
				detail : {
					url     : '/:providerId/detail',
					methods : {
						get : function (context) {
							context.render();
						}
					}
				},
				create : {
					url     : '/create',
					view    : 'tenants/providers/detail',
					methods : {
						get : function (context) {
							context.render();
						}
					}
				}
			}
		}
	}
};