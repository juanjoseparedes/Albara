'use strict';
var anxeb = require('anxeb');
var lic_enums = require('../models/provider').enums;
var userStates = require('../models/user').states;
var userTypes = require('../models/user').types;

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin'],
	roles   : ['administrator'],
	methods : {
		get  : function (context) {
			context.data.list.Tenant(context.query.state ? { state : context.query.state } : undefined).then(function (tenants) {
				context.send(tenants.toClient());
			});
		},
		post : function (context) {
			var form = context.payload.tenant;
			form.administrator.email = form.administrator.email ? form.administrator.email.trim().toLowerCase() : null;

			context.data.find.Tenant({
				'identity.type'   : form.identity.type,
				'identity.number' : form.identity.number
			}).then(function (rep_id) {
				if (!rep_id || rep_id._id.equals(form.id)) {
					form.state = undefined;
					context.data.upsert.Tenant(form.id, form).then(function (tenant) {
						var remark = {
							date : anxeb.utils.date.utc(),
							user : context.bearer.auth.body.identity
						};

						if (tenant.state == null) {
							tenant.state = 'new';
							tenant.remarks = [];
							remark.comment = 'Nuevo afiliado';
						} else {
							remark.comment = 'Afiliado actualizado';
						}

						remark.state = tenant.state;
						tenant.remarks.push(remark);

						tenant.persist().then(function (tenant) {
							context.send(tenant.toClient());
						});
					});
				} else {
					context.log.exception.selected_name_unavailable.args('Identidad ingresada').include({
						fields : [{ name : 'identity.number', index : 1 }]
					}).throw(context);
				}
			});
		}
	},
	childs  : {
		item : {
			url     : '/:tenantId',
			methods : {
				get : function (context) {
					context.data.retrieve.Tenant(context.params.tenantId).then(function (tenant) {
						if (tenant) {
							context.send(tenant.toClient());
						} else {
							context.log.exception.record_not_found.args('Afiliado', context.params.tenantId).throw(context);
						}
					});
				}
			},
			childs  : {
				activate   : {
					methods : {
						post : function (context) {
							var notes = context.payload.notes;
							context.data.retrieve.Tenant(context.params.tenantId).then(function (tenant) {
								if (tenant) {
									tenant.state = 'active';
									tenant.remarks.push({
										date    : anxeb.utils.date.utc(),
										user    : context.bearer.auth.body.identity,
										state   : tenant.state,
										comment : notes
									});
									tenant.persist().then(function (tenant) {
										context.send(tenant.toClient());
									});
								} else {
									context.log.exception.record_not_found.args('Afiliado', context.params.tenantId).throw(context);
								}
							});
						}
					}
				},
				inactivate : {
					methods : {
						post : function (context) {
							var notes = context.payload.notes;
							context.data.retrieve.Tenant(context.params.tenantId).then(function (tenant) {
								if (tenant) {
									tenant.state = 'inactive';
									tenant.remarks.push({
										date    : anxeb.utils.date.utc(),
										user    : context.bearer.auth.body.identity,
										state   : tenant.state,
										comment : notes
									});
									tenant.persist().then(function (tenant) {
										context.send(tenant.toClient());
									});
								} else {
									context.log.exception.record_not_found.args('Afiliado', context.params.tenantId).throw(context);
								}
							});
						}
					}
				},
				providers  : {
					methods : {
						get  : function (context) {
							var query = { tenant : context.params.tenantId };

							context.data.list.Provider(query, ['institutions', 'institutions.categories']).then(function (providers) {
								context.send(providers.toClient());
							});
						},
						post : function (context) {
							var form = context.payload.provider;
							context.data.retrieve.Tenant(context.params.tenantId).then(function (tenant) {
								if (tenant) {
									context.data.find.Provider({
										_id    : form.id,
										tenant : context.params.tenantId
									}).then(function (provider) {
										var pricing = context.application.pricing;
										var state = lic_enums.states.active;
										var module = lic_enums.modules[form.module];
										var plan = lic_enums.plans[form.plan];
										var period = lic_enums.periods[form.period];
										var type = lic_enums.types[form.type];

										var requiredFields = [];

										if (!module) {
											requiredFields.push({ name : 'module', index : 1 });
										}

										if (!plan) {
											requiredFields.push({ name : 'plan', index : 2 });
										}

										if (!period) {
											requiredFields.push({ name : 'billing.period', index : 3 });
										}

										if (!type) {
											requiredFields.push({ name : 'type', index : 4 });
										}

										if (requiredFields.length) {
											context.log.exception.data_validation_exception.include({
												fields : requiredFields
											}).throw(context);
											return;
										}

										var modulePrice = pricing.modules[module];
										var priceVariation = modulePrice.variations[period];

										if (provider == null) {
											provider = context.data.create.Provider({
												module      : module,
												plan        : plan,
												type        : type,
												issued_by   : context.bearer.auth.body.identity,
												issued_date : anxeb.utils.date.utc(),
												effect_date : anxeb.utils.date.utc().add(1, 'month'),
												expiry_date : anxeb.utils.date.utc().add(1, 'year'),
												billing     : {
													period     : period,
													fee        : anxeb.utils.money.normalize(modulePrice.plans[plan]),
													management : anxeb.utils.money.normalize(modulePrice.management),
													discount   : anxeb.utils.money.normalize(priceVariation < 1 ? (1.00 - priceVariation) : 0),
													surcharge  : anxeb.utils.money.normalize(priceVariation >= 1 ? (priceVariation - 1.00) : 0)
												},
												charges     : {
													installation : modulePrice.installation,
													decommission : modulePrice.decommission
												},
												remarks     : [{
													date  : anxeb.utils.date.utc(),
													user  : context.bearer.auth.body.identity,
													state : state,
													code  : 'REG',
													notes : 'Nuevo centro registrado por adminsitrador.',
												}],
												slot        : {
													key   : null,
													value : null,
												},
												state       : state,
												tenant      : context.params.tenantId,
											});
										}

										provider.persist().then(function (provider) {
											context.send(provider.toClient());
										});
									});
								} else {
									context.log.exception.record_not_found.args('Afiliado', context.params.tenantId).throw(context);
								}
							});
						}
					}
				},
				setadmin   : {
					methods : {
						put : function (context) {
							context.data.retrieve.Tenant(context.params.tenantId).then(function (tenant) {
								if (tenant) {
									context.data.find.User({
										email : tenant.administrator.email
									}).then(function (rep_email) {
										if (rep_email) {
											context.log.exception.prospect_account_registered.args(tenant.administrator.email).throw(context);
										} else {
											var user = context.data.create.User();
											user.first_name = tenant.administrator.first_names;
											user.last_name = tenant.administrator.last_names;
											user.email = tenant.administrator.email;
											user.password = tenant.administrator.password;
											user.role = 'administrator';
											user.state = userStates.active;
											user.type = userTypes.tenant;
											user.tenant = tenant.id;

											user.persist().then(function (user) {
												context.send(user.toClient());
											});
										}
									});
								} else {
									context.log.exception.record_not_found.args('Afiliado', context.params.tenantId).throw(context);
								}
							});
						}
					}
				}
			}
		}
	}
};