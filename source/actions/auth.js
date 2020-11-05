'use strict';
const anxeb = require('anxeb');
const md5 = require('md5');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.public,
	methods : {
		post : function (context) {
			var email = context.payload.email ? context.payload.email.trim() : null;
			var password = context.payload.password ? context.payload.password.trim() : null;

			context.data.find.User({
				email : email
			}, 'tenant').then(function (user) {
				if (user && user.role && user.type && user.claims && password && password.length && user.password === md5(password.trim().toLowerCase())) {
					let $user = user.toClient();
					context.send({
						user  : $user,
						token : context.sign({
							user     : $user,
							identity : $user.id,
							claims   : user.claims,
							roles    : [user.role],
							type     : $user.type,
							tenant   : $user.tenant ? $user.tenant : undefined
						})
					});
				} else {
					context.log.exception.invalid_credentials.throw(context);
				}
			});
		}
	}
};