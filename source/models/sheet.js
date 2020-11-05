'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;
let Category = require('../schemas/category');
let Mixed = require('anxeb.mongoose').Types.Mixed;

module.exports = {
	collection : 'Sheets',
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
				region  : new Category.SingleSchema(true),
				province : new Category.SingleSchema(true),
				city    : new Category.SingleSchema(),
				address : { type : String, default : null, required : true }
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
				region  : new Category.SingleSchema(true),
				province : new Category.SingleSchema(true),
				city    : new Category.SingleSchema(),
				address : { type : String, default : null, required : true }
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
				region  : new Category.SingleSchema(true),
				province : new Category.SingleSchema(true),
				city    : new Category.SingleSchema(),
				address : { type : String, default : null, required : true }
			}
		},
		category    : {
			id          : { type : ObjectId, default : null, ref : 'Category', required : true, index : true },
			name        : { type : String, default : null, required : true },
			code        : { type : String, default : null, required : true },
			description : { type : String, default : null, required : true },
		},
		timestamp   : {
			year  : { type : Number, default : null, required : true, index : true },
			month : { type : Number, default : null, required : true, index : true },
			day   : { type : Number, default : null, required : true, index : true }
		},
		identities  : {
			global      : { type : Number, default : null, index : true },
			category    : { type : Number, default : null, index : true },
			provider    : { type : Number, default : null, index : true },
			institution : { type : Number, default : null, index : true },
		},
		dates       : {
			updated : { type : Date, default : null, required : true },
			printed : { type : Date, default : null },
		},
		details     : [{
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
		}],
		billing     : {
			id         : { type : ObjectId, default : null },
			trace      : {
				year   : { type : Number, default : null },
				month  : { type : Number, default : null },
				number : { type : Number, default : null }
			},
			identities : {
				global      : { type : Number, default : null },
				category    : { type : Number, default : null },
				provider    : { type : Number, default : null },
				institution : { type : Number, default : null },
			},
			dates      : {
				updated : { type : Date, default : null },
				printed : { type : Date, default : null },
				valid   : { type : Date, default : null },
			},
			totals     : {
				amount : { type : Number, default : null },
				taxes  : { type : Number, default : null },
			},
		}
	},
	methods    : {
		toClient         : function () {
			var _self = this;
			var code = null;
			if (_self.dates.printed != null) {
				let year = _self.timestamp.year.toString();
				let month = _self.timestamp.month;
				let day = _self.timestamp.day;
				month = month < 10 ? '0' + month.toString() : month.toString();
				day = day < 10 ? '0' + day.toString() : day.toString();
				code = year + month + day + _self.identities.global;
			}

			return {
				id          : this._id,
				tenant      : this.tenant,
				provider    : this.provider,
				institution : this.institution,
				category    : this.category,
				timestamp   : this.timestamp,
				identities  : this.identities,
				dates       : this.dates,
				details     : this.details.map(function (detail) {
					return {
						id       : detail._id,
						article  : detail.article,
						group    : detail.group,
						product  : detail.product,
						quantity : detail.quantity,
					};
				}),
				billing     : this.billing,
				code        : code
			};
		},
		toSmallFootprint : function () {
			return {
				id          : this._id,
				tenant      : this.tenant.id,
				provider    : this.provider.id,
				institution : this.institution.id,
				category    : this.category.id,
				timestamp   : this.timestamp,
				dates       : this.dates,
				details     : this.details.map(function (detail) {
					return {
						id       : detail._id,
						article  : detail.article.id,
						group    : detail.group.id,
						product  : detail.product.id,
						quantity : detail.quantity
					};
				})
			};
		}
	}
};