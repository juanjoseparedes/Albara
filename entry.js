'use strict';
var Server = require('anxeb').Server;

var server = new Server({
	name        : 'Albara',
	description : 'Albara',
	key         : 'main',
	settings    : {
		root : __dirname,
		log  : {
			identifier : '[server_name]',
			stack      : process.env.NODE_ENV !== 'PROD',
			file       : '[logs_path]/[server_key]/[year]/[month_name]/[day].log'
		}
	},
	structure   : {
		services : '/services',
		source   : '/source',
		logs     : '/logs',
		keys     : '/keys',
		storage  : '/storage',
		configs  : '/configs'
	},
	extensions  : {
		vue      : require('anxeb.vue'),
		mongoose : require('anxeb.mongoose')
	}
});

server.start();