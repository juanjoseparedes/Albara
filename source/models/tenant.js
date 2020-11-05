'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;
let Category = require('../schemas/category');

module.exports = {
	collection : 'Tenants',
	enums      : {
		states         : {
			new      : 'new',
			active   : 'active',
			inactive : 'inactive'
		},
		identity_types : {
			rnc      : 'rnc',
			id       : 'id',
			passport : 'passport'
		},
	},
	schema     : {
		name          : { type : String, default : null, required : [true, '1/Nombre'] },
		alias         : { type : String, default : null, required : [true, '2/Alias'] },
		identity      : {
			type   : { type : String, default : null, required : [true, '3/Tipo Identidad'], },
			number : { type : String, default : null, required : [true, '4/Número Identidad'], index : true }
		},
		administrator : {
			first_name : { type : String, default : null, required : [true, '5/Nombre'] },
			last_name  : { type : String, default : null, required : [true, '6/Apellido'] },
			phone      : { type : String, default : null, required : [true, '7/Teléfono'] },
			email      : { type : String, default : null, required : [true, '8/Correo'], index : true }
		},
		location      : new Category.Schema({ required : '9/Localidad' }),
		address       : { type : String, default : null, required : [true, '10/Dirección'] },
		remarks       : [{
			date    : { type : Date, default : null, required : true },
			user    : { type : ObjectId, default : null, ref : 'User', required : true },
			state   : { type : String, default : null, required : true },
			comment : { type : String, default : null, required : true },
		}],
		state         : { type : String, default : null, required : true }
	},
	methods    : {
		toClient : function () {
			return {
				id            : this._id,
				name          : this.name,
				alias         : this.alias,
				identity      : this.identity,
				administrator : this.administrator,
				location      : Category.parse(this.location),
				address       : this.address,
				remarks       : this.remarks,
				state         : this.state
			};
		}
	}
};