'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;
let Category = require('../schemas/category');
let Mixed = require('anxeb.mongoose').Types.Mixed;

module.exports = {
	collection : 'Bills',
	schema     : {
		tenant      : {
			id            : { type : ObjectId, default : null, ref : 'Tenant', required : true, index : true },
			name          : { type : String, default : null, required : true },
			alias         : { type : String, default : null, required : true },
			identity      : {
				type   : { type : String, default : null, required : true },
				number : { type : String, default : null, required : true }
			},
			administrator : {
				first_name : { type : String, default : null, required : true },
				last_name  : { type : String, default : null, required : true },
				phone      : { type : String, default : null, required : true },
				email      : { type : String, default : null, required : true }
			},
			location      : {
				region   : new Category.SingleSchema(true),
				province : new Category.SingleSchema(true),
				city     : new Category.SingleSchema(),
				address  : { type : String, default : null, required : true }
			}
		},
		provider    : {
			id            : { type : ObjectId, default : null, ref : 'Provider', required : true, index : true },
			name          : { type : String, default : null, required : true },
			identity      : {
				type   : { type : String, default : null, required : true },
				number : { type : String, default : null, required : true }
			},
			code          : { type : String, default : null, required : true },
			phone         : { type : String, default : null, required : true },
			email         : { type : String, default : null, required : true },
			administrator : {
				first_name : { type : String, default : null, required : true },
				last_name  : { type : String, default : null, required : true },
				phone      : { type : String, default : null, required : true },
				email      : { type : String, default : null, required : true }
			},
			location      : {
				region   : new Category.SingleSchema(true),
				province : new Category.SingleSchema(true),
				city     : new Category.SingleSchema(),
				address  : { type : String, default : null, required : true }
			}
		},
		institution : {
			id       : { type : ObjectId, default : null, ref : 'Institution', required : true, index : true },
			name     : { type : String, default : null, required : true },
			type     : { type : String, default : null, required : true },
			identity : {
				type   : { type : String, default : 'rnc', required : true },
				number : { type : String, default : null, required : true }
			},
			code     : { type : String, default : null, required : true },
			phone    : { type : String, default : null, required : true },
			email    : { type : String, default : null, required : true },
			director : {
				first_name : { type : String, default : null, required : true },
				last_name  : { type : String, default : null, required : true },
				phone      : { type : String, default : null, required : true },
				email      : { type : String, default : null, required : true }
			},
			location : {
				region   : new Category.SingleSchema(true),
				province : new Category.SingleSchema(true),
				city     : new Category.SingleSchema(),
				address  : { type : String, default : null, required : true }
			}
		},
		trace       : {
			year   : { type : Number, default : null, required : true },
			month  : { type : Number, default : null, required : true },
			number : { type : Number, default : null }
		},
		identities  : {
			global      : { type : Number, default : null, index : true },
			provider    : { type : Number, default : null, index : true },
			institution : { type : Number, default : null, index : true },
		},
		client      : {
			name     : { type : String, default : null, required : true },
			identity : {
				type   : { type : String, default : null, required : true },
				number : { type : String, default : null, required : true }
			},
		},
		dates       : {
			updated : { type : Date, default : null, required : true },
			printed : { type : Date, default : null },
			valid   : { type : Date, default : null },
		},
		details     : [{
			category : {
				id          : { type : ObjectId, default : null, ref : 'Category', required : true, index : true },
				name        : { type : String, default : null, required : true },
				code        : { type : String, default : null, required : true },
				description : { type : String, default : null, required : true },
			},
			article  : {
				id     : { type : ObjectId, default : null, required : true },
				prices : {
					primary   : { type : Number, default : null, required : true },
					secundary : { type : Number, default : null, required : true },
					mixed     : { type : Number, default : null, required : true },
					other     : { type : Number, default : null, required : true }
				}
			},
			group    : {
				id   : { type : ObjectId, default : null, required : true },
				name : { type : String, default : null, required : true },
			},
			product  : {
				id          : { type : ObjectId, default : null, required : true },
				name        : { type : String, default : null, required : true },
				type        : { type : String, default : null, required : true },
				description : { type : String, default : null, required : true },
				code        : { type : String, default : null, required : true },
				unit        : new Category.Schema(true),
				vat         : new Category.Schema(true)
			},
			quantity : { type : Number, default : null, required : true },
			price    : {
				type   : { type : String, default : null, required : true },
				amount : { type : Number, default : null, required : true },
				taxes  : { type : Number, default : null, required : true },
				taxsum : { type : Number, default : null, required : true },
				cost   : { type : Number, default : null, required : true },
				total  : { type : Number, default : null, required : true },
			}
		}],
		sheets      : [{
			reference  : { type : ObjectId, default : null, required : true },
			dates      : {
				updated : { type : Date, default : null, required : true },
				printed : { type : Date, default : null },
			},
			timestamp  : {
				year  : { type : Number, default : null, required : true, index : true },
				month : { type : Number, default : null, required : true, index : true },
				day   : { type : Number, default : null, required : true, index : true }
			},
			identities : {
				global      : { type : Number, default : null, index : true },
				category    : { type : Number, default : null, index : true },
				provider    : { type : Number, default : null, index : true },
				institution : { type : Number, default : null, index : true },
			},
		}],
		totals      : {
			excent : { type : Number, default : null, required : true },
			graven : { type : Number, default : null, required : true },
			amount : { type : Number, default : null, required : true },
			taxes  : { type : Number, default : null, required : true },
			taxsum : { type : Number, default : null, required : true },
			cost   : { type : Number, default : null, required : true },
			total  : { type : Number, default : null, required : true },
		}
	},
	methods    : {
		toClient         : function () {
			var _self = this;
			var code = null;
			let year = _self.trace.year.toString();
			let month = _self.trace.month;
			month = month < 10 ? '0' + month.toString() : month.toString();

			if (_self.dates.printed != null) {
				code = year + month + _self.identities.global;
			} else {
				code = year + month + '000000';
			}

			return {
				id          : this._id,
				tenant      : this.tenant,
				provider    : this.provider,
				institution : this.institution,
				trace       : this.trace,
				identities  : this.identities,
				client      : this.client,
				dates       : this.dates,
				details     : this.details.map(function (detail) {
					return {
						id       : detail._id,
						category : detail.category,
						article  : detail.article,
						group    : detail.group,
						product  : detail.product,
						quantity : detail.quantity,
						price    : detail.price
					};
				}),
				sheets      : this.sheets.map(function (sheet) {
					return {
						id         : sheet._id,
						reference  : sheet.reference,
						dates      : sheet.dates,
						timestamp  : sheet.timestamp,
						identities : sheet.identities
					};
				}),
				totals      : this.totals,
				code        : code
			};
		},
		toSmallFootprint : function () {
			return {
				id          : this._id,
				tenant      : this.tenant.id,
				provider    : this.provider.id,
				institution : this.institution.id,
				trace       : this.trace,
				identities  : this.identities,
				client      : this.client,
				dates       : this.dates,
				details     : this.details.map(function (detail) {
					return {
						id       : detail._id,
						category : detail.category.id,
						article  : detail.article.id,
						group    : detail.group.id,
						product  : detail.product.id,
						quantity : detail.quantity,
						price    : detail.price
					};
				}),
				sheets      : this.sheets.map(function (sheet) {
					return {
						id         : sheet._id,
						reference  : sheet.reference,
						dates      : sheet.dates,
						timestamp  : sheet.timestamp,
						identities : sheet.identities
					};
				}),
				totals      : this.total
			};
		}
	}
};