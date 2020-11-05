'use strict';

anxeb.vue.include.component('lookup-category', function (helpers) {
	return {
		template : '/lookups/category.vue',
		created  : function () {
			var _self = this;
			var modal = _self.$parent;
			var params = modal.component.params;
			var reject = modal.component.reject;
			var resolve = modal.component.resolve;

			modal.setup({
				icon  : 'fa-tags',
				title : 'Buscar Modalidad'
			}, [{
				text   : 'Asociar',
				action : function () {
					if (_self.model.id) {
						if (_self.invalidate != null && _self.invalidate.length > 0) {
							if (_self.invalidate.includes(_self.model.id) === true) {
								_self.$root.log(helpers.tools.requiredError('model', ['id'], 'Modalidad previamente asociada')).exception();
							} else {
								modal.close();
								resolve(_self.model.id);
							}
						} else {
							modal.close();
							resolve(_self.model.id);
						}
					} else {
						_self.$root.log(helpers.tools.requiredError('model', ['id'], 'Debe seleccionar una modalidad')).exception();
					}
				}
			}, {
				text   : 'Cancelar',
				close  : true,
				action : function () {
					if (reject) {
						reject()
					}
				}
			}]);
			modal.loaded = true;
			_self.invalidate = (params != null ? params.invalidate : null) || [];
		},
		data     : function () {
			return {
				invalidate : [],
				model      : {
					id : null
				}
			};
		}
	}
});