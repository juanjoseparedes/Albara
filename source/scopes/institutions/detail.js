'use strict';

anxeb.vue.include.scope('institutions/detail', function (helpers, instance) {
	return {
		created  : function () {
			var _self = this;
			_self.refresh();
		},
		methods  : {
			refresh(msg) {
				var _self = this;

				if (_self.isNew) {
					_self.categories = [];
					_self.page.setup({
						title  : 'Nuevo Centro o Institutión',
						icon   : 'fa-arrow-left',
						action : function () {
							_self.close();
						}
					});
				} else {
					_self.page.busy();
					helpers.api.get('/institutions/' + _self.$route.params.institutionId).then(function (res) {
						_self.institution = res.data;
						_self.refreshCategories();

						_self.page.setup({
							title  : _self.institution.name + ' / ' + _self.institution.code,
							icon   : 'fa-arrow-left',
							action : function () {
								_self.close();
							}
						});

						_self.page.menu.add({
							caption : 'Refrescar',
							hint    : 'Refrescar Detalle',
							icon    : 'fa-tags',
							action  : function () {
								_self.refresh(true);
							}
						});

						if (msg === true) {
							_self.log('Centro recargado correctamente').information();
						} else {
							_self.page.idle();
						}
					}).catch(function (err) {
						_self.$root.log(err).exception();
					});
				}
			},
			saveAndBack       : function () {
				var _self = this;
				_self.save(function () {
					_self.close(true);
				});
			},
			save              : function (callback) {
				var _self = this;
				_self.institution.identity.type = 'rnc';

				helpers.api.post('/institutions', {
					institution : helpers.tools.data.copy(_self.institution)
				}).then(function (res) {
					if (_self.isNew) {
						_self.institution = res.data;
						helpers.root.navigate('/institutions/' + _self.institution.id + '/detail');
					}
					if (callback) {
						callback(res.data);
					} else {
						_self.log('Centro actualizado correctamente').information();
					}
				}).catch(function (err) {
					helpers.tools.highlight(err, {
						prefix : 'institution'
					});
				});
			},
			close             : function (force) {
				var _self = this;
				if (!_self.$route.params.institutionId && !force) {
					_self.$parent.modal('¿Está seguro que quiere desestimar este centro?').confirm(function () {
						helpers.root.navigate('/institutions/list');
					});
				} else {
					helpers.root.navigate('/institutions/list');
				}
			},
			refreshCategories : function (msg, callback) {
				var _self = this;

				if (_self.institution.categories && _self.institution.categories.length > 0) {
					helpers.api.get('/categories', {
						params : {
							ids : _self.institution.categories
						}
					}).then(function (res) {
						_self.categories = res.data;

						if (msg === true) {
							_self.log('Modalidades recargadas correctamente').information();
						} else {
							_self.page.idle();
						}
						if (callback) {
							callback();
						}
					}).catch(function (err) {
						_self.$root.log(err).exception();
					});
				} else {
					_self.categories = [];
					if (callback) {
						callback();
					}
				}
			},
			flashSave         : function (callback) {
				var _self = this;
				_self.refreshCategories(false, function () {
					if (!_self.isNew) {
						_self.save(callback);
					} else {
						callback();
					}
				});
			},
			removeCategory    : function (category) {
				var _self = this;

				_self.modal({ title : 'Modalidades Asociadas', message : '¿Está seguro que quiere desasociar esta modalidad?' }).confirm(function () {
					_self.institution.categories = _self.institution.categories.filter(function (categoryId) {
						return categoryId !== category.id;
					});

					_self.flashSave(function () {
						_self.$parent.log('Modalidad desasociada correctamente').information();
					});
				});
			},
			addCategory       : function () {
				var _self = this;
				if (_self.institution != null) {
					_self.$parent.modal('lookup-category').form({ invalidate : _self.institution.categories }).then(function (categoryId) {
						_self.institution.categories = _self.institution.categories || [];
						_self.institution.categories.push(categoryId);

						_self.flashSave(function () {
							_self.$parent.log('Modalidad asociada correctamente').information();
						});
					}).catch(function () {});
				}
			},
		},
		computed : {
			isNew : function () {
				return this.$route.params.institutionId === undefined;
			}
		},
		data     : function () {
			return {
				enums       : {
					types  : {
						primary   : 'Primaria',
						secundary : 'Secundaria',
						mixed     : 'Mixta',
						other     : 'Otra',
					},
					states : {
						active   : 'Activo',
						inactive : 'Inactivo'
					}
				},
				categories  : null,
				institution : {
					name       : null,
					type       : null,
					identity   : {
						type   : 'rnc',
						number : null
					},
					code       : null,
					phone      : null,
					email      : null,
					director   : {
						first_name : null,
						last_name  : null,
						phone      : null,
						email      : null,
					},
					location   : null,
					address    : null,
					categories : null,
				}
			};
		}
	}
});