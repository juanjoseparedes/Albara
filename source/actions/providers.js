'use strict';
var anxeb = require('anxeb');
var types = require('../models/user').types;

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin', 'tenant'],
	roles   : ['administrator'],
	methods : {
		get  : function (context) {
			var query = {};

			if (context.bearer.auth.body.type === types.admin) {
				if (context.query.tenant) {
					query.tenant = context.query.tenant;
				}
			} else {
				query.tenant = context.bearer.auth.body.tenant.id;
			}

			context.data.list.Provider(query, ['institutions']).then(function (providers) {
				context.send(providers.toClient());
			});
		},
		post : function (context) {
			var form = context.payload.provider;
			context.data.upsert.Provider(form.id, form).then(function (provider) {
				provider.persist().then(function (provider) {

					if (form.images.logo) {
						context.service.storage.save(anxeb.utils.path.join('providers', provider.id, 'logo.image'), form.images.logo);
					}

					context.send(provider.toClient());
				});
			});
		}
	},
	childs  : {
		item : {
			url     : '/:providerId',
			methods : {
				get    : function (context) {
					context.data.retrieve.Provider(context.params.providerId, ['institutions']).then(function (provider) {
						if (provider) {
							context.send(provider.toClient());
						} else {
							context.log.exception.record_not_found.args('Proveedor', context.params.providerId).throw(context);
						}
					});
				},
				delete : function (context) {
					context.data.delete.Provider(context.params.providerId).then(function () {
						context.ok();
					});
				}
			}
		}
	}
};