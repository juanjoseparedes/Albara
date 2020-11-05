'use strict';
const anxeb = require('anxeb');
const moment = require('moment');

module.exports = function (context) {
	let _self = this;
	let _context = context;
	let _tenant = context.bearer.auth.body.type === 'tenant' ? context.bearer.auth.body.tenant.id : null;
	_self.instance = null;

	let load = function (query) {
		return new Promise(function (resolve, reject) {
			let params = {
				'tenant.id'       : _tenant || query.tenant || undefined,
				'provider.id'     : query.provider,
				'institution.id'  : query.institution,
				'category.id'     : query.category,
				'timestamp.year'  : query.timestamp.year,
				'timestamp.month' : query.timestamp.month,
				'timestamp.day'   : query.timestamp.day
			};

			_context.data.retrieve.Sheet(params).then(function (sheet) {
				_self.instance = sheet;
				resolve(sheet)
			}).catch(reject);
		});
	};

	let getDetail = function (params) {
		return {
			article  : {
				id     : params.article._id,
				prices : params.article.prices
			},
			group    : {
				id   : params.group._id,
				name : params.group.name,
			},
			product  : {
				id          : params.article.product._id,
				name        : params.article.product.name,
				type        : params.article.product.type,
				description : params.article.product.description,
				code        : params.article.product.code,
				unit        : params.article.product.unit,
				vat         : params.article.product.vat
			},
			quantity : params.quantity
		};
	};

	_self.retrieve = function (id) {
		return new Promise(function (resolve, reject) {
			_context.data.retrieve.Sheet(id).then(function (sheet) {
				_self.instance = sheet;
				resolve(sheet)
			}).catch(reject);
		});
	};

	_self.include = function (params) {
		return new Promise(function (resolve, reject) {
			if (_self.instance && _self.instance.details) {
				if (_self.instance.dates.printed != null) {
					reject(context.log.exception.sheet_already_printed.toError());
				} else {
					let detail = _self.instance.details.filter(function (detail) {
						return detail.article.id.equals(params.article);
					})[0];

					if (detail) {
						detail.quantity = params.quantity;

						_self.instance.persist().then(function (sheet) {
							resolve(_self.instance);
						}).catch(reject);
					} else {
						_context.data.retrieve.Category(_self.instance.category.id, ['groups.articles.product']).then(function (category) {
							for (let g = 0; g < category.groups.length; g++) {
								let group = category.groups[g];

								for (let a = 0; a < group.articles.length; a++) {
									let article = group.articles[a];
									if (article._id.equals(params.article)) {

										_self.instance.details.push(getDetail({
											article  : article,
											group    : group,
											quantity : params.quantity
										}));

										_self.instance.persist().then(function (sheet) {
											resolve(_self.instance);
										}).catch(reject);
										return;
									}

								}
							}
							reject(context.log.exception.record_not_found.args('Artículo').toError());
						});
					}
				}
			} else {
				reject(context.log.exception.record_not_found.args('Conduce').toError());
			}
		});
	};

	_self.exclude = function (params) {
		return new Promise(function (resolve, reject) {
			if (_self.instance && _self.instance.details) {
				if (_self.instance.dates.printed != null) {
					reject(context.log.exception.sheet_already_printed.toError());
				} else {
					let detail = _self.instance.details.filter(function (detail) {
						return detail.article.id.equals(params.article);
					})[0];

					if (detail) {
						detail.quantity = params.quantity;

						_self.instance.details = _self.instance.details.filter(function (detail) {
							return !detail.article.id.equals(params.article);
						});

						_self.instance.persist().then(function (sheet) {
							resolve(_self.instance);
						}).catch(reject);
					} else {
						resolve(_self.instance);
					}
				}
			} else {
				reject(context.log.exception.record_not_found.args('Conduce').toError());
			}
		});
	};

	let getLocation = function (entity) {
		let location = {
			region  : entity.location.root,
			province : null,
			city    : null,
			address : entity.address
		};
		if (entity.location.value.type === 'city') {
			location.city = entity.location.value;
			location.province = entity.location.value.parent;
		} else if (entity.location.value.type === 'province') {
			location.province = entity.location.value;
		}

		delete location.region.parent;
		delete location.province.parent;
		if (location.city) {
			delete location.city.parent;
		}

		return location;
	};

	let persist = function (params) {
		return new Promise(function (resolve, reject) {

			let tenant = {
				id            : params.tenant.id,
				name          : params.tenant.name,
				alias         : params.tenant.alias,
				identity      : params.tenant.identity,
				administrator : params.tenant.administrator,
				location      : getLocation(params.tenant)
			};

			let provider = {
				id            : params.provider.id,
				name          : params.provider.name,
				identity      : params.provider.identity,
				code          : params.provider.code,
				phone         : params.provider.phone,
				email         : params.provider.email,
				administrator : params.provider.administrator,
				location      : getLocation(params.provider)
			};

			let institution = {
				id       : params.institution.id,
				name     : params.institution.name,
				type     : params.institution.type,
				identity : params.institution.identity,
				code     : params.institution.code,
				phone    : params.institution.phone,
				email    : params.institution.email,
				director : params.institution.director,
				location : getLocation(params.institution)
			};

			let category = {
				id          : params.category.id,
				name        : params.category.name,
				code        : params.category.code,
				description : params.category.description
			};

			let data = {
				tenant      : tenant,
				provider    : provider,
				institution : institution,
				category    : category,
				timestamp   : params.timestamp,
				identities  : {
					global      : null,
					category    : null,
					provider    : null,
					institution : null,
				},
				dates       : {
					updated : anxeb.utils.date.now(),
					printed : null,
				},
				details     : params.details
			};

			_self.instance = _context.data.create.Sheet(data);

			_self.instance.persist().then(function (sheet) {
				resolve(_self.instance);
			}).catch(reject);
		});
	};

	let dow = [
		{ simbol : 'DO', label : 'Domingo', key : 'sunday', free : true },
		{ simbol : 'LU', label : 'Lunes', key : 'monday', free : false },
		{ simbol : 'MA', label : 'Martes', key : 'tuesday', free : false },
		{ simbol : 'MI', label : 'Miércoles', key : 'wednesday', free : false },
		{ simbol : 'JU', label : 'Jueves', key : 'thursday', free : false },
		{ simbol : 'VI', label : 'Viernes', key : 'friday', free : false },
		{ simbol : 'SA', label : 'Sabado', key : 'saturday', free : true },
	];

	let fetch = function (params) {
		return new Promise(function (resolve, reject) {
			let tenant = _tenant || params.tenant || undefined;
			let datestamp = moment().startOf('day');
			datestamp.year(params.timestamp.year);
			datestamp.month(params.timestamp.month - 1);
			datestamp.date(params.timestamp.day);

			let period = {
				type : dow[datestamp.day()]
			};

			if (tenant) {
				_context.data.retrieve.Tenant(tenant).then(function (tenant) {
					if (tenant) {
						_context.data.retrieve.Provider(params.provider).then(function (provider) {
							if (provider) {
								_context.data.retrieve.Institution(params.institution).then(function (institution) {
									if (institution) {
										_context.data.retrieve.Category(params.category, ['groups.articles.product']).then(function (category) {
											if (category) {
												let references = [
													_context.data.retrieve.Reference(tenant.location.value.id, 'parent'),
													_context.data.retrieve.Reference(provider.location.value.id, 'parent'),
													_context.data.retrieve.Reference(institution.location.value.id, 'parent'),
													context.data.list.Ration({
														tenant      : tenant,
														provider    : params.provider,
														institution : params.institution,
														category    : params.category
													})
												];

												Promise.all(references).then(function (values) {
													let data = {
														tenant      : tenant.toClient(),
														provider    : provider.toClient(),
														institution : institution.toClient(),
														category    : category.toClient(),
														details     : [],
														timestamp   : params.timestamp
													};

													data.tenant.location.value = values[0] ? values[0].toClient() : data.tenant.location.value;
													data.provider.location.value = values[1] ? values[1].toClient() : data.provider.location.value;
													data.institution.location.value = values[2] ? values[2].toClient() : data.institution.location.value;

													let rations = values[3];

													if (rations) {
														for (let r = 0; r < rations.length; r++) {
															let ration = rations[r];

															let dperiod = ration.periods.filter(function (item) {
																return item.type === period.type.key
															})[0];

															if (dperiod) {
																let dgroup = category.groups.filter(function (item) {
																	return item._id.equals(ration.group);
																})[0];

																if (dgroup) {
																	let darticle = dgroup.articles.filter(function (item) {
																		return item._id.equals(ration.article);
																	})[0];

																	if (darticle) {
																		let detail = getDetail({
																			article  : darticle,
																			group    : dgroup,
																			quantity : dperiod.quantity
																		});
																		data.details.push(detail);
																	}
																}

															}
														}
													}

													resolve(data);
												}).catch(reject);
											} else {
												reject(_context.log.exception.record_not_found.args('Modalidad').toError());
											}
										});
									} else {
										reject(_context.log.exception.record_not_found.args('Centro').toError());
									}
								});
							} else {
								reject(_context.log.exception.record_not_found.args('Proveedor').toError());
							}
						});
					} else {
						reject(_context.log.exception.record_not_found.args('Afiliado').toError());
					}
				});
			} else {
				reject(context.log.exception.invalid_request.toError());
			}
		});
	};

	_self.upsert = function (query) {
		return new Promise(function (resolve, reject) {
			load(query).then(function (sheet) {
				if (sheet != null) {
					resolve(sheet);
				} else {
					fetch(query).then(function (data) {
						persist(data).then(resolve).catch(reject);
					}).catch(reject);
				}
			});
		});
	};

	_self.list = function (query) {
		return new Promise(function (resolve, reject) {
			let params = {
				'tenant.id'      : _tenant || query.tenant || undefined,
				'provider.id'    : query.provider,
				'institution.id' : query.institution,
			};

			if (query.category) {
				params['category.id'] = query.category;
			}

			if (query.timestamp) {
				if (query.timestamp.year) {
					params['timestamp.year'] = query.timestamp.year;
				}

				if (query.timestamp.month) {
					params['timestamp.month'] = query.timestamp.month;
				}

				if (query.timestamp.day) {
					params['timestamp.day'] = query.timestamp.day;
				}
			}

			if (query.printed != null) {
				params['dates.printed'] = query.printed === true ? { $ne : null } : null;
			}
			_context.data.list.Sheet(params).then(function (sheets) {
				resolve(sheets);
			}).catch(reject);
		});
	};

	_self.print = function () {
		return new Promise(function (resolve, reject) {
			if (_self.instance && _self.instance.details && _self.instance.details.length > 0) {
				if (_self.instance.dates.printed != null) {
					reject(context.log.exception.sheet_already_printed.toError());
				} else {
					let nextIdentity = function (type, id) {
						return new Promise(function (resolve, reject) {
							_context.data.find.Sequence(
								{ type : type, entity : id || null }
							).then(function (sequence) {

								if (sequence == null) {
									sequence = _context.data.create.Sequence({
										type   : type,
										entity : id || null,
										value  : 1750000
									});
								} else {
									sequence.value++;
								}

								sequence.persist().then(function (sq) {
									resolve(sq.toClient());
								}).catch(reject);
							}).catch(reject);
						});
					};

					let identities = [
						nextIdentity('global'),
						nextIdentity('category', _self.instance.category.id),
						nextIdentity('provider', _self.instance.provider.id),
						nextIdentity('institution', _self.instance.institution.id),
					];

					Promise.all(identities).then(function (values) {
						if (values[0] == null || values[1] == null || values[2] == null || values[3] == null) {
							reject(context.log.exception.sheet_identitiy_error.toError());
						} else {
							_self.instance.identities.global = values[0].value;
							_self.instance.identities.category = values[1].value;
							_self.instance.identities.provider = values[2].value;
							_self.instance.identities.institution = values[3].value;
							_self.instance.dates.printed = anxeb.utils.date.now();

							_self.instance.persist().then(function (sheet) {
								_context.service.storage.fetch(anxeb.utils.path.join('providers', _self.instance.provider.id.toString(), 'logo.image')).then(function (data) {
									_context.service.storage.save(anxeb.utils.path.join('sheets', _self.instance.id.toString(), 'logo.image'), data);
									resolve(_self.instance);
								}).catch(function (err) {
									//ignore
								}).finally(function () {
									resolve(_self.instance);
								});
							}).catch(reject);
						}
					}).catch(reject);
				}
			} else {
				reject(context.log.exception.sheet_empty.toError());
			}
		});
	};
};