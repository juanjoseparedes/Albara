'use strict';

module.exports = {
	domain     : 'admin.albara.growsoft.com',
	name       : 'Albará',
	key        : 'admin',
	active     : true,
	settings   : {
		log      : {
			identifier : '[service_name]',
			enabled    : true,
			stack      : true,
			file       : '[logs_path]/[service_key]/[year]/[month_name]/[day].log',
			events     : '[source_path]/events'
		},
		socket   : {
			port : 8080
		},
		routing  : {
			routes   : ['[source_path]/routes', '[source_path]/actions'],
			prefixes : {
				actions : 'api'
			},
			upload   : true,
			parsers  : {
				json : true,
				url  : true
			}
		},
		renderer : {
			static    : "[source_path]/static",
			favicon   : "[source_path]/static/images/favicon.ico",
			templates : {
				partials   : '[source_path]/templates/partials',
				containers : '[source_path]/templates/containers',
				views      : '[source_path]/templates/views'
			}
		},
		storage  : {
			sub_folder : '[service_key]'
		},
		security : {
			session : {
				name   : 'com.growsoft.albara.admin',
				secret : 'acf787cf68a7f6c7af',
				resave : false
			},
			keys    : {
				private    : '/private.rsa',
				public     : '/public.pem',
				expiration : 80000
			}
		}
	},
	extensions : {
		mongoose : {
			connection : {
				uri          : 'mongodb://127.0.0.1:27017/albara',
				options      : {
					autoReconnect    : false,
					poolSize         : 4,
					useFindAndModify : false
				},
				retryTimeout : 2000
			},
			models     : '[source_path]/models'
		},
		vue      : {
			development : true,
			element     : '#app',
			delimiters  : ['${', '}'],
			scopes      : '[source_path]/scopes',
			root        : '[source_path]/scopes/root.js',
			includes    : '[source_path]/includes',
			templates   : '[source_path]/templates',
			extension   : '.vue'
		}
	},
	initialize : function (service, application) {

	}
};
