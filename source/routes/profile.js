'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/profile',
	container : 'private',
	view      : 'profile',
	owners    : '*',
	roles     : '*',
	type      : anxeb.Route.types.view,
	access    : anxeb.Route.access.private,
	methods   : {
		get : function (context) {
			context.render();
		}
	}
};