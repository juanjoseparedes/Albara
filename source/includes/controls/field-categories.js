'use strict';

anxeb.vue.include.component('field-categories', function (helpers) {

	var _updating = false;

	return {
		template     : '/controls/field-categories.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'type', 'value', 'single', 'direction'],
		mounted      : function () {
			var _self = this;
			this.name = _self.$vnode.data.model != null ? (_self.$vnode.data.model.expression + '.value.id') : null;

			var box = $(_self.$refs.box);
			var button = $(_self.$refs.browseButton);

			$(document).mouseup(function (e) {
				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0) {
					//nothig
				} else {
					_self.reset();
				}
			});
		},
		created      : function () {
			var _self = this;
			this.init(function () {
				_self.normalize();
			});
		},
		data         : function () {
			return {
				name         : null,
				branches     : null,
				selected     : null,
				canBrowse    : false,
				singleBranch : null
			}
		},
		methods      : {
			clear      : function () {
				var _self = this;
				_self.uniselect();
				if (_self.isSingle) {
					_self.$emit('input', null);
				} else {
					_self.$emit('input', []);
				}
				_self.reset();
			},
			init       : function (callback) {
				_updating = true;
				var _self = this;
				_self.branches = [];
				_self.$root.page.busy();
				helpers.api.get('/references', { params : { type : _self.type, childs : 'count' } }).then(function (res) {
					_self.$root.page.idle();

					for (var i = 0; i < res.data.length; i++) {
						var reference = res.data[i];
						var branch = {
							root  : reference,
							value : null,
							count : reference.childs
						};
						_self.branches.push(branch);
					}

					if (callback) {
						callback();
					}
				}).catch(function (err) {
					_self.$parent.log(err).exception();
				});
			},
			normalize  : function () {
				var _self = this;
				var values = _self.value;
				if (values) {
					_updating = true;

					if (_self.isSingle) {
						for (var i = 0; i < _self.branches.length; i++) {
							var branch = _self.branches[i];
							var item = values;
							if (item.root.id === branch.root.id) {
								branch.value = item.value;
								break;
							}
						}
					} else {
						for (var i = 0; i < _self.branches.length; i++) {
							var branch = _self.branches[i];
							for (var c = 0; c < values.length; c++) {
								var item = values[c];
								if (item.root.id === branch.root.id) {

									branch.value = item.value;
									break;
								}
							}
						}
					}
				}

				/*if (values) {
					for (var c = 0; c < values.length; c++) {
						var item = values[c];
						if (item.root.id === branch.root.id) {
							branch.value = item.value;
							break;
						}
					}
				}*/
			},
			browse     : function () {
				var _self = this;

				var toggle = function () {
					_self.canBrowse = !_self.canBrowse;
					if (!_self.canBrowse) {
						_self.reset();
					}
				};

				if (_self.branches == null) {
					_self.init(function () {
						_self.normalize();
						toggle();
					});
				} else {
					toggle();
				}
			},
			reset      : function () {
				this.canBrowse = false;
				this.selected = null;
			},
			remove     : function (branch) {
				branch.value = null;
			},
			select     : function (reference) {
				if (this.selected === reference) {
					this.selected = null;
				} else {
					this.selected = reference;
				}
			},
			uniselect  : function (branch) {
				var _self = this;
				for (var i = 0; i < _self.branches.length; i++) {
					var item = _self.branches[i];
					if (branch != null && item.root.id === branch.root.id) {
						item.value = branch.value;
					} else {
						item.value = null;
					}
				}
			},
			onSelected : function (branch) {
				var _self = this;
				if (_self.isSingle) {
					_self.uniselect(branch);
					_self.canBrowse = false;
				}
			}
		},
		computed     : {
			isSingle : function () {
				return this.single === true || this.single === 'true';
			},
			anyValue : function () {
				var _self = this;
				if (_self.value != null) {
					if (_self.isSingle) {
						return true;
					} else {
						return _self.value.length > 0;
					}
				} else {
					return false;
				}
			}
		},
		watch        : {
			value    : function (values) {
				var _self = this;
				_self.normalize();
			},
			branches : {
				handler : function (value) {
					if (_updating) {
						_updating = false;
						return;
					}
					var _self = this;

					var result = [];
					for (var i = 0; i < _self.branches.length; i++) {
						var branch = _self.branches[i];
						if (branch.value) {
							result.push({
								root  : { id : branch.root.id, name : branch.root.name, type : branch.root.type, meta : branch.root.meta },
								value : { id : branch.value.id, name : branch.value.name, type : branch.value.type, meta : branch.value.meta },
							});
						}
					}

					if (_self.isSingle) {
						_self.$emit('input', result.length > 0 ? result[0] : null);
					} else {
						_self.$emit('input', result);
					}
				},
				deep    : true
			}
		}
	};
});