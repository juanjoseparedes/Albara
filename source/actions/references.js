'use strict';
var anxeb = require('anxeb');
let ObjectId = require('anxeb.mongoose').ObjectId;

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	roles   : ['*'],
	methods : {
		get  : function (context) {
			var query = {};

			if (context.query.lookup) {
				query.name = {
					$regex   : context.query.lookup,
					$options : 'i'
				};
			}

			if (context.query.type != null && context.query.childs != null) {
				query.type = context.query.type;
				query.parent = context.query.parent ? ObjectId(context.query.parent) : null;

				context.data.aggregate.Reference([
					{ $match : query },
					{ $unwind : { path : '$References', preserveNullAndEmptyArrays : true } },
					{ $lookup : { from : 'References', localField : '_id', foreignField : 'parent', as : 'childs' } },
					{
						$project : {
							_id    : 0,
							id     : '$_id',
							name   : '$name',
							type   : '$type',
							meta   : '$meta',
							parent : '$parent',
							childs : context.query.childs === 'count' ? { $size : '$childs' } : '$childs'
						}
					}
				]).then(function (references) {
					context.send(references);
				});
			} else {
				if (context.query.parent || context.query.type) {
					if (context.query.parent !== 'any') {
						query.parent = context.query.parent ? context.query.parent : null;
					}
					if (context.query.type) {
						query.type = context.query.type;
					}

					context.data.list.Reference(query).then(function (references) {
						context.send(references.toClient());
					});
				} else {
					context.log.exception.invalid_request.throw(context);
				}
			}
		},
		post : function (context) {
			var form = context.payload.reference;
			context.data.retrieve.Reference(form.id).then(function (reference) {
				if (!reference) {
					reference = context.data.create.Reference();
				}

				if (form.name) {
					anxeb.utils.data.populate(reference, form);
					if (reference.name) {
						reference.name = reference.name.trim();
					}
					reference.meta = form.meta || {};
					reference.persist().then(function (reference) {
						context.send(reference.toClient());
					});
				} else if (form.names && form.names.length) {
					let saves = [];
					for (var i = 0; i < form.names.length; i++) {
						var name = form.names[i];
						if (name != null && name.length > 0) {
							let fc = {
								name   : name.trim(),
								type   : form.type,
								parent : form.parent,
								meta   : {}
							};
							let reference = context.data.create.Reference(fc);
							saves.push(reference.persist());
						}
					}
					Promise.all(saves).then(function () {
						context.ok();
					}).catch(function (err) {
						context.log.exception.invalid_request.throw(context);
					});
				} else {
					context.log.exception.data_validation_exception.include({
						fields : [{ name : 'name', index : 1 }]
					}).throw(context);
				}
			});
		}
	},
	childs  : {
		item : {
			url     : '/:referenceId',
			methods : {
				get    : function (context) {
					context.data.retrieve.Reference(context.params.referenceId).then(function (reference) {
						if (reference) {
							if (context.query.childs === 'items') {
								context.data.list.Reference({ parent : context.params.referenceId }).then(function (childs) {
									context.send(reference.toClient(childs));
								});
							} else if (context.query.childs === 'all') {
								context.data.aggregate.Reference([
									{ $match : { parent : ObjectId(context.params.referenceId) } },
									{ $unwind : { path : '$References', preserveNullAndEmptyArrays : true } },
									{ $lookup : { from : 'References', localField : '_id', foreignField : 'parent', as : 'childs' } },
									{
										$project : {
											_id    : 0,
											id     : '$_id',
											name   : '$name',
											type   : '$type',
											meta   : '$meta',
											parent : '$parent',
											childs : { $size : '$childs' }
										}
									}
								]).then(function (childs) {
									context.send(reference.toClient(childs));
								});
							} else {
								context.send(reference.toClient());
							}
						} else {
							context.log.exception.record_not_found.args('Referencia', context.params.referenceId).throw(context);
						}
					});
				},
				select : function (item) {

				},
				delete : function (context) {
					context.data.delete.Reference(context.params.referenceId).then(function () {
						context.ok();
					});
				}
			}
		}
	}
};