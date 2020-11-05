'use strict';

anxeb.vue.include.component('form-article', function (helpers) {
	return {
		template : '/forms/article.vue',
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
							var requiredFields = [];


							for (var key in _self.model.prices) {
								var price = _self.model.prices[key];
								if (price == null || price <= 0 || isNaN(price)) {
									requiredFields.push('prices.' + key);
								}
							}

							if (!_self.model.product) {
								requiredFields.push('product');
							}
							var err = helpers.tools.requiredError('model', requiredFields);


							if (_self.group.articles.filter(function (article) {
								return article.product === _self.model.product && (_self.article == null || _self.article.product !== article.product);
							}).length > 0) {
								err = helpers.tools.requiredError('model', ['product'], 'Este producto ya se encuentra asociado');
							}

							if (err) {
								_self.$root.log(err).exception();
							} else {
								resolve(_self.model);
								modal.close();
							}
						}
					}, {
						text   : 'Cancelar',
						close  : true,
						action : function
							() {
							if (reject) {
								reject()
							}
						}
					}]);
					modal.loaded = true;
				}
			;

			if (params != null) {
				_self.group = params.group;
				if (params.model != null) {
					_self.model = helpers.tools.data.copy(params.model);
					_self.article = params.model;
					setup('Editar Producto y Precios');
				} else {
					setup('Adjuntar Producto');
				}
			}
		},
		methods  : {
			setVat : function (value) {
				var _self = this;

				if (value != null) {
					if (value.vat != null && (_self.vat == null || _self.vat.value == null || value.vat.value.id !== _self.vat.value.id)) {
						helpers.api.get('/references/' + value.vat.value.id).then(function (res) {
							_self.vat = res.data;
						}).catch(function (err) {
							_self.$parent.log(err).exception();
						});
					}
				}
			},
			total  : function (price) {
				var _self = this;
				if (_self.vat) {
					return ((_self.vat.meta.vat.value / 100) + 1) * (price ? price : 0);
				} else {
					return 0;
				}
			}
		},
		computed : {
			vatLabel : function () {
				var _self = this;
				if (_self.vat) {
					return _self.vat.name;
				} else {
					return 'Impuestos';
				}
			},
			vatValue : function () {
				var _self = this;
				if (_self.vat) {
					return _self.vat.meta.vat.value;
				} else {
					return '0';
				}
			}
		},
		data     : function () {
			return {
				vat     : null,
				enums   : {
					prices : {
						primary   : 'Precio Jornada Primaria',
						secundary : 'Precio Jornada Secundaria',
						mixed     : 'Precio Jornada Mixta',
						other     : 'Precio General'
					}
				},
				model   : {
					product : null,
					prices  : {
						primary   : null,
						secundary : null,
						mixed     : null,
						other     : null
					}
				},
				group   : null,
				article : null
			};
		}
	}
})
;