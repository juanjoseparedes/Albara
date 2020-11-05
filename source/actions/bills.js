'use strict';
var anxeb = require('anxeb');
const Bill = require('../middleware/bill');
var types = require('../models/user').types;

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['admin', 'tenant'],
	roles   : ['administrator'],
	methods : {
		get : function (context) {
			let $bill = new Bill(context);

			$bill.list({
				provider    : context.query.provider,
				institution : context.query.institution,
				trace       : { year : context.query.year, month : context.query.month }
			}).then(function (bills) {
				context.send(bills.toClient());
			}).catch(function (err) {
				context.log.exception.bill_request_error.args(err).throw(context);
			});
		}
	},
	childs  : {
		process : {
			url     : 'process/:billId',
			methods : {
				post : function (context) {
					let $bill = new Bill(context);

					$bill.load(context.params.billId).then(function () {

						$bill.process().then(function (bill) {
							context.send(bill.toClient());
						}).catch(function (err) {
							context.log.exception.bill_request_error.args(err).throw(context);
						});

					}).catch(function (err) {
						context.log.exception.bill_request_error.args(err).throw(context);
					});
				}
			}
		},
		item    : {
			url     : '/:billId',
			methods : {
				get : function (context) {
					let $bill = new Bill(context);

					$bill.load(context.params.billId).then(function (bill) {
						context.send(bill.toClient());
					}).catch(function (err) {
						context.log.exception.bill_request_error.args(err).throw(context);
					});
				}
			}
		}
	}
};