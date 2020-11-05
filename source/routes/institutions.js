'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/institutions',
	container : 'private',
	view      : 'institutions',
	roles     : ['administrator'],
	type      : anxeb.Route.types.view,
	access    : anxeb.Route.access.private,
	methods   : {
		get : function (context) {
			context.render();
		}
	},
	childs    : {
		list   : {
			url     : '/list',
			methods : {
				get : function (context) {
					context.render();
				}
			},
		},
		detail : {
			url     : '/:institutionId/detail',
			methods : {
				get : function (context) {
					context.render();
				}
			}
		},
		create : {
			url     : '/create',
			view    : 'institutions/detail',
			methods : {
				get : function (context) {
					context.render();
				}
			}
		}
	}
};