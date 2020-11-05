'use strict';
let anxeb = require('anxeb');
let moment = require('moment');
const Barcode = require('jsbarcode');
const { createCanvas } = require("canvas");

module.exports = {
	if           : function () {
		return function (a, b, opts) {
			if (a == b) {
				return opts.fn(this);
			} else {
				return opts.inverse(this);
			}
		}
	},
	number       : function () {
		return function (value) {
			var format = function (num) {
				if (num != null) {
					return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
				} else {
					return '0.00';
				}
			};
			return format(value);
		}
	},
	date         : function () {
		return function (datetime, format) {
			let DateFormats = {
				normal : "DD/MM/YYYY",
				short  : "DD MMMM - YYYY",
				long   : "DD/MM/YYYY hh:mm a"
			};

			format = DateFormats[format] || format;
			return moment(datetime).format(format);
		}
	},
	monthName : function () {
		return function (month) {
			let months = [
				{},
				{ label : 'Enero', index : 1 },
				{ label : 'Febrero', index : 2 },
				{ label : 'Marzo', index : 3 },
				{ label : 'Abril', index : 4 },
				{ label : 'Mayo', index : 5 },
				{ label : 'Junio', index : 6 },
				{ label : 'Julio', index : 7 },
				{ label : 'Agosto', index : 8 },
				{ label : 'Septiembre', index : 9 },
				{ label : 'Octubre', index : 10 },
				{ label : 'Noviembre', index : 11 },
				{ label : 'Diciembre', index : 12 },
			];
			return months[month].label;
		}
	},
	identityType : function (identity) {
		return function () {
			let types = {
				rnc      : 'RNC',
				id       : 'Cédula',
				passport : 'Pasaporte'
			};
			if (identity) {
				return types[identity.type];
			} else {
				return '';
			}
		}
	},
	barcode      : function (code) {
		return function () {
			let canvas = new createCanvas();
			Barcode(canvas, code, {
				height   : 100,
				fontSize : 62,
				margin   : 4,
				width    : 9
			});
			let img = '<img src="' + canvas.toDataURL('image/png') + '" />';
			return img;
		}
	},
	logos        : function (context, subfolder, id) {
		return function () {
			let filePath = anxeb.utils.path.join(subfolder, id.toString(), 'logo.image');
			if (context.service.storage.exists(filePath)) {
				return '<img src="' + context.service.storage.read(filePath) + '" />';
			} else {
				return ''
			}
		}
	}
};