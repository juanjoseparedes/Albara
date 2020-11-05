'use strict';
var eventTypes = require('anxeb').Event.types;

module.exports = {
	invalid_credentials         : {
		message : 'Correo o contraseña incorrecta',
		code    : 901,
		type    : eventTypes.user_exception
	},
	invalid_email               : {
		message : 'Correo inválido',
		code    : 902,
		type    : eventTypes.user_exception
	},
	invalid_password            : {
		message : 'Contraseña Inválida',
		code    : 903,
		type    : eventTypes.user_exception
	},
	selected_name_unavailable   : {
		message : '[0] no está disponible',
		code    : 906,
		type    : eventTypes.user_exception
	},
	user_not_found              : {
		message : 'Usuario no encontrado',
		code    : 907,
		type    : eventTypes.user_exception
	},
	prospect_account_registered : {
		message : 'La cuenta [0] ya está tomada, favor utilizar otro correo',
		code    : 910,
		type    : eventTypes.user_exception
	},
	record_not_found            : {
		message : '[0] indicado no existe o su identificador es incorrecto',
		code    : 911,
		type    : eventTypes.user_exception
	},
	invalid_code                : {
		message : 'Código inválido, este debe tener 5 caracteres',
		code    : 912,
		type    : eventTypes.user_exception
	},
	tenant_require_admin_user   : {
		message : 'La cuenta requiere por lo menos un usuario administrador',
		code    : 113,
		type    : eventTypes.user_exception
	},
	data_validation_exception   : {
		message : 'Uno o varios campos son requeridos en la solicitud',
		code    : 8005,
		type    : 'data_exception'
	},
	report_rendering_error      : {
		message : 'Error renderizando reporte, [inner]',
		code    : 809,
		type    : eventTypes.data_exception
	},
	sheet_request_error         : {
		message : '[inner]',
		code    : 930,
		type    : eventTypes.data_exception
	},
	sheet_empty                 : {
		message : 'Conduce sin artículos asignados',
		code    : 931,
		type    : eventTypes.data_exception
	},
	sheet_identitiy_error       : {
		message : 'Error asignando número de conduce',
		code    : 932,
		type    : eventTypes.data_exception
	},
	sheet_already_printed       : {
		message : 'El conduce no puede ser modificado',
		code    : 933,
		type    : eventTypes.data_exception
	},
	bill_request_error          : {
		message : '[inner]',
		code    : 934,
		type    : eventTypes.data_exception
	},
	bill_empty                  : {
		message : 'Factura sin conduces asignados',
		code    : 935,
		type    : eventTypes.data_exception
	},
	bill_identitiy_error        : {
		message : 'Error asignando número de factura',
		code    : 936,
		type    : eventTypes.data_exception
	},
	bill_already_printed        : {
		message : 'La factura no puede ser modificada',
		code    : 937,
		type    : eventTypes.data_exception
	},
};
