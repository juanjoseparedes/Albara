'use strict';

let roles = require('../middleware/roles');
let Mixed = require('anxeb.mongoose').Types.Mixed;
let ObjectId = require('anxeb.mongoose').Types.ObjectId;

module.exports = {
	collection : 'Users',
	states     : {
		active   : 'active',
		inactive : 'inactive'
	},
	types      : {
		tenant : 'tenant',
		admin  : 'admin'
	},
	schema     : {
		first_name  : { type : String, default : null, required : [true, '1/First Name'] },
		last_name   : { type : String, default : null, required : [true, '2/Last Name'] },
		email       : { type : String, default : null, required : [true, '3/Email'], index : true },
		password    : { type : String, default : null, required : [true, '4/Password'] },
		role        : { type : String, default : null, required : [true, '5/Role'] },
		state       : { type : String, default : null, required : [true, '6/State'] },
		type        : { type : String, default : null, required : [true, '7/Type'] },
		preferences : { type : Mixed },
		tenant      : { type : ObjectId, default : null, ref : 'Tenant' }
	},
	virtuals   : {
		claims : function () {
			return roles[this.type] && roles[this.type][this.role] ? roles[this.type][this.role].claims : null;
		}
	},
	methods    : {
		toClient : function () {
			return {
				id          : this._id,
				first_name  : this.first_name,
				last_name   : this.last_name,
				email       : this.email,
				password    : null,
				role        : this.role,
				state       : this.state,
				type        : this.type,
				preferences : this.preferences,
				tenant      : this.tenant && this.tenant.toClient ? this.tenant.toClient() : this.tenant
			};
		}
	}
};