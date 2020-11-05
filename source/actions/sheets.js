'use strict';
const anxeb = require('anxeb');
const Sheet = require('../middleware/sheet');
const Helpers = require('../middleware/helpers');
const puppeteer = require('puppeteer');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin', 'tenant'],
	roles   : ['administrator'],
	methods : {
		get : function (context) {
			let query = context.query;
			let $sheet = new Sheet(context);

			$sheet.list({
				provider    : query.provider,
				institution : query.institution,
				category    : query.category,
				timestamp   : { year : query.year, month : query.month, day : query.day },
				printed     : query.printed != null ? (query.printed === 'true') : null
			}).then(function (sheets) {
				context.send(sheets.toClient());
			}).catch(function (err) {
				context.log.exception.sheet_request_error.args(err).throw(context);
			});
		}
	},
	childs  : {
		ration : {
			methods : {
				post : function (context) {
					let $sheet = new Sheet(context);
					let form = context.payload.ration;

					$sheet.upsert({
						provider    : form.provider,
						institution : form.institution,
						category    : form.category,
						timestamp   : form.timestamp
					}).then(function (sheet) {
						if (form.article != null) {
							if (form.quantity != null) {
								$sheet.include({
									article  : form.article,
									quantity : form.quantity
								}).then(function (sheet) {
									context.send(sheet.toClient());
								}).catch(function (err) {
									context.log.exception.sheet_request_error.args(err).throw(context);
								});
							} else {
								$sheet.exclude({
									article : form.article
								}).then(function (sheet) {
									context.send(sheet.toClient());
								}).catch(function (err) {
									context.log.exception.sheet_request_error.args(err).throw(context);
								});
							}
						} else {
							context.send(sheet.toClient());
						}
					}).catch(function (err) {
						context.log.exception.sheet_request_error.args(err).throw(context);
					});
				}
			}
		},
		print  : {
			methods : {
				post : function (context) {
					let $sheet = new Sheet(context);
					let form = context.payload.sheet;

					$sheet.upsert({
						provider    : form.provider,
						institution : form.institution,
						category    : form.category,
						timestamp   : form.timestamp
					}).then(function (sheet) {
						$sheet.print().then(function (sheet) {
							context.send(sheet.toClient());
						}).catch(function (err) {
							context.log.exception.sheet_request_error.args(err).throw(context);
						});
					}).catch(function (err) {
						context.log.exception.sheet_request_error.args(err).throw(context);
					});
				}
			}
		},
		report : {
			url     : '/:sheetId/report',
			methods : {
				get : function (context) {

					let $sheet = new Sheet(context);
					$sheet.retrieve(context.params.sheetId).then(function (sheet) {
						let data = sheet.toClient();

						context.service.renderer.compile('/templates/reports/sheet/sheet.hbs', data, {
							helpers : {
								if           : Helpers.if(),
								monthName    : Helpers.monthName(),
								date         : Helpers.date(),
								number       : Helpers.number(),
								identityType : Helpers.identityType(data.provider.identity),
								barcode      : Helpers.barcode(data.code),
								logo         : Helpers.logos(context, 'sheets', data.id)
							}
						}).then(function (html) {
							let pdfFilePath = context.service.locate.storage('admin', 'reports', context.params.sheetId + '.pdf');

							(async () => {
								try {
									let browser = await puppeteer.launch({ args : ['--no-sandbox'] });
									let page = await browser.newPage();
									await page.setContent(html);
									await page.pdf({ path : pdfFilePath, format : 'A4', printBackground : true });
									await browser.close();

									context.file(pdfFilePath, {
										headers : context.query.download === 'true' ? {
											'Content-Disposition' : 'attachment;filename=' + data.code + '.pdf'
										} : {}
									});
								} catch (err) {
									context.log.exception.report_rendering_error.args(err).throw(context);
								}
							})();
						});
					}).catch(function (err) {
						context.log.exception.sheet_request_error.args(err).throw(context);
					});
				}
			}
		}
	}
};