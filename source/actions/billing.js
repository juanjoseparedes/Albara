'use strict';
let anxeb = require('anxeb');
const Bill = require('../middleware/bill');
const Helpers = require('../middleware/helpers');
const puppeteer = require('puppeteer');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['tenant'],
	roles   : ['administrator'],
	methods : {},
	childs  : {
		preview : {
			type    : anxeb.Route.types.view,
			methods : {
				//TODO: THIS SHOULD BE NORMIALIZED (TOO MUCH CODE)
				get : function (context) {
					let $bill = new Bill(context);

					let sendPreviewReport = function () {
						let data = $bill.instance.toClient();

						var toNumber = Helpers.number();

						context.res.set('totals-excent', toNumber(data.totals.excent));
						context.res.set('totals-graven', toNumber(data.totals.graven));
						context.res.set('totals-amount', toNumber(data.totals.amount));
						context.res.set('totals-taxes', toNumber(data.totals.taxes));
						context.res.set('totals-taxsum', toNumber(data.totals.taxsum));
						context.res.set('totals-cost', toNumber(data.totals.cost));
						context.res.set('totals-total', toNumber(data.totals.total));
						context.res.set('bill-id', data.id);

						context.render(data, '/templates/reports/bill/bill.hbs', {
							helpers : {
								if                   : Helpers.if(),
								monthName            : Helpers.monthName(),
								date                 : Helpers.date(),
								number               : toNumber,
								providerIdentityType : Helpers.identityType(data.provider.identity),
								clientIdentityType   : Helpers.identityType(data.client.identity),
								barcode              : Helpers.barcode(data.code || data.trace.year),
								logo                 : Helpers.logos(context, 'providers', data.provider.id)
							}
						});
					};

					if (context.query.bill != null) {
						$bill.load(context.query.bill).then(function () {

							if (context.query.sheets) {
								$bill.include(context.query.sheets).then(function (bill) {
									if (context.query.action === 'save') {
										$bill.persist().then(function (bill) {
											sendPreviewReport();
										}).catch(function (err) {
											context.log.exception.bill_request_error.args(err).throw(context);
										});
									} else if (context.query.action === 'preview') {
										sendPreviewReport();
									}
								}).catch(function (err) {
									context.log.exception.bill_request_error.args(err).throw(context);
								});
							} else {
								if (context.query.action === 'save') {
									$bill.persist().then(function (bill) {
										sendPreviewReport();
									}).catch(function (err) {
										context.log.exception.bill_request_error.args(err).throw(context);
									});
								} else if (context.query.action === 'preview') {
									sendPreviewReport();
								} else if (context.query.action === 'print' || context.query.action === 'download') {

									var data = $bill.instance.toClient();
									context.service.renderer.compile('/templates/reports/bill/bill.hbs', data, {
										helpers : {
											if                   : Helpers.if(),
											finalSheet           : data.trace.number + data.sheets.length,
											monthName            : Helpers.monthName(),
											date                 : Helpers.date(),
											number               : Helpers.number(),
											providerIdentityType : Helpers.identityType(data.provider.identity),
											clientIdentityType   : Helpers.identityType(data.client.identity),
											barcode              : Helpers.barcode(data.code || data.trace.year),
											logo                 : Helpers.logos(context, 'providers', data.provider.id)
										}
									}).then(function (html) {
										let pdfFilePath = context.service.locate.storage('admin', 'billing', $bill.instance.id + '.pdf');

										(async () => {
											try {
												let browser = await puppeteer.launch({ args : ['--no-sandbox'] });
												let page = await browser.newPage();
												await page.setContent(html);
												await page.pdf({ path : pdfFilePath, format : 'A4', printBackground : true });
												await browser.close();

												context.file(pdfFilePath, {
													headers : context.query.action === 'download' ? {
														'Content-Disposition' : 'attachment;filename=' + data.code + '.pdf'
													} : {}
												});
											} catch (err) {
												context.log.exception.report_rendering_error.args(err).throw(context);
											}
										})();

									});
								}
							}
						}).catch(function (err) {
							context.log.exception.bill_request_error.args(err).throw(context);
						});
					} else {
						$bill.create({
							provider    : context.query.provider,
							institution : context.query.institution,
							timestamp   : { year : context.query.year, month : context.query.month }
						}).then(function () {
							$bill.include(context.query.sheets).then(function (bill) {
								if (context.query.action === 'save') {
									$bill.persist().then(function (bill) {
										sendPreviewReport();
									}).catch(function (err) {
										context.log.exception.bill_request_error.args(err).throw(context);
									});
								} else if (context.query.action === 'preview') {
									sendPreviewReport();
								}
							}).catch(function (err) {
								context.log.exception.bill_request_error.args(err).throw(context);
							});
						}).catch(function (err) {
							context.log.exception.bill_request_error.args(err).throw(context);
						});
					}
				}
			}
		}
	}
};