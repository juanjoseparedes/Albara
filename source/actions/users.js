'use strict';
var anxeb = require('anxeb');
const md5 = require('md5');
var types = require('../models/user').types;

module.exports = {
	url     : '/users',
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	roles   : ['administrator'],
	methods : {
		get  : function (context) {
			var query = {};

			if (context.query.tenant) {
				query.type = types.tenant;
				query.tenant = context.query.tenant;
			}

			if (context.bearer.auth.body.type === types.admin) {
				if (context.query.type === types.admin || context.query.type === types.tenant) {
					query.type = context.query.type;
				} else {
					query.type = { $in : [types.admin, types.tenant] };
				}
			} else if (context.bearer.auth.body.type === types.tenant) {
				query.type = types.tenant;
				query.tenant = context.bearer.auth.body.tenant.id;
			} else {
				context.log.exception.unauthorized_access.args(req.method, req.url).throw(context);
				return;
			}

			context.data.list.User(query).then(function (users) {
				context.send(users.toClient());
			});
		},
		post : function (context) {
			var form = context.payload.user;

			context.data.upsert.User(form.id).then(function (user) {
				form.email = form.email ? form.email.trim().toLowerCase() : null;
				form.password = form.password ? md5(form.password.trim().toLowerCase()) : user.password;
				user.type = null;

				if (context.bearer.auth.body.type === 'admin') {
					if (form.type === 'admin' || form.type === 'tenant') {
						user.type = form.type;
					} else {
						form.type = 'admin';
					}
				}

				if (context.bearer.auth.body.type === 'tenant') {
					form.type = 'tenant';
					form.tenant = context.bearer.auth.body.tenant.id;
				}

				anxeb.utils.data.populate(user, form);

				context.data.find.User({
					email : form.email
				}).then(function (rep_email) {
					if (!rep_email || rep_email._id.equals(user._id)) {
						user.persist().then(function (user) {
							context.send(user.toClient());
						});
					} else {
						context.log.exception.selected_name_unavailable.args('Correo').include({
							fields : [{ name : 'email', index : 1 }]
						}).throw(context);
					}
				});
			});
		}
	},
	childs  : {
		item : {
			url     : '/:userId',
			methods : {
				get    : function (context) {
					context.data.retrieve.User(context.params.userId).then(function (user) {
						if (user) {
							context.send(user.toClient());
						} else {
							context.log.exception.record_not_found.args('Usuario', context.params.userId).throw(context);
						}
					});
				},
				delete : function (context) {
					context.data.delete.User(context.params.userId).then(function () {
						context.ok();
					});
				}
			}
		}
	}
};