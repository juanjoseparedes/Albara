'use strict';

let Category = require('../schemas/category');

module.exports = {
	collection : 'Products',
	enums      : {
		types : {
			article : 'article',
			service : 'service'
		}
	},
	schema     : {
		name        : { type : String, default : null, required : [true, '1/Nombre'], index : true },
		type        : { type : String, default : null, required : [true, '2/Tipo'] },
		description : { type : String, default : null, required : [true, '3/Descripción'] },
		code        : { type : String, default : null, required : [true, '4/Código'], index : true },
		unit        : new Category.Schema({ required : '5/Unidad de Venta' }),
		vat         : new Category.Schema({ required : '6/Clase Impositiva' })
	},
	methods    : {
		toClient : function () {
			return {
				id          : this._id,
				name        : this.name,
				description : this.description,
				type        : this.type,
				code        : this.code,
				unit        : Category.parse(this.unit),
				vat         : Category.parse(this.vat)
			};
		}
	}
};