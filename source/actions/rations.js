'use strict';
var anxeb = require('anxeb');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin'],
	roles   : ['administrator'],
	methods : {
		get  : function (context) {
			context.data.list.Ration({
				provider    : context.query.provider != null ? context.query.provider : undefined,
				institution : context.query.institution != null ? context.query.institution : undefined
			}, []).then(function (rations) {
				context.send(rations.toClient());
			});
		},
		post : function (context) {
			var form = context.payload.ration;
			var options = context.payload.options || {};

			var requiredFields = [];

			if (form.period == null || form.period.type == null) {
				requiredFields.push({ name : 'period', index : 1 });
			}

			if (form.category == null) {
				requiredFields.push({ name : 'category', index : 2 });
			}

			if (form.group == null) {
				requiredFields.push({ name : 'group', index : 3 });
			}

			if (form.article == null && form.articles == null) {
				requiredFields.push({ name : 'article', index : 4 });
			}

			if (form.period == null || form.period.quantity == null || form.period.quantity === '' || isNaN(form.period.quantity)) {
				requiredFields.push({ name : 'quantity', index : 5 });
			}

			if (requiredFields.length) {
				context.log.exception.data_validation_exception.include({
					fields : requiredFields
				}).throw(context);
				return;
			}

			var persist = function (params, article) {
				return new Promise(function (resolve, reject) {
					context.data.retrieve.Ration({
						tenant      : params.tenant,
						provider    : params.provider,
						institution : params.institution,
						category    : params.category,
						group       : params.group,
						article     : article,
					}).then(function (ration) {
						if (ration == null) {
							ration = context.data.create.Ration(params);
						}
						if (article != null) {
							ration.article = article;
						}

						ration.periods = ration.periods || [];

						var xperiod = ration.periods.filter(function (item) {
							return item.type === params.period.type
						})[0];

						var cqty = xperiod != null && xperiod.quantity != null ? anxeb.utils.money.normalize(xperiod.quantity) : 0;
						var nqty = anxeb.utils.money.normalize(params.period.quantity);

						if (xperiod != null) {
							if (options.replaceQuantity === true || options.replaceQuantity === 'true') {
								xperiod.quantity = nqty;
							} else {
								xperiod.quantity = cqty + nqty;
							}
						} else {
							ration.periods.push({
								type     : params.period.type,
								quantity : nqty
							});
						}

						return ration.persist().then(resolve).catch(reject);
					}).catch(reject);
				});
			};

			var saves = [];

			if (form.articles != null) {
				for (var a = 0; a < form.articles.length; a++) {
					saves.push(persist(form, form.articles[a]));
				}
			} else if (form.article != null) {
				saves.push(persist(form, form.article));
			} else {
				context.log.exception.invalid_request.throw(context);
			}

			Promise.all(saves).then(function () {
				context.ok();
			}).catch(function (err) {
				context.log.exception.invalid_request.throw(context);
			});
		}
	},
	childs  : {
		list : {
			methods : {
				get : function (context) {
					context.data.list.Ration().then(function (rations) {
						context.send(rations.toList());
					});
				},
			}
		},
		item : {
			url     : '/:rationId',
			methods : {
				get    : function (context) {
					context.data.retrieve.Ration(context.params.rationId).then(function (ration) {
						if (ration) {
							context.send(ration.toClient());
						} else {
							context.log.exception.record_not_found.args('Modalidad', context.params.rationId).throw(context);
						}
					});
				},
				delete : function (context) {
					context.data.delete.Ration(context.params.rationId).then(function () {
						context.ok();
					});
				}
			}
		}
	}
};