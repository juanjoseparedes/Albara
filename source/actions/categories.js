'use strict';
var anxeb = require('anxeb');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin', 'tenant'],
	roles   : ['administrator'],
	methods : {
		get  : function (context) {
			context.data.list.Category(context.query.ids ? {
				_id : {
					$in : context.query.ids
				}
			} : null, ['groups.articles.product']).then(function (categories) {
				context.send(categories.toClient());
			});
		},
		post : function (context) {
			var form = context.payload.category;
			context.data.upsert.Category(form.id, form).then(function (category) {
				category.persist().then(function (category) {
					context.send(category.toClient());
				});
			});
		}
	},
	childs  : {
		list : {
			methods : {
				get : function (context) {
					context.data.list.Category().then(function (categories) {
						context.send(categories.toList());
					});
				},
			}
		},
		item : {
			url     : '/:categoryId',
			methods : {
				get    : function (context) {
					context.data.retrieve.Category(context.params.categoryId).then(function (category) {
						if (category) {
							context.send(category.toClient());
						} else {
							context.log.exception.record_not_found.args('Modalidad', context.params.categoryId).throw(context);
						}
					});
				},
				delete : function (context) {
					context.data.delete.Category(context.params.categoryId).then(function () {
						context.ok();
					});
				}
			}
		}
	}
};