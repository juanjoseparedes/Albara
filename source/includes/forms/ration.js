'use strict';

anxeb.vue.include.component('form-ration', function (helpers) {
	return {
		template : '/forms/ration.vue',
		created  : function () {
			var _self = this;
			var modal = _self.$parent;
			var params = modal.component.params;
			var reject = modal.component.reject;
			var resolve = modal.component.resolve;

			_self.provider = params.provider;
			_self.institution = params.institution;
			_self.categories = params.categories;
			_self.units = params.units;

			var speriod = null;
			if (params.category) {
				_self.model.category = params.category.id
			}
			if (params.period) {
				speriod = _self.enums.periods[params.period];
				_self.model.period = params.period;
				_self.lockPeriod = true;
			}

			modal.setup({
				icon  : 'fa-boxes',
				title : speriod != null ? 'Incluir Ración ' + (speriod.weekday ? 'al ' : ' ') + speriod.label : 'Agregar Ración'
			}, [{
				text   : 'Agregar',
				action : function () {
					helpers.api.post('/rations', {
						ration : {
							tenant      : _self.provider.tenant,
							provider    : _self.provider.id,
							institution : _self.institution.id,
							category    : _self.model.category,
							group       : _self.model.group,
							article     : _self.model.article !== 'all' ? _self.model.article : null,
							articles    : _self.model.article === 'all' ? _self.articles.filter(function (item) {
								return item.id !== 'all';
							}).map(function (item) {
								return item.id
							}) : null,
							period      : {
								type     : _self.model.period,
								quantity : _self.model.quantity
							}
						}
					}).then(function (res) {
						modal.close();
						resolve(res.data);
					}).catch(function (err) {
						modal.exception(err);
					});
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
		},
		methods  : {
			categoryChanged : function () {
				this.model.group = null;
				this.model.article = null;
			},
			groupChanged    : function () {
				this.model.article = null;
			},
			productChanged  : function () {

			}
		},
		computed : {
			groups          : function () {
				var _self = this;
				if (_self.model.category != null) {
					var category = _self.categories.filter(function (item) {
						return item.id === _self.model.category;
					})[0];

					return category ? category.groups : [];
				} else {
					return [];
				}
			},
			articles        : function () {
				var _self = this;
				var result = [];

				if (_self.model.group != null) {
					var group = _self.groups.filter(function (item) {
						return item.id === _self.model.group;
					})[0];
					if (group != null) {
						result.push({
							id      : 'all',
							name    : 'Todos',
							product : null
						});
						result = result.concat(group.articles.map(function (item) {
							return {
								id      : item.id,
								name    : item.product.name,
								product : item.product
							}
						}));
					}
				}

				return result;
			},
			selectedArticle : function () {
				var _self = this;

				if (_self.model.article != null) {
					return _self.articles.filter(function (item) {
						return item.id === _self.model.article;
					})[0];
				} else {
					return null;
				}
			},
			selectedUnit    : function () {
				var _self = this;

				if (_self.selectedArticle != null) {
					return _self.units.filter(function (item) {
						return item.id === _self.selectedArticle.product.unit.value.id;
					})[0];
				} else {
					return null;
				}
			}
		},
		data     : function () {
			return {
				vat        : null,
				enums      : {
					periods : {
						monday    : { simbol : 'LU', label : 'Lunes', weekday : true },
						tuesday   : { simbol : 'MA', label : 'Martes', weekday : true },
						wednesday : { simbol : 'MI', label : 'Miercoles', weekday : true },
						thursday  : { simbol : 'JU', label : 'Jueves', weekday : true },
						friday    : { simbol : 'VI', label : 'Viernes', weekday : true },
						once      : { simbol : 'MS', label : 'Mensual', weekday : false },
						twice     : { simbol : 'QU', label : 'Quincenal', weekday : false },
					}
				},
				units      : [],
				lockPeriod : false,
				model      : {
					period   : null,
					category : null,
					group    : null,
					article  : null,
					quantity : null
				}
			};
		}
	}
})
;