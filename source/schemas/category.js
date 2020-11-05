'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;
let Mixed = require('anxeb.mongoose').Types.Mixed;

module.exports = {
	parse        : function (data) {
		var parseField = function (obj) {
			if (obj != null && obj.id != null && obj.id.toClient != null) {
				return obj.id.toClient();
			}
			return obj;
		};

		return {
			root  : parseField(data.root),
			value : parseField(data.value)
		};
	},
	Schema       : function (params) {
		var required = false;
		if (params === true || (params != null && params.required != null)) {
			required = [true, params.required];
		}
		return {
			root  : {
				id   : { type : ObjectId, default : null, ref : 'Reference' },
				name : { type : String, default : null },
				type : { type : String, default : null, required : true },
				meta : { type : Mixed }
			},
			value : {
				id   : { type : ObjectId, default : null, ref : 'Reference', required : required },
				name : { type : String, default : null },
				type : { type : String, default : null, required : true },
				meta : { type : Mixed }
			}
		};
	},
	SingleSchema : function (params) {
		var required = false;
		if (params === true || (params != null && params.required != null)) {
			required = [true, params.required];
		}
		return {
			id   : { type : ObjectId, default : null, ref : 'Reference', required : required },
			name : { type : String, default : null, required : required },
			type : { type : String, default : null, required : required },
			meta : { type : Mixed }
		};
	}
};