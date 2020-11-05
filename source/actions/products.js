'use strict';
var anxeb = require('anxeb');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin'],
	roles   : ['administrator'],
	methods : {
		get  : function (context) {
			var query = {};

			if (context.query.ids) {
				query._id = {
					$in : context.query.ids
				}
			}

			if (context.query.lookup) {
				query.$or = [{
					name : {
						$regex   : context.query.lookup,
						$options : 'i'
					}
				}, {
					code : {
						$regex   : context.query.lookup,
						$options : 'i'
					}
				}];
			}

			context.data.list.Product(query).then(function (products) {
				context.send(products.toClient());
			});
		},
		post : function (context) {
			var form = context.payload.product;
			context.data.upsert.Product(form.id, form).then(function (product) {
				product.persist().then(function (product) {
					context.send(product.toClient());
				});
			});
		}
	},
	childs  : {
		item : {
			url     : '/:productId',
			methods : {
				get    : function (context) {
					context.data.retrieve.Product(context.params.productId).then(function (product) {
						if (product) {
							context.send(product.toClient());
						} else {
							context.log.exception.record_not_found.args('Producto', context.params.productId).throw(context);
						}
					});
				},
				delete : function (context) {
					context.data.delete.Product(context.params.productId).then(function () {
						context.ok();
					});
				}
			}
		}
	}
};