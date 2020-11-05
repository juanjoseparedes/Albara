'use strict';

anxeb.vue.include.component('form-product', function (helpers) {
	return {
		template : '/forms/product.vue',
		created  : function () {
			var _self = this;
			var modal = _self.$parent;
			var params = modal.component.params;
			var reject = modal.component.reject;
			var resolve = modal.component.resolve;

			var setup = function (title) {
				modal.setup({
					icon  : 'fa-tag',
					title : title
				}, [{
					text   : 'Guardar',
					action : function () {
						helpers.api.post('/products', { product : _self.model }).then(function (res) {
							modal.close();
							resolve(res.data);
						}).catch(function (err) {
							modal.exception(err);
						});
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
			};


			if (typeof params === 'string') {
				helpers.api.get('/products/' + params).then(function (res) {
					_self.model = res.data;
					setup('Editar Producto');
				}).catch(function () {});
			} else {
				setup('Nuevo Producto');
			}
		},
		data     : function () {
			return {
				enums : {
					types : {
						article : 'Artículo',
						service : 'Servicio'
					}
				},
				model : {
					name        : null,
					type        : null,
					description : null,
					code        : null,
					unit        : null,
					vat         : null
				}
			};
		}
	}
});