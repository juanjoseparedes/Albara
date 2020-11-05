'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/users',
	container : 'private',
	view      : 'users',
	roles     : ['administrator', 'tenant'],
	type      : anxeb.Route.types.view,
	access    : anxeb.Route.access.private,
	methods   : {
		get : function (context) {
			context.render();
		}
	}
};