'use strict';
var anxeb = require('anxeb');

module.exports = {
	url       : '/about',
	container : 'private',
	view      : 'about',
	roles     : ['*'],
	type      : anxeb.Route.types.view,
	access    : anxeb.Route.access.private,
	methods   : {
		get : function (context) {
			context.render();
		}
	}
};