'use strict';
var anxeb = require('anxeb');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin'],
	roles   : ['administrator'],
	methods : {
		get : function (context) {
			context.data.list.Product({
				_id : {
					$in : context.query.ids
				}
			}, ['vat.root.id', 'vat.value.id', 'unit.root.id', 'unit.value.id']).then(function (products) {
				context.send(products.toClient());
			});
		}
	}
};