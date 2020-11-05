'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;

module.exports = {
	collection : 'Rations',
	enums      : {
		period_types : {
			monday    : 'monday',
			tuesday   : 'tuesday',
			wednesday : 'wednesday',
			thursday  : 'thursday',
			friday    : 'friday',
			once      : 'once',
			twice     : 'twice',
		}
	},
	schema     : {
		tenant      : { type : ObjectId, default : null, ref : 'Tenant', required : true },
		provider    : { type : ObjectId, default : null, ref : 'Provider', required : true },
		institution : { type : ObjectId, default : null, ref : 'Institution', required : true },
		category    : { type : ObjectId, default : null, ref : 'Category', required : true },
		group       : { type : ObjectId, default : null, required : true },
		article     : { type : ObjectId, default : null, required : true },
		periods     : [{
			type     : { type : String, default : null, required : true },
			quantity : { type : Number, default : null, required : true },
		}],
	},
	methods    :
		{
			toClient : function () {
				return {
					id          : this._id,
					tenant      : this.tenant && this.tenant.toClient ? this.tenant.toClient() : this.tenant,
					provider    : this.provider && this.provider.toClient ? this.provider.toClient() : this.provider,
					institution : this.institution && this.institution.toClient ? this.institution.toClient() : this.institution,
					category    : this.tenant && this.category.toClient ? this.category.toClient() : this.category,
					group       : this.group,
					article     : this.article,
					periods     : this.periods
				};
			}
		}
};