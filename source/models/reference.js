'use strict';

let ObjectId = require('anxeb.mongoose').Types.ObjectId;
let Mixed = require('anxeb.mongoose').Types.Mixed;

module.exports = {
	collection : 'References',
	enums      : {
		types : {
			region   : 'region',
			province : 'province',
			city     : 'city',
			unit     : 'unit',
			group    : 'group',
			vat      : 'vat'
		},
	},
	schema     : {
		name   : { type : String, default : null, required : true, index : true, text : true },
		type   : { type : String, default : null, required : true },
		meta   : { type : Mixed },
		parent : { type : ObjectId, default : null, ref : 'Reference', index : true },
	},
	methods    : {
		toClient : function (childs) {
			return {
				id     : this._id,
				name   : this.name,
				type   : this.type,
				meta   : this.meta,
				parent : this.parent && this.parent.toClient ? this.parent.toClient() : this.parent,
				childs : this.childs || (childs && childs.toClient ? childs.toClient() : childs)
			};
		}
	}
};