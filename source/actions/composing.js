'use strict';
let anxeb = require('anxeb');

module.exports = {
	type    : anxeb.Route.types.action,
	access  : anxeb.Route.access.private,
	owners  : ['tenant'],
	roles   : ['administrator'],
	methods : {},
	childs  : {
		sheets  : {
			methods : {
				get : function (context) {
					context.data.list.Sheet({
						'tenant.id'       : context.bearer.auth.body.tenant.id,
						'provider.id'     : context.query.provider,
						'institution.id'  : context.query.institution,
						'timestamp.year'  : context.query.year,
						'timestamp.month' : context.query.month
					}, []).then(function (rations) {
						context.send(rations.toSmallFootprint());
					});
				}
			}
		},
		rations : {
			methods : {
				get : function (context) {
					context.data.list.Ration({
						tenant      : context.bearer.auth.body.tenant.id,
						provider    : context.query.provider != null ? context.query.provider : undefined,
						institution : context.query.institution != null ? context.query.institution : undefined
					}, []).then(function (rations) {
						context.send(rations.toClient());
					});
				}
			}
		}
	}
};