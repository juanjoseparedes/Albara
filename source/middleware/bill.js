'use strict';
const anxeb = require('anxeb');
const moment = require('moment');

module.exports = function (context) {
	let _self = this;
	let _context = context;
	let _tenant = context.bearer.auth.body.type === 'tenant' ? context.bearer.auth.body.tenant.id : null;
	_self.instance = null;

	_self.include = function (ids) {
		return new Promise(function (resolve, reject) {
			if (_self.instance && _self.instance.sheets && ids instanceof Array && ids.length > 0) {
				if (_self.instance.dates.printed != null) {
					reject(context.log.exception.bill_already_printed.toError());
				} else {
					_context.data.list.Sheet({
						_id : { $in : ids }
					}).then(function (sheets) {
						_self.instance.sheets = sheets.map(function (sheet) {
							return {
								reference  : sheet.id,
								dates      : sheet.dates,
								timestamp  : sheet.timestamp,
								identities : sheet.identities,
							}
						});

						let billDetails = {};

						let monetize = function (value) {
							return Number(parseFloat(value).toFixed(2));
						};

						for (let s = 0; s < sheets.length; s++) {
							let sheet = sheets[s];
							let noBilling = sheet.billing == null || sheet.billing.id == null;
							let sameTenant = sheet.tenant.id.equals(_self.instance.tenant.id);
							let sameProvider = sheet.provider.id.equals(_self.instance.provider.id);
							let sameInstitution = sheet.institution.id.equals(_self.instance.institution.id);

							if (noBilling && sameTenant && sameProvider && sameInstitution) {

								for (let d = 0; d < sheet.details.length; d++) {
									let sheetDetail = sheet.details[d];
									let tax = monetize(sheetDetail.product.vat.value && sheetDetail.product.vat.value.meta && sheetDetail.product.vat.value.meta.vat ? sheetDetail.product.vat.value.meta.vat.value : 0);

									//precio base del producto
									let amount = monetize(sheetDetail.article.prices[sheet.institution.type]);
									//impuesto del monto del producto
									let taxes = monetize(amount * monetize(tax / 100));
									//impuesto del monto * cantidad
									let taxsum = taxes;
									//precio base * cantidad
									let cost = amount;
									//total producto * cantidad
									let total = monetize(amount + taxes);

									let billDetail = billDetails[sheetDetail.article.id] || {
										category : sheet.category,
										article  : sheetDetail.article,
										group    : sheetDetail.group,
										product  : sheetDetail.product,
										quantity : 0,
										price    : {
											type   : sheet.institution.type,
											amount : amount,
											taxes  : taxes,
											taxsum : taxsum,
											cost   : cost,
											total  : total,
										}
									};
									billDetail.quantity = monetize(billDetail.quantity + sheetDetail.quantity);
									billDetails[sheetDetail.article.id] = billDetail;
								}
							}
						}

						_self.instance.details = [];
						let totals = {
							excent : 0,
							graven : 0,
							amount : 0,
							taxes  : 0,
							taxsum : 0,
							cost   : 0,
							total  : 0
						};

						for (let key in billDetails) {
							var finalDetail = billDetails[key];
							finalDetail.price.taxsum = monetize(finalDetail.price.taxsum * finalDetail.quantity);
							finalDetail.price.cost = monetize(finalDetail.price.cost * finalDetail.quantity);
							finalDetail.price.total = monetize(finalDetail.price.total * finalDetail.quantity);

							totals.excent = monetize(totals.excent + (finalDetail.price.taxes === 0 ? finalDetail.price.cost : 0));
							totals.graven = monetize(totals.graven + (finalDetail.price.taxes > 0 ? finalDetail.price.cost : 0));

							totals.amount = monetize(totals.amount + finalDetail.price.amount);
							totals.taxes = monetize(totals.taxes + finalDetail.price.taxes);
							totals.taxsum = monetize(totals.taxsum + finalDetail.price.taxsum);
							totals.cost = monetize(totals.cost + finalDetail.price.cost);
							totals.total = monetize(totals.total + finalDetail.price.total);

							_self.instance.details.push(finalDetail);
						}

						_self.instance.totals = totals;

						resolve(_self.instance);
					}).catch(reject);
				}
			} else {
				reject(context.log.exception.record_not_found.args('Factura').toError());
			}
		});
	};

	let getLocation = function (entity) {
		let location = {
			region   : entity.location.root,
			province : null,
			city     : null,
			address  : entity.address
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

	let build = function (params) {
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

		let data = {
			tenant      : tenant,
			provider    : provider,
			institution : institution,
			trace       : params.trace,
			identities  : {
				global      : null,
				provider    : null,
				institution : null,
			},
			client      : params.client,
			dates       : params.dates,
			details     : params.details,
			sheets      : params.sheets,
			totals      : params.totals
		};
		return _context.data.create.Bill(data);
	};

	_self.create = function (params) {
		return new Promise(function (resolve, reject) {
			let tenant = _tenant || params.tenant || undefined;

			if (tenant) {
				_context.data.retrieve.Tenant(tenant).then(function (tenant) {
					if (tenant) {
						_context.data.retrieve.Provider(params.provider).then(function (provider) {
							if (provider) {
								_context.data.retrieve.Institution(params.institution).then(function (institution) {
									if (institution) {

										let references = [
											_context.data.retrieve.Reference(tenant.location.value.id, 'parent'),
											_context.data.retrieve.Reference(provider.location.value.id, 'parent'),
											_context.data.retrieve.Reference(institution.location.value.id, 'parent'),
										];

										Promise.all(references).then(function (values) {

											let data = {
												tenant      : tenant.toClient(),
												provider    : provider.toClient(),
												institution : institution.toClient(),
												trace       : {
													year   : params.timestamp.year,
													month  : params.timestamp.month,
													number : 15000000
												},
												client      : {
													name     : 'INSTITUTO NACIONAL DE BIENESTAR ESTUDIANTIL',
													identity : {
														type   : 'rnc',
														number : '401-50561-4'
													},
												},
												dates       : {
													updated : anxeb.utils.date.now(),
													printed : null,
													valid   : moment().month(11).date(31)
												},
												details     : [],
												sheets      : [],
												totals      : {
													amount : 0,
													taxes  : 0
												}
											};

											data.tenant.location.value = values[0] ? values[0].toClient() : data.tenant.location.value;
											data.provider.location.value = values[1] ? values[1].toClient() : data.provider.location.value;
											data.institution.location.value = values[2] ? values[2].toClient() : data.institution.location.value;

											_self.instance = build(data);
											resolve(_self.instance);
										}).catch(reject);

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

			if (query.trace) {
				if (query.trace.year) {
					params['trace.year'] = query.trace.year;
				}

				if (query.trace.month) {
					params['trace.month'] = query.trace.month;
				}
			}

			if (query.printed != null) {
				params['dates.printed'] = query.printed === true ? { $ne : null } : null;
			}
			_context.data.list.Bill(params).then(function (bills) {
				resolve(bills);
			}).catch(reject);
		});
	};

	_self.load = function (id) {
		return new Promise(function (resolve, reject) {
			_context.data.retrieve.Bill(id).then(function (bill) {
				if (bill) {
					_self.instance = bill;
					resolve(bill)
				} else {
					reject(context.log.exception.record_not_found.args('Factura').toError());
				}
			}).catch(reject);
		});
	};

	_self.persist = function (force) {
		return new Promise(function (resolve, reject) {
			if ((force == null || force === false) && _self.instance.dates.printed != null) {
				reject(context.log.exception.bill_already_printed.toError());
			} else {
				_self.instance.persist().then(function (bill) {
					//TODO: BULK UPDATE ALL SHEETS.BILLING REFERENCES WITH BILLED SHEETS

					_context.service.storage.fetch(anxeb.utils.path.join('providers', _self.instance.provider.id.toString(), 'logo.image')).then(function (data) {
						_context.service.storage.save(anxeb.utils.path.join('bills', _self.instance.id.toString(), 'logo.image'), data);
					}).catch(function (err) {
						//ignore
					}).finally(function () {
						resolve(_self.instance);
					});
				}).catch(reject);
			}
		});
	};

	_self.process = function () {
		return new Promise(function (resolve, reject) {
			if (_self.instance && _self.instance.details && _self.instance.details.length > 0) {
				if (_self.instance.dates.printed != null) {
					reject(context.log.exception.bill_already_printed.toError());
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
										value  : 15000010
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
						nextIdentity('global_bill'),
						nextIdentity('provider_bill', _self.instance.provider.id),
						nextIdentity('institution_bill', _self.instance.institution.id),
					];

					Promise.all(identities).then(function (values) {
						if (values[0] == null || values[1] == null || values[2] == null) {
							reject(context.log.exception.bill_identitiy_error.toError());
						} else {
							_self.instance.identities.global = values[0].value;
							_self.instance.identities.provider = values[1].value;
							_self.instance.identities.institution = values[2].value;
							_self.instance.dates.printed = anxeb.utils.date.now();

							//TODO: THIS HAS TO BE EXTRACTED FROM A NUMERICAL RANGE FOR EACH PROVIDER
							_self.instance.trace.number = _self.instance.identities.global;

							_self.persist(true).then(resolve).catch(reject);
						}
					}).catch(reject);
				}
			} else {
				reject(context.log.exception.bill_empty.toError());
			}
		});
	};
};