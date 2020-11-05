'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;

module.exports = {
	collection : 'Categories',
	schema     : {
		name        : { type : String, default : null, required : [true, '1/Nombre'], index : true },
		code        : { type : String, default : null, required : [true, '2/Código'], index : true },
		description : { type : String, default : null, required : [true, '3/Descripción'] },
		groups      : [{
			name     : { type : String, default : null, required : [true, '1/Nombre'], index : true },
			articles : [{
				product : { type : ObjectId, default : null, ref : 'Product', required : [true, '1/Producto'] },
				prices  : {
					primary   : { type : Number, default : null, required : [true, '2/Precio Jornada Primaria'] },
					secundary : { type : Number, default : null, required : [true, '3/Precio Jornada Secundaria'] },
					mixed     : { type : Number, default : null, required : [true, '4/Precio Jornada Mixta'] },
					other     : { type : Number, default : null, required : [true, '5/Precio General'] }
				}
			}]
		}]
	},
	methods    : {
		toClient : function () {
			return {
				id          : this._id,
				name        : this.name,
				code        : this.code,
				description : this.description,
				groups      : this.groups ? this.groups.map(function (group) {
					return {
						id       : group._id,
						name     : group.name,
						articles : group.articles ? group.articles.map(function (article) {
							return {
								id      : article._id,
								product : article.product && article.product.toClient ? article.product.toClient() : article.product,
								prices  : article.prices,
							}
						}) : []
					}
				}) : [],
			};
		},
		toList   : function () {
			return {
				id   : this._id,
				name : this.name,
				code : this.code,
			};
		}
	}
};