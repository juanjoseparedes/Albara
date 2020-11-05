'use strict';
var Anxeb = require('anxeb');

module.exports = {
	url       : '/',
	container : 'public',
	view      : 'login',
	type      : Anxeb.Route.types.unauthorized,
	access    : Anxeb.Route.access.public,
	methods   : {
		get : function (context) {
			context.render();
		}
	}
};