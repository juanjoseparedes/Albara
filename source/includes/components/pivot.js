'use strict';

anxeb.vue.include.component('pivot', function (helpers) {

	return {
		template : '/components/pivot.vue',
		props    : ['institution', 'provider', 'references', 'show-all'],
		created  : function () { },
		watch    : {},
		mounted  : function () {
			var _self = this;
			helpers.api.get('/references?type=unit&parent=any').then(function (res) {
				_self.units = res.data;
			}).catch(function (err) {
				_self.$parent.log(err).exception();
			});

			_self.refresh();
		},
		computed : {},
		methods  : {
			getQuantity      : function (article, period) {
				var _self = this;
				if (_self.rations) {
					var ration = _self.rations[article.id];
					if (ration != null) {
						var iperiod = ration.periods[period.type];
						if (iperiod) {
							_self.anyRation = true;
							return iperiod.quantity;
						} else {
							return '-';
						}
					}
				}
				return '-';
			},
			getCategoryTotal : function (category, period) {
				var _self = this;
				if (_self.rations) {
					var total = 0;
					for (var g = 0; g < category.groups.length; g++) {
						var group = category.groups[g];

						for (var a = 0; a < group.articles.length; a++) {
							var article = group.articles[a];


							var ration = _self.rations[article.id];
							if (ration != null) {
								var iperiod = ration.periods[period.type];
								if (iperiod) {
									total += iperiod.quantity;
								}
							}

						}
					}
					return total;
				}
				return '';
			},
			getProductUnit   : function (item) {
				var _self = this;
				var unit = _self.units.filter(function (unit) {
					return unit.id === item.product.unit.value.id;
				})[0];

				return unit != null ? unit.meta.plural_sufix.value : '';
			},
			getProductTotal  : function (item) {
				var _self = this;
				if (_self.rations) {
					var ration = _self.rations[item.article.id];

					if (ration != null) {
						var total = 0;

						for (var type in _self.periods) {
							var iperiod = ration.periods[type];
							if (iperiod) {
								total += iperiod.quantity;
							}
						}
						return total;
					}
				}
				return '-';
			},
			anyArticle       : function (category) {
				var _self = this;

				if (!_self.rations) {
					return false;
				}

				var items = _self.getArticles(category);

				return items.filter(function (item) {
					return _self.rations[item.article.id] != null;
				}).length > 0;
			},
			getArticles      : function (category) {
				var groups = category.groups;
				var articles = [];
				for (var g = 0; g < groups.length; g++) {
					var group = groups[g];
					for (var a = 0; a < group.articles.length; a++) {
						var article = group.articles[a];
						articles.push({ group : group, article : article, product : article.product, category : category });
					}
				}
				return articles;
			},
			refreshRations   : function () {
				var _self = this;

				_self.$root.page.busy();
				helpers.api.get('/rations', {
					params : {
						provider    : _self.selection.provider.id,
						institution : _self.selection.institution.id
					}
				}).then(function (res) {
					_self.rations = {};
					_self.anyRation = false;

					for (var r = 0; r < res.data.length; r++) {
						var ration = res.data[r];
						var periods = ration.periods.slice();
						ration.periods = {};

						for (var p = 0; p < periods.length; p++) {
							var period = periods[p];
							ration.periods[period.type] = period;
						}
						_self.rations[ration.article] = ration;
					}
					_self.$root.page.idle();
				}).catch(function (err) {
					_self.$root.log(err).exception();
				});
			},
			refresh          : function () {
				var _self = this;

				var setupInstitution = function () {
					if (_self.selection.institution != null && _self.selection.institution.id === _self.institution) {
						_self.$root.page.idle();
					} else {
						for (var i = 0; i < _self.selection.provider.institutions.length; i++) {
							var refinst = _self.selection.provider.institutions[i];
							if (refinst.id === _self.institution) {
								_self.selection.institution = refinst;

								helpers.api.get('/categories', {
									params : {
										ids : refinst.categories
									}
								}).then(function (res) {
									_self.selection.categories = res.data;
									_self.refreshRations();
								}).catch(function (err) {
									_self.$root.log(err).exception();
								});
								break;
							}
						}
					}
				};

				var setupProvider = function (provider) {
					_self.selection.provider = provider || _self.selection.provider;
					setupInstitution();
				};

				_self.$root.page.busy();
				if (_self.references != null && _self.references.provider != null) {
					if (_self.selection.provider == null || _self.references.provider.id !== _self.selection.provider.id) {
						setupProvider(_self.references.provider);
					} else {
						setupInstitution();
					}
				} else if (_self.provider != null) {
					if (_self.selection.provider == null || _self.provider !== _self.selection.provider.id) {
						helpers.api.get('/providers/' + _self.provider).then(function (res) {
							setupProvider(res.data);
						}).catch(function (err) {
							_self.$root.log(err).exception();
						});
					} else {
						setupInstitution();
					}
				}
			},
			remove           : function (item) {
				var _self = this;
				var ration = _self.rations[item.article.id];

				if (ration != null) {
					_self.$parent.modal('¿Está seguro que quiere eliminar las raciones de este producto?').confirm(function () {
						_self.$root.page.busy();
						helpers.api.delete('/rations/' + ration.id).then(function (res) {
							_self.refresh();
						}).catch(function () {});
						_self.$parent.log('Raciones eliminadas correctamente').information();
						_self.refreshRations();
					});
				}
			},
			add              : function (period, category) {
				var _self = this;
				_self.$parent.modal('form-ration').form({
					provider    : _self.selection.provider,
					institution : _self.selection.institution,
					categories  : _self.selection.categories,
					units       : _self.units,
					period      : period != null ? period.type : undefined,
					category    : category
				}).then(function (result) {
					_self.$parent.log('Ración agregada correctamente').information();
					_self.refreshRations();
				}).catch(function () {});
			},
			edit             : function (item, period) {
				var _self = this;
				var product = item.product;

				var unit = _self.units.filter(function (item) {
					return item.id === product.unit.value.id;
				})[0];

				_self.$parent.modal({
					title   : 'Editar Cantidad',
					icon    : 'fa-edit',
					message : 'Nueva cantidad de <b>' + item.product.name + '</b> ' + (period.weekday ? ' para los ' : ' ') + period.label,
					prompt  : { label : unit ? 'Cantidad de ' + unit.meta.plural_caption.value : 'Cantidad', rows : 1, type : 'number', enterEvent : true, value : _self.getQuantity(item.article, period) }
				}).prompt(function (button, modal) {
					helpers.api.post('/rations', {
						ration  : {
							tenant      : _self.selection.provider.tenant,
							provider    : _self.selection.provider.id,
							institution : _self.selection.institution.id,
							category    : item.category.id,
							group       : item.group.id,
							article     : item.article.id,
							period      : {
								type     : period.type,
								quantity : modal.value
							}
						},
						options : {
							replaceQuantity : true
						}
					}).then(function (res) {
						_self.$parent.log('Cantidad actualizada correctamente').information();
						_self.refreshRations();
					}).catch(function (err) {
						_self.$root.log(err).exception();
					});
				});
			}
		},
		data     : function () {
			return {
				rations       : null,
				anyRation     : false,
				selection     : {
					provider    : null,
					institution : null,
					categories  : null
				},
				hoveredPeriod : null,
				periods       : {
					monday    : { simbol : 'LU', label : 'Lunes', type : 'monday', weekday : true },
					tuesday   : { simbol : 'MA', label : 'Martes', type : 'tuesday', weekday : true },
					wednesday : { simbol : 'MI', label : 'Miercoles', type : 'wednesday', weekday : true },
					thursday  : { simbol : 'JU', label : 'Jueves', type : 'thursday', weekday : true },
					friday    : { simbol : 'VI', label : 'Viernes', type : 'friday', weekday : true },
					once      : { simbol : 'MS', label : 'Mensual', type : 'once', weekday : false },
					twice     : { simbol : 'QU', label : 'Quincenal', type : 'twice', weekday : false },
				}
			};
		}
	};
});