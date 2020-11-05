'use strict';

module.exports = {
	admin  : {
		administrator : {
			reference : 'Administrator',
			claims    : [
				{ path : '/anxeb/container/*', method : 'GET' },
			]
		}
	},
	tenant : {
		administrator : {
			reference : 'Administrator',
			claims    : [
				{ path : '/anxeb/container/*', method : 'GET' },
			]
		},
		operator      : {
			reference : 'Operador',
			claims    : [
				{ path : '/anxeb/container/*', method : 'GET' },
			]
		}
	}
};