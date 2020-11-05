'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/categories',
	container : 'private',
	view      : 'categories',
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
			url     : '/:categoryId/detail',
			methods : {
				get : function (context) {
					context.render();
				}
			}
		},
		create : {
			url     : '/create',
			view    : 'categories/detail',
			methods : {
				get : function (context) {
					context.render();
				}
			}
		}
	}
};