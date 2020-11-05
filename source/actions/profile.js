'use strict';
const anxeb = require('anxeb');
const md5 = require('md5');

module.exports = {
	url     : '/profile',
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	roles   : ['*'],
	methods : {
		get  : function (context) {
			context.data.retrieve.User(context.bearer.auth.body.identity, 'tenant').then(function (user) {
				if (user) {
					context.send(user.toClient());
				} else {
					context.log.exception.user_not_found.throw(context);
				}
			});
		},
		post : function (context) {
			let form = context.payload.user;
			if (form) {
				var email = form.email ? form.email.trim().toLowerCase() : null;
				var password = form.password ? form.password.trim().toLowerCase() : null;
				var password_rep = form.password_rep ? form.password_rep.trim().toLowerCase() : null;
				var password_new = form.password_new ? form.password_new.trim().toLowerCase() : null;

				context.data.retrieve.User(context.bearer.auth.body.identity).then(function (user) {
					if (user) {
						if (password && user.password === md5(password)) {
							if (!anxeb.utils.email.validate(email)) {
								context.log.exception.invalid_email.include({
									fields : [{ name : 'email', index : 1 }]
								}).throw(context);
								return;
							}

							if (!password_new || password_new.length < 4 || password_new.length > 18) {
								context.log.exception.invalid_password.include({
									fields : [{ name : 'password_new', index : 1 }]
								}).throw(context);
								return;
							}

							if (password_rep !== password_new) {
								context.log.exception.invalid_password.include({
									fields : [{ name : 'password_rep', index : 1 }]
								}).throw(context);
								return;
							}

							context.data.find.User({
								email : email
							}).then(function (rep_email) {
								if (!rep_email || rep_email._id.equals(user._id)) {
									user.email = email;
									user.password = md5(password_new);

									user.persist().then(function (user) {
										context.send(user);
									});
								} else {
									context.log.exception.selected_name_unavailable.args('Correo').include({
										fields : [{ name : 'email', index : 1 }]
									}).throw(context);
								}
							});
						} else {
							context.log.exception.invalid_password.include({
								fields : [{ name : 'password', index : 1 }]
							}).throw(context);
						}
					} else {
						context.log.exception.user_not_found.throw(context);
					}
				});
			} else {
				context.log.exception.invalid_request.throw(context);
			}
		}
	},
	childs  : {
		picture : {
			methods : {
				post : function (context) {
					if (context.payload.picture) {
						context.service.storage.save(anxeb.utils.path.join('profiles', context.bearer.auth.body.identity, 'info', 'user.image'), context.payload.picture);
						context.ok();
					} else {
						context.log.exception.invalid_request.throw(context);
					}
				}
			}
		}
	}
};