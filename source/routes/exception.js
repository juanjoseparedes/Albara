'use strict';
var Anxeb = require('anxeb');

module.exports = {
	container : 'light',
	type      : Anxeb.Route.types.exception,
	access    : Anxeb.Route.access.public,
	methods   : {
		get : function (context) {
			context.render();
		}
	}
};