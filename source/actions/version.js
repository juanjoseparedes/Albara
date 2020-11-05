'use strict';
var anxeb = require("anxeb");

module.exports = {
	url     : "/",
	access  : anxeb.Route.access.public,
	timeout : 5000,
	methods : {
		get : function (context) {
			context.send("<span style='font-family: Verdana'>build v" + context.service.server.version + "</span>");
		}
	}
};
