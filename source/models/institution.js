'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;
let Category = require('../schemas/category');

module.exports = {
	collection : 'Institutions',
	enums      : {
		types          : {
			primary   : 'primary',
			secundary : 'secundary',
			mixed     : 'mixed',
			other     : 'other',
		},
		identity_types : {
			rnc : 'rnc'
		},
		states         : {
			active   : 'active',
			inactive : 'inactive'
		}
	},
	schema     : {
		name       : { type : String, default : null, required : [true, '1/Nombre'], index : true },
		type       : { type : String, default : null, required : [true, '2/Tipo'], index : true },
		identity   : {
			type   : { type : String, default : 'rnc', required : [true, '3/Tipo Identidad'], },
			number : { type : String, default : null, required : [true, '4/Número Identidad'], index : true }
		},
		code       : { type : String, default : null, required : [true, '5/Código'], index : true },
		phone      : { type : String, default : null, required : [true, '6/Teléfono'] },
		email      : { type : String, default : null, required : [true, '7/Correo'] },
		director   : {
			first_name : { type : String, default : null, required : [true, '8/Nombre Director'] },
			last_name  : { type : String, default : null, required : [true, '9/Apellido Director'] },
			phone      : { type : String, default : null, required : [true, '10/Teléfono Director'] },
			email      : { type : String, default : null, required : [true, '11/Correo Director'] }
		},
		location   : new Category.Schema({ required : '12/Localidad' }),
		address    : { type : String, default : null, required : [true, '13/Dirección'] },
		remarks    : [{
			date    : { type : Date, default : null, required : true },
			user    : { type : ObjectId, default : null, ref : 'User', required : true },
			state   : { type : String, default : null, required : true },
			comment : { type : String, default : null, required : true },
		}],
		categories : [{ type : ObjectId, default : null, ref : 'Category', required : true }],
		state      : { type : String, default : 'active', required : true }
	},
	methods    :
		{
			toClient : function () {
				return {
					id         : this._id,
					name       : this.name,
					type       : this.type,
					identity   : this.identity,
					code       : this.code,
					phone      : this.phone,
					email      : this.email,
					director   : this.director,
					location   : Category.parse(this.location),
					address    : this.address,
					remarks    : this.remarks,
					categories : this.categories && this.categories.toClient ? this.categories.toClient() : this.categories,
					state      : this.state
				};
			}
		}
};