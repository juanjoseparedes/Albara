'use strict';

anxeb.vue.include.service('modal', function (helpers) {

	return function (component, params) {

		var fetchModal = function (callback) {
			helpers.root.$fetch('top-header').then(function (topHeader) {
				helpers.root.$fetch('modal').then(function (modal) {
					modal.reset();
					modal.title = (typeof params === 'string' ? null : params.title) || ((topHeader.caption || topHeader.title));
					callback(modal);
				}).catch(function () {});
			}).catch(function () {});
		};

		return {
			form    : function (formParams) {
				return new Promise(function (resolve, reject) {
					fetchModal(function (modal) {
						modal.show({
							message   : false,
							loaded    : false,
							large     : formParams ? formParams.large : false,
							component : {
								name    : typeof params === 'string' ? params : params.component,
								params  : formParams,
								resolve : resolve,
								reject  : reject
							},
							onCancel  : function () {
								reject();
							}
						});
					});
				});
			},
			inform  : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message  : typeof params === 'string' ? params : params.message,
						icon     : 'fa-info-circle',
						onCancel : callback
					}, [{
						text   : 'OK',
						key    : 'OK',
						close  : true,
						action : callback
					}]);
				});
			},
			alert   : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message  : typeof params === 'string' ? params : params.message,
						icon     : 'fa-exclamation-triangle text-danger',
						onCancel : callback
					}, [{
						text   : 'OK',
						key    : 'OK',
						close  : true,
						action : callback
					}]);
				});
			},
			dialog  : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message  : typeof params === 'string' ? params : params.message,
						icon     : 'fa-question-circle',
						onCancel : callback
					}, [{
						text   : 'Si',
						key    : 'YES',
						close  : true,
						action : callback
					}, {
						text   : 'No',
						key    : 'NO',
						close  : true,
						action : callback
					}, {
						text   : 'Cancelar',
						key    : 'CANCEL',
						close  : true,
						action : callback
					}]);
				});
			},
			confirm : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message  : typeof params === 'string' ? params : params.message,
						icon     : 'fa-question-circle',
						prompt   : params.prompt,
						onCancel : modal.close
					}, [{
						text     : 'Si',
						key      : 'YES',
						prompted : params.prompt != null,
						close    : true,
						action   : callback
					}, {
						text  : 'No',
						key   : 'NO',
						close : true
					}]);
				});
			},
			prompt  : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message  : typeof params === 'string' ? params : params.message,
						icon     : params.icon || 'fa-information-circle',
						prompt   : params.prompt,
						buttons  : params.buttons,
						onCancel : modal.close
					}, [{
						text     : 'Aceptar',
						key      : 'ACCEPT',
						prompted : params.prompt != null,
						close    : true,
						action   : callback
					}, {
						text  : 'Cancelar',
						key   : 'CANCEL',
						close : true
					}]);
				});
			}
		}
	}
});