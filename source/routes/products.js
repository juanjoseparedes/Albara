'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/products/list',
	container : 'private',
	view      : 'products',
	roles     : ['administrator'],
	type      : anxeb.Route.types.view,
	access    : anxeb.Route.access.private,
	methods   : {
		get : function (context) {
			context.render();
		}
	}
};