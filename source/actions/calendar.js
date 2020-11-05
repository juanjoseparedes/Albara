'use strict';
var anxeb = require('anxeb');
var moment = require('moment');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['tenant'],
	roles   : ['administrator'],
	methods : {},
	childs  : {
		days : {
			methods : {
				get : function (context) {
					var date = moment().startOf('day');
					var today = moment().startOf('day');

					var month = context.query.month ? parseInt(context.query.month) : moment().month() + 1;
					var year = context.query.year ? parseInt(context.query.year) : moment().year();

					if (year < 2019) {
						year = 2019;
					}

					if (year > moment().year() + 1) {
						year = moment().year() + 1;
					}

					if (month < 1) {
						month = 1;
					}

					if (month > 12) {
						month = 12;
					}

					if (year > moment().year()) {
						year = moment().year();
					}

					date.month(month - 1);
					date.year(year);

					var freedays = [
						{ year : 2019, month : 1, day : 1 },
						{ year : 2019, month : 1, day : 6 },
						{ year : 2019, month : 1, day : 21 },
						{ year : 2019, month : 1, day : 26 },
						{ year : 2019, month : 2, day : 27 },
						{ year : 2019, month : 4, day : 19 },
						{ year : 2019, month : 4, day : 29 },
						{ year : 2019, month : 6, day : 20 },
						{ year : 2019, month : 8, day : 16 },
						{ year : 2019, month : 9, day : 24 },
						{ year : 2019, month : 11, day : 4 },
						{ year : 2019, month : 12, day : 25 },
					];

					var isFree = function (day) {
						for (var i = 0; i < freedays.length; i++) {
							var fd = freedays[i];
							if (fd.year === year && fd.month === month && fd.day === day) {
								return true;
							}
						}
						return false;
					};

					var days = [];
					var dayCount = date.daysInMonth();
					var todayDay = today.date();
					var todayYear = today.year();
					var todayMonth = today.month() + 1;

					var dow = [
						{ simbol : 'DO', label : 'Domingo', key : 'sunday', free : true },
						{ simbol : 'LU', label : 'Lunes', key : 'monday', free : false },
						{ simbol : 'MA', label : 'Martes', key : 'tuesday', free : false },
						{ simbol : 'MI', label : 'Miércoles', key : 'wednesday', free : false },
						{ simbol : 'JU', label : 'Jueves', key : 'thursday', free : false },
						{ simbol : 'VI', label : 'Viernes', key : 'friday', free : false },
						{ simbol : 'SA', label : 'Sabado', key : 'saturday', free : true },
					];

					for (var d = 1; d <= dayCount; d++) {
						var ndate = moment().startOf('day');
						ndate.year(year);
						ndate.month(month - 1);
						ndate.date(d);
						var type = dow[ndate.day()];

						days.push({
							date : ndate,
							tick : ndate.unix(),
							day  : d,
							type : type,
							past : ndate.unix() <= today.unix(),
							free : isFree(d)
						});
					}

					context.send({
						year  : date.year(),
						month : date.month() + 1,
						days  : days
					});
				}
			}
		}
	}
};