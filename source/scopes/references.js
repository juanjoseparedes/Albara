'use strict';

anxeb.vue.include.scope('references', function (helpers, instance) {
	return {
		watch    : {
			$route(to, from) {
				if (!this.$route.params.referenceId) {
					this.close();
				}
			}
		},
		mounted  : function () {
			var _self = this;

			if (!_self.route) {
				_self.log('Ruta inválida').information();
				return;
			}

			_self.page.setup({
				title : _self.route.title,
				icon  : 'fa-stream'
			});

			_self.page.menu.add({
				caption : 'Refrescar',
				hint    : 'Refrescar',
				icon    : 'fa-sync',
				action  : function () {
					_self.refresh(true);
				}
			});
		},
		methods  : {
			stepup    : function () {
				var _self = this;
				instance.navigate('/references/' + (_self.route.parent ? _self.route.parent.name : _self.route.name), _self.parent && _self.parent.parent ? { parent : _self.parent.parent } : undefined).then(function () {
					_self.parent = null;
					_self.selected = null;
					_self.refresh();
				}).catch(function (err) {
					_self.log(err).exception();
				});
			},
			stepdown  : function (reference, selection) {
				var _self = this;
				instance.navigate('/references/' + (_self.route.child.name || _self.route.name), { parent : reference.id }).then(function () {
					_self.selected = null;
					_self.refresh();

					if (selection){
						_self.select(selection);
					}
				}).catch(function (err) {
					_self.log(err).exception();
				});
			},
			close     : function () {
				var _self = this;
				if (_self.$route.path === '/references/' + _self.$route.params.type) {
					_self.selected = null;
					_self.parent = null;
					_self.refresh();
				} else {
					instance.navigate('/references/' + _self.$route.params.type, _self.parent ? { parent : _self.parent.id } : undefined).then(function () {
						_self.selected = null;
						_self.refresh();
					}).catch(function (err) {
						_self.log(err).exception();
					});
				}
			},
			prepare   : function (reference) {
				var _self = this;
				reference.meta = reference.meta || {};
				if (_self.route && _self.route.meta) {
					for (var key in _self.route.meta) {
						var fdef = _self.route.meta[key];
						var meta = reference.meta[key] || {};
						reference.meta[key] = meta;
						meta.label = fdef.label;
						meta.type = fdef.type;
						meta.value = meta.value || null;
					}
				}
				return reference;
			},
			select    : function (reference, callback) {
				var id = typeof reference === 'object' ? reference.id : reference;
				var _self = this;
				_self.page.busy();
				helpers.api.get('/references/' + id, { params : { childs : 'items' } }).then(function (res) {
					_self.selected = _self.prepare(res.data);

					var section = _self.$route.path.endsWith('/detail') ? 'detail' : 'items';
					if (_self.route.child.last) {
						section = 'detail';
					}
					instance.navigate('/references/' + _self.$route.params.type + '/' + id + '/' + section, _self.parent ? { parent : _self.parent.id } : undefined).then(function () {
						if (callback) {
							callback();
						}
						_self.page.idle();
					}).catch(function (err) {
						_self.log(err).exception();
					});
				}).catch(function (err) {
					_self.log(err).exception();
				});
			},
			remove    : function (item, refresh) {
				var _self = this;
				_self.modal({
					title   : 'Eliminar ' + _self.types[item.type].caption,
					message : '¿Está seguro que quiere eliminar <b>' + item.name + '</b> del listado de ' + _self.types[item.type].plural
				}).confirm(function () {
					_self.page.busy();
					helpers.api.delete('/references/' + item.id).then(function (res) {
						if (refresh === true) {
							_self.refresh();
						} else {
							_self.close();
						}
						_self.log('Elemento eliminado correctamente').information();
					}).catch(function () {});
				});
			},
			add       : function (parent) {
				var _self = this;
				_self.modal({
					title   : 'Agregar ' + (parent ? _self.route.child.caption : _self.route.caption),
					message : 'Introduzca uno o varios elementos:',
					prompt  : { label : 'Valores', rows : 6 }
				}).confirm(function (button, modal) {
					helpers.api.post('/references', {
						reference : {
							names  : modal.value.split('\n').filter(function (item) {
								return item != null && item.length > 0;
							}),
							type   : parent ? (_self.route.child.type || parent.type) : _self.route.type,
							parent : parent ? parent.id : (_self.parent ? _self.parent.id : undefined),
						}
					}).then(function (res) {
						_self.log('Elementos agregados correctamente').information();
						_self.refresh();
					}).catch(function () {});
				});
			},
			edit      : function (item) {
				var _self = this;
				_self.modal({
					title     : 'Editar ' + _self.types[item.type].caption,
					component : 'form-reference'
				}).form(_self.prepare(item)).then(function () {
					_self.log('Elemento actualizado correctamente').information();
					_self.refresh();
				}).catch(function (err) {
					_self.log(err).exception();
				});


				/*_self.modal({
					title   : 'Editar ' + _self.types[item.type].caption,
					message : 'Digite el nuevo valor del elemento:',
					prompt  : { label : _self.route.child.caption, enterEvent : true, rows : 1, value : item.name }
				}).confirm(function (button, modal) {
					_self.save(helpers.tools.data.copy(item, { name : modal.value }));
				});*/
			},
			save      : function (reference) {
				var _self = this;
				helpers.api.post('/references', {
					reference : reference
				}).then(function (res) {
					_self.log('Elemento actualizado correctamente').information();
					_self.refresh();
				}).catch(function (err) {
					helpers.tools.highlight(err, {
						prefix : '$parent.selected'
					});
				});
			},
			refresh(msg) {
				var _self = this;
				_self.page.busy();

				var loadReferences = function () {
					helpers.api.get('/references', { params : { type : _self.route.type, childs : 'count', parent : _self.parent ? _self.parent.id : undefined } }).then(function (res) {
						_self.references = res.data;
						if (msg === true) {
							_self.log('Referencias cargadas correctamente').information();
						} else {
							_self.page.idle();
						}

						if (_self.$route.params.referenceId) {
							_self.select(_self.$route.params.referenceId);
						}
					}).catch(function (err) {
						_self.log(err).exception();
					});
				};

				if (_self.$route.query.parent) {
					helpers.api.get('/references/' + _self.$route.query.parent).then(function (res) {
						_self.parent = res.data;
						_self.page.setup({
							title  : _self.route.title + ' en ' + _self.parent.name,
							icon   : 'fa-arrow-left',
							action : function () {
								_self.stepup();
							}
						});

						loadReferences();
					}).catch(function (err) {
						_self.log(err).exception();
					});
				} else {
					_self.parent = null;
					_self.page.setup({
						title : _self.route.title,
						icon  : 'fa-stream'
					});
					loadReferences();
				}
			},
			normalize : function () {
				var _self = this;
				_self.types = {};

				for (var name in _self.routes) {
					var route = _self.routes[name];
					route.name = name;
					route.last = false;
					_self.types[route.type] = route;

					if (typeof route.child === 'string') {
						var defChild = {
							he       : true,
							title    : 'Lista de Elementos',
							caption  : 'Elemento',
							plural   : 'Elementos',
							last     : route.child === '!',
							infinite : route.child === '*'
						};
						route.child = _self.routes[route.child] || defChild;
						route.child.parent = route;
					}
				}
			}
		},
		created  : function () {
			this.normalize();
			this.refresh();
		},
		computed : {
			type  : function () {
				return this.route ? this.route.type : null;
			},
			route : function () {
				return this.routes[this.$route.params.type];
			}
		},
		data     : function () {
			return {
				references : null,
				selected   : null,
				parent     : null,
				types      : null,
				routes     : {
					regions   : { he : true, title : 'Lista de Regiones', caption : 'Región', plural : 'Regiones', type : 'region', child : 'provinces' },
					provinces : { he : false, title : 'Lista de Provincias', caption : 'Provincia', plural : 'Provincias', type : 'province', child : 'cities' },
					cities    : { he : false, title : 'Lista de Ciudades', caption : 'Ciudad', plural : 'Ciudades', type : 'city', child : '!' },
					units     : {
						he   : false, title : 'Unidades de Medidas', caption : 'Unidad de Medida', plural : 'Unidades de Medidas', type : 'unit', child : '*',
						meta : {
							plural_sufix   : { label : 'Sufijo Plural', type : 'text' },
							singular_sufix : { label : 'Sufijo Singular', type : 'text' },
							plural_caption : { label : 'Nombre Plural', type : 'text' }
						}
					},
					vats      : {
						he   : false, title : 'Clases Impositivas', caption : 'Clase Impositiva', plural : 'Clases Impositivas', type : 'vat', child : '*',
						meta : { vat : { label : 'Impuesto (%)', type : 'number' } }
					},
				},
				enums      : {},
			};
		}
	}
});