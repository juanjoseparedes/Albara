'use strict';
var anxeb = require('anxeb');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	roles   : ['*'],
	timeout : 9250,
	url     : '/storage',
	childs  : {
		providers : {
			url     : '/providers/:id/:file/:extension',
			methods : {
				get : function (context) {
					var id = context.params.id;
					var file = context.params.file;
					var extension = context.params.extension;
					var resource = anxeb.utils.path.join('providers', id, file + '.' + extension);

					context.service.storage.fetch(resource).then(function (data) {
						if (context.query.raw === undefined) {
							context.image(data);
						} else {
							context.send({
								content : data
							});
						}
					}).catch(function (err) {
						context.log.exception.file_not_found.args(err).throw(context);
					});
				}
			}
		},
		profile   : {
			url     : '/profile/:folder/:file/:extension',
			methods : {
				get : function (context) {
					var identity = context.bearer.auth.body.identity;
					var folder = context.params.folder;
					var file = context.params.file;
					var extension = context.params.extension;
					var resource = anxeb.utils.path.join('profiles', identity, folder, file + '.' + extension);

					context.service.storage.fetch(resource).then(function (data) {
						if (context.query.raw === undefined) {
							context.image(data);
						} else {
							context.send({
								content : data
							});
						}
					}).catch(function (err) {
						context.log.exception.file_not_found.args(err).throw(context);
					});
				}
			}
		}
	}
};