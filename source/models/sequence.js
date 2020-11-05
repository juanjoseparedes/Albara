'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;

module.exports = {
	collection : 'Sequences',
	enums      : {
		types : {
			global      : 'global',
			provider    : 'provider',
			institution : 'institution',
			category    : 'category'
		}
	},
	schema     : {
		type   : { type : String, default : null, required : true },
		entity : { type : ObjectId, default : null },
		value  : { type : Number, default : null, required : true }
	},
	methods    : {
		toClient : function () {
			return {
				id     : this._id,
				type   : this.type,
				entity : this.entity,
				value  : this.value,
			};
		}
	}
};