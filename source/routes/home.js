'use strict';
var Anxeb = require('anxeb');

module.exports = {
	url       : '/home',
	container : 'private',
	view      : 'home',
	type      : Anxeb.Route.types.view,
	access    : Anxeb.Route.access.private,
	owners    : ['admin', 'tenant'],
	roles     : ['*'],
	methods   : {
		get : function (context) {
			context.render();
		}
	}
};