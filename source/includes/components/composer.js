'use strict';

anxeb.vue.include.component('composer', function (helpers) {

	return {
		template : '/components/composer.vue',
		props    : ['institution', 'provider', 'references', 'month'],
		created  : function () { },
		watch    : {
			month : function (value) {
				var _self = this;
				_self.refreshDays(function () {
					_self.refreshSheets();
				});
			}
		},
		mounted  : function () {
			var _self = this;

			_self.$root.page.busy();
			helpers.api.get('/references?type=unit&parent=any').then(function (res) {
				_self.units = res.data;
				_self.refreshDays();
			}).catch(function (err) {
				_self.$parent.log(err).exception();
			});

			_self.refresh();
		},
		computed : {},
		methods  : {
			getArticles         : function (category) {
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
			getSheet            : function (category, day) {
				var _self = this;
				var printDay = _self.prints[day.day];
				if (printDay != null) {
					var printedSheet = printDay[category.id];
					if (printedSheet != null) {
						return printedSheet;
					}
				}
				return null;
			},
			getSheetCellClasses : function (item, day) {
				var _self = this;
				var classes = [];
				var article = item.article;
				var cd = _self.sheets[day.day];
				var cell = cd ? cd[article.id] : null;
				var ration = _self.rations[article.id];
				var period = ration ? ration.periods[day.type.key] : null;
				var sheet = _self.getSheet(item.category, day);

				if (sheet && sheet.dates.printed != null) {
					return ['app-composer-cell-printed']
				}

				if (day.free || day.type.free) {
					classes.push('app-composer-day-free');
				}
				classes.push('app-composer-quantity');

				if (cell) {
					if (period) {
						if (period.quantity !== cell.quantity) {
							classes.push('app-composer-cell-override');
						} else {
							classes.push('app-composer-cell-normal');
						}
					} else {
						classes.push('app-composer-cell-outdate');
					}
				} else {
					if (period) {
						classes.push('app-composer-cell-normal');
					}
				}

				return classes;
			},
			getSheetCell        : function (article, day) {
				var cd = this.sheets[day.day];
				return cd ? cd[article.id] : null;
			},
			getQuantity         : function (article, day) {
				var _self = this;
				var cd = _self.sheets[day.day];
				var cell = cd ? cd[article.id] : null;

				if (cell) {
					return Number(parseFloat(cell.quantity).toFixed(2));
				} else if (_self.rations) {
					var ration = _self.rations[article.id];
					if (ration != null) {
						var iperiod = ration.periods[day.type.key];
						if (iperiod) {
							_self.anyRation = true;
							return Number(parseFloat(iperiod.quantity).toFixed(2));
						} else {
							return null;
						}
					}
				}
				return null;
			},
			getDefaultQuantity  : function (article, day) {
				var _self = this;
				var ration = _self.rations[article.id];
				if (ration != null) {
					var iperiod = ration.periods[day.type.key];
					if (iperiod) {
						_self.anyRation = true;
						return iperiod.quantity;
					}
				}
				return null;
			},
			getCategoryTotal    : function (category, day) {
				var _self = this;
				if (_self.rations) {
					/*var total = 0;
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
					return total;*/
				}
				return '';
			},
			getDateFormatted    : function (day) {
				var _self = this;
				return _self.periods[day.type.key].label + ' ' + day.day + ' de ' + _self.months[_self.calendar.month].label + ' del ' + _self.calendar.year;
			},
			getTimestamp        : function (day) {
				var _self = this;
				return {
					year  : _self.calendar.year,
					month : _self.calendar.month,
					day   : day.day
				};
			},
			getDetails          : function (category, day) {
				var _self = this;
				var details = [];
				for (var g = 0; g < category.groups.length; g++) {
					var group = category.groups[g];
					for (var a = 0; a < group.articles.length; a++) {
						var article = group.articles[a];
						var qt = _self.getQuantity(article, day);
						if (qt != null && qt > 0) {
							details.push({
								article  : article,
								quantity : qt
							});
						}
					}
				}
				return details;
			},
			download            : function (category, day) {
				var _self = this;
				var sheet = _self.getSheet(category, day);
				if (sheet && sheet.dates.printed) {
					window.open('/api/sheets/' + sheet.id + '/report', '_blank');
				}
			},
			print               : function (category, day) {
				var _self = this;
				var sheet = _self.getSheet(category, day);
				if (sheet && sheet.dates.printed) {
					_self.download(category, day);
				} else {

					var detailCount = _self.getDetails(category, day).length;

					if (detailCount > 0) {
						if (!day.free && !day.type.free) {
							_self.$parent.modal('¿Está seguro que quiere generar el coduce de este día?<br/><br/>' +
								'Fecha: <b>' + _self.getDateFormatted(day) + '</b><br/>' +
								'Centro: <b>' + _self.selection.institution.name + '</b><br/>' +
								'Modalidad: <b>' + category.name + '</b><br/>' +
								'Proveedor: <b>' + _self.selection.provider.name + '</b><br><br>' +
								'<span class="text-danger">Luego de este paso no podrá cambiar las cantidades de este día.</span>'
							).confirm(function () {
								_self.$root.page.busy();
								helpers.api.post('/sheets/print', {
									sheet : {
										provider    : _self.selection.provider.id,
										institution : _self.selection.institution.id,
										category    : category.id,
										timestamp   : _self.getTimestamp(day)
									}
								}).then(function (res) {
									_self.$parent.log('Conduce generado exitosamente').information();
									setTimeout(function () {
										_self.$parent.modal('¿Desea descargar el conduce para imprimir?').confirm(function () {
											_self.download(category, day);
										});
									}, 700);
									_self.refreshRations();
								}).catch(function (err) {
									_self.$root.log(err).exception();
								});
							});
						}
					} else {
						_self.$parent.log('Este día no tiene ningún artículo que entregar').exception();
					}
				}
			},
			edit                : function (item, day) {
				var _self = this;
				if (day.free || day.type.free) {
					return;
				}
				var sheet = _self.getSheet(item.category, day);
				if (sheet && sheet.dates.printed != null) {
					return;
				}

				var product = item.product;

				var unit = _self.units.filter(function (item) {
					return item.id === product.unit.value.id;
				})[0];


				var submitQuantity = function (value) {
					helpers.api.post('/sheets/ration', {
						ration : {
							provider    : _self.selection.provider.id,
							institution : _self.selection.institution.id,
							category    : item.category.id,
							timestamp   : _self.getTimestamp(day),
							article     : item.article.id,
							quantity    : value
						}
					}).then(function (res) {
						_self.$parent.log('Cantidad actualizada correctamente').information();
						_self.refreshRations();
					}).catch(function (err) {
						_self.$root.log(err).exception();
					});
				};

				var defaultQuantity = _self.getDefaultQuantity(item.article, day);
				var currentQuantity = _self.getQuantity(item.article, day);
				var different = defaultQuantity != currentQuantity;

				_self.$parent.modal({
					title   : _self.getDateFormatted(day),
					icon    : 'fa-calendar-check',
					message : 'Nueva ración de <b>' + item.product.name + '</b>',
					buttons : different ? [{
						text   : defaultQuantity == null ? 'Eliminar' : 'Restaurar',
						key    : 'RESET',
						class  : 'blue',
						close  : true,
						action : function (button, modal) {
							submitQuantity(defaultQuantity);
						}
					}] : null,
					prompt  : {
						label      : unit ? 'Cantidad de ' + unit.meta.plural_caption.value : 'Cantidad',
						rows       : 1,
						type       : 'number',
						enterEvent : true,
						value      : currentQuantity
					}
				}).prompt(function (button, modal) {
					submitQuantity(modal.value);
				});
			},
			getProductTotal     : function (item) {
				var _self = this;
				var total = 0;
				for (var d = 0; d < _self.calendar.days.length; d++) {
					var qt = _self.getQuantity(item.article, _self.calendar.days[d]);
					total += qt != null ? qt : 0;
				}
				return Number(parseFloat(total).toFixed(2));
			},
			getProductUnit      : function (item) {
				var _self = this;
				var unit = _self.units.filter(function (unit) {
					return unit.id === item.product.unit.value.id;
				})[0];

				return unit != null ? unit.meta.plural_sufix.value : '';
			},
			refreshDays         : function (callback) {
				var _self = this;
				_self.$root.page.busy();
				helpers.api.get('/calendar/days?month=' + _self.month).then(function (res) {
					_self.$root.page.idle();
					_self.calendar = res.data;
					if (callback) {
						callback();
					}
				}).catch(function (err) {
					_self.$parent.log(err).exception();
				});
			},
			anyArticle          : function (category) {
				var _self = this;

				if (!_self.rations) {
					return false;
				}

				var items = _self.getArticles(category);

				return items.filter(function (item) {
					return _self.rations[item.article.id] != null;
				}).length > 0;
			},
			refreshRations      : function () {
				var _self = this;

				_self.$root.page.busy();
				helpers.api.get('/composing/rations', {
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
							if (period) {
								_self.anyRation = true;
							}
						}
						_self.rations[ration.article] = ration;
					}

					_self.refreshSheets();
				}).catch(function (err) {
					_self.$root.log(err).exception();
				});
			},
			refreshSheets       : function () {
				var _self = this;

				_self.$root.page.busy();
				helpers.api.get('/composing/sheets', {
					params : {
						provider    : _self.selection.provider.id,
						institution : _self.selection.institution.id,
						year        : _self.calendar.year,
						month       : _self.calendar.month
					}
				}).then(function (res) {
					_self.sheets = {};
					_self.prints = {};

					for (var s = 0; s < res.data.length; s++) {
						var sheet = res.data[s];
						_self.sheets[sheet.timestamp.day] = _self.sheets[sheet.timestamp.day] || {};
						_self.prints[sheet.timestamp.day] = _self.prints[sheet.timestamp.day] || {};

						for (var d = 0; d < sheet.details.length; d++) {
							var detail = sheet.details[d];
							_self.sheets[sheet.timestamp.day][detail.article] = {
								detail,
								sheet    : sheet,
								quantity : detail.quantity
							};
						}
						if (sheet.dates.printed != null) {
							_self.prints[sheet.timestamp.day][sheet.category] = sheet;
						}
					}
					_self.$root.page.idle();
				}).catch(function (err) {
					_self.$root.log(err).exception();
				});
			},
			refresh             : function () {
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
						if (!_self.selection.institution) {
							_self.$root.log('Centro no encontrado').exception();
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
			doHover             : function (article, day) {
				if (day.free || day.type.free) {
					this.hoveredDay = null;
					this.hoveredArticle = null;
				} else {
					this.hoveredDay = day;
					this.hoveredArticle = article;
				}
			},
			clearHover          : function () {
				this.hoveredDay = null;
				this.hoveredArticle = null;
			}
		},
		data     : function () {
			return {
				rations        : null,
				sheets         : null,
				prints         : null,
				anyRation      : false,
				selection      : {
					provider    : null,
					institution : null,
					categories  : null
				},
				hoveredDay     : null,
				hoveredArticle : null,
				calendar       : null,
				months         : [
					{},
					{ label : 'Enero', index : 1 },
					{ label : 'Febrero', index : 2 },
					{ label : 'Marzo', index : 3 },
					{ label : 'Abril', index : 4 },
					{ label : 'Mayo', index : 5 },
					{ label : 'Junio', index : 6 },
					{ label : 'Julio', index : 7 },
					{ label : 'Agosto', index : 8 },
					{ label : 'Septiembre', index : 9 },
					{ label : 'Octubre', index : 10 },
					{ label : 'Noviembre', index : 11 },
					{ label : 'Diciembre', index : 12 },
				],
				periods        : {
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