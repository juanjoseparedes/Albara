'use strict';
var anxeb = require('anxeb');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin'],
	roles   : ['administrator'],
	methods : {
		get  : function (context) {
			context.data.list.Institution(context.query.ids ? {
				_id : {
					$in : context.query.ids
				}
			} : null, ['categories']).then(function (institutions) {
				context.send(institutions.toClient());
			});
		},
		post : function (context) {
			var form = context.payload.institution;
			context.data.upsert.Institution(form.id, form).then(function (institution) {
				institution.persist().then(function (institution) {
					context.send(institution.toClient());
				});
			});
		}
	},
	childs  : {
		item : {
			url     : '/:institutionId',
			methods : {
				get    : function (context) {
					context.data.retrieve.Institution(context.params.institutionId).then(function (institution) {
						if (institution) {
							context.send(institution.toClient());
						} else {
							context.log.exception.record_not_found.args('Centro', context.params.institutionId).throw(context);
						}
					});
				},
				delete : function (context) {
					context.data.delete.Institution(context.params.institutionId).then(function () {
						context.ok();
					});
				}
			}
		}
	}
};