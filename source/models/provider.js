'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;
let Category = require('../schemas/category');

module.exports = {
	collection : 'Providers',
	enums      : {
		identity_types : {
			rnc      : 'rnc',
			id       : 'id',
			passport : 'passport'
		},
		states         : {
			active   : 'active',
			inactive : 'inactive'
		}
	},
	schema     : {
		name          : { type : String, default : null, required : [true, '1/Nombre'], index : true },
		identity      : {
			type   : { type : String, default : null, required : [true, '2/Tipo Identidad'], },
			number : { type : String, default : null, required : [true, '3/Número Identidad'], index : true }
		},
		code          : { type : String, default : null, required : [true, '4/Código'], index : true },
		phone         : { type : String, default : null, required : [true, '5/Teléfono'] },
		email         : { type : String, default : null, required : [true, '6/Correo'] },
		administrator : {
			first_name : { type : String, default : null, required : [true, '7/Nombre Administrador'] },
			last_name  : { type : String, default : null, required : [true, '8/Apellido Administrador'] },
			phone      : { type : String, default : null, required : [true, '9/Teléfono Administrador'] },
			email      : { type : String, default : null, required : [true, '10/Correo Administrador'] }
		},
		location      : new Category.Schema({ required : '11/Localidad' }),
		address       : { type : String, default : null, required : [true, '12/Dirección'] },
		remarks       : [{
			date    : { type : Date, default : null, required : true },
			user    : { type : ObjectId, default : null, ref : 'User', required : true },
			state   : { type : String, default : null, required : true },
			comment : { type : String, default : null, required : true },
		}],
		categories    : [{ type : ObjectId, default : null, ref : 'Category', required : true }],
		institutions  : [{ type : ObjectId, default : null, ref : 'Institution', required : true }],
		state         : { type : String, default : 'active', required : true },
		tenant        : { type : ObjectId, default : null, ref : 'Tenant' }
	},
	methods    :
		{
			toClient : function () {
				return {
					id            : this._id,
					name          : this.name,
					identity      : this.identity,
					code          : this.code,
					phone         : this.phone,
					email         : this.email,
					administrator : this.administrator,
					location      : Category.parse(this.location),
					address       : this.address,
					remarks       : this.remarks,
					categories    : this.categories && this.categories.toClient ? this.categories.toClient() : this.categories,
					institutions  : this.institutions && this.institutions.toClient ? this.institutions.toClient() : this.institutions,
					state         : this.state,
					tenant        : this.tenant && this.tenant.toClient ? this.tenant.toClient() : this.tenant
				};
			}
		}
};