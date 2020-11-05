'use strict';

anxeb.vue.include.scope('categories/detail', function (helpers, instance) {
	return {
		created  : function () {
			var _self = this;
			_self.refresh();
		},
		methods  : {
			refreshArticles : function (msg, callback) {
				var _self = this;

				if (_self.selectedGroup != null) {
					if (_self.selectedGroup.articles.length > 0) {
						helpers.api.get('/articles', {
							params : {
								ids : _self.selectedGroup.articles.map(function (article) {
									return article.product
								})
							}
						}).then(function (res) {
							_self.articles = res.data;

							if (msg === true) {
								_self.log('Productos recargados correctamente').information();
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
						_self.articles = [];
						if (callback) {
							callback();
						}
					}
				} else {
					if (callback) {
						callback();
					}
				}
			},
			editGroup       : function (group, index) {
				var _self = this;
				_self.modal({
					title   : 'Editar Grupo',
					message : 'Digite el nuevo nombre del grupo:',
					prompt  : { label : 'Nombre', enterEvent : true, rows : 1, value : group.name }
				}).confirm(function (button, modal) {
					group.name = modal.value;

					_self.flashSave(function () {
						_self.$parent.log('Grupo actualizado correctamente').information();
					});
				});
			},
			removeGroup     : function (group, index) {
				var _self = this;
				_self.$parent.modal({ title : 'Grupos', message : '¿Está seguro que quiere eliminar este grupo?' }).confirm(function () {
					_self.category.groups.splice(index, 1);

					if (_self.selectedGroup != null && group.id === _self.selectedGroup.id) {
						_self.selectedGroup = null;
					}

					_self.flashSave(function () {
						_self.$parent.log('Grupo eliminado correctamente').information();
					});
				});
			},
			selectGroup     : function (group) {
				var _self = this;

				if (group == null) {
					if (_self.selectedGroup == null && _self.category != null && _self.category.groups.length > 0) {
						_self.selectedGroup = _self.category.groups[0];
					} else {
						_self.selectedGroup = _self.category ? _self.category.groups.filter(function (item) {
							return item.id === _self.selectedGroup.id;
						})[0] : _self.selectedGroup;

						if (_self.selectedGroup == null && _self.category != null && _self.category.groups.length > 0) {
							_self.selectedGroup = _self.category.groups[0];
						}
					}
				} else {
					_self.selectedGroup = group;
				}

				_self.refreshArticles();
			},
			addGroup        : function () {
				var _self = this;
				_self.modal({
					title   : 'Agregar Grupo',
					message : 'Digite el nombre del grupo:',
					prompt  : { label : 'Nombre', enterEvent : true, rows : 1 }
				}).confirm(function (button, modal) {
					_self.category.groups.push({ name : modal.value, articles : [] });
					_self.selectGroup();
					_self.flashSave(function () {
						_self.$parent.log('Grupo agregado correctamente').information();
					});
				});
			},
			getArticlePrice : function (productId) {
				var article = this.getArticle(productId);
				return (article ? article.prices : null) || {}
			},
			getArticle      : function (productId) {
				var _self = this;
				var article = _self.selectedGroup.articles.filter(function (item) {
					return item.product === productId;
				})[0];
				return article;
			},
			flashSave       : function (callback) {
				var _self = this;
				_self.refreshArticles(false, function () {
					if (!_self.isNew) {
						_self.save(callback);
					}
				});
			},
			removeArticle   : function (row) {
				var _self = this;

				_self.modal({ title : 'Productos Asociados', message : '¿Está seguro que quiere desasociar este producto?' }).confirm(function () {
					_self.selectedGroup.articles = _self.selectedGroup.articles.filter(function (item) {
						return item.product !== row.id;
					});
					_self.flashSave(function () {
						_self.$parent.log('Artículo desasociado correctamente').information();
					});
				});
			},
			editArticle     : function (article) {
				var _self = this;
				_self.$parent.modal('form-article').form({
					group : _self.selectedGroup,
					model : article
				}).then(function (result) {
					for (var key in article) {
						article[key] = result[key];
					}
					_self.flashSave(function () {
						_self.$parent.log('Artículo actualizado correctamente').information();
					});
				}).catch(function () {});
			},
			addArticle      : function () {
				var _self = this;
				if (_self.selectedGroup != null) {
					_self.$parent.modal('form-article').form({
						group : _self.selectedGroup,
						model : null
					}).then(function (article) {
						_self.selectedGroup.articles.push(article);
						_self.flashSave(function () {
							_self.$parent.log('Artículo asociado correctamente').information();
						});
					}).catch(function () {});
				}
			},

			refresh(msg) {
				var _self = this;

				if (_self.isNew) {
					_self.page.setup({
						title  : 'Nueva Modalidad',
						icon   : 'fa-arrow-left',
						action : function () {
							_self.close();
						}
					});
				} else {
					_self.page.busy();
					helpers.api.get('/categories/' + _self.$route.params.categoryId).then(function (res) {
						_self.category = res.data;

						_self.page.setup({
							title  : 'Detalle Modalidad ' + _self.category.name,
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

						_self.selectGroup();

						if (msg === true) {
							_self.log('Modalidad recargada correctamente').information();
						} else {
							_self.page.idle();
						}
					}).catch(function (err) {
						_self.$root.log(err).exception();
					});
				}
			},
			saveAndBack : function () {
				this.save(function () {
					helpers.root.navigate('/categories/list');
				});
			},
			save        : function (callback) {
				var _self = this;

				helpers.api.post('/categories', {
					category : helpers.tools.data.copy(_self.category)
				}).then(function (res) {
					if (_self.isNew) {
						_self.category = res.data;
						helpers.root.navigate('/categories/' + _self.category.id + '/detail');
					}
					if (callback) {
						callback(res.data);
					} else {
						_self.log('Modalidad actualizada correctamente').information();
					}
				}).catch(function (err) {
					helpers.tools.highlight(err, {
						prefix : 'category'
					});
				});
			},
			close       : function () {
				var _self = this;
				if (!_self.$route.params.categoryId) {
					_self.$parent.modal('¿Está seguro que quiere desestimar esta modalidad?').confirm(function () {
						helpers.root.navigate('/categories/list');
					});
				} else {
					helpers.root.navigate('/categories/list');
				}
			}
		},
		computed : {
			isNew : function () {
				return this.$route.params.categoryId === undefined;
			}
		},
		data     : function () {
			return {
				enums         : {},
				selectedGroup : null,
				articles      : [],
				category      : {
					name        : null,
					code        : null,
					description : null,
					groups      : []
				}
			};
		}
	}
});