'use strict';

anxeb.vue.include.component('field-lookup', function (helpers) {

	return {
		template     : '/controls/field-lookup.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'value', 'direction', 'source', 'binding'],
		mounted      : function () {
			var _self = this;
			this.name = _self.$vnode.data.model != null ? (_self.$vnode.data.model.expression) : null;

			var box = $(_self.$refs.box);
			var button = $(_self.$refs.browseButton);

			$(document).mouseup(function (e) {
				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0) {
					//nothig
				} else {
					_self.reset();
				}
			});

			_self.updatePreview();
		},
		data         : function () {
			return {
				name          : null,
				canBrowse     : false,
				result        : null,
				search        : null,
				canSearchTick : 0,
				selected      : null,
				preview       : null,
				busy          : {
					searching : false,
					display   : false
				}
			}
		},
		computed     : {
			anyValue : function () {
				var _self = this;
				return _self.value != null && _self.preview != null;
			}
		},
		methods      : {
			updatePreview : function () {
				var _self = this;
				if (_self.source && _self.source.item && _self.value != null) {
					_self.setBusy();
					helpers.api.get(_self.source.item + '/' + _self.value).then(function (res) {
						_self.preview = res.data;
						_self.$emit('change', _self.preview);
						_self.selected = null;
						_self.setIdle();
					}).catch(function (err) {
						_self.setIdle();
						_self.$root.log(err).exception();
					});
				}
			},
			setIdle       : function () {
				var _self = this;
				_self.busy.searching = false;
				_self.busy.display = false;
			},
			setBusy       : function () {
				var _self = this;
				_self.busy.searching = true;
				setTimeout(function () {
					if (_self.busy.searching) {
						_self.busy.display = true;
					}
				}, 80);
			},
			browse        : function () {
				var _self = this;
				_self.reset();
				_self.canBrowse = !_self.canBrowse;

				if (_self.canBrowse) {
					setTimeout(function () {
						$(_self.$refs.search).focus();
					}, 0);
				}
			},
			query         : function () {
				var _self = this;
				if (_self.source) {
					_self.setBusy();

					var lookupCopy = _self.search;
					helpers.api.get(_self.source.list, { params : { lookup : lookupCopy } }).then(function (res) {
						if (lookupCopy === _self.search) {
							_self.result = res.data;
							_self.selected = null;
							_self.setIdle();
						}
					}).catch(function (err) {
						_self.setIdle();
						_self.$root.log(err).exception();
					});
				}
			},
			searchChanged : function (event) {
				var _self = this;

				if (event.target.value != null && event.target.value.length > 0 && _self.search !== event.target.value) {
					_self.search = event.target.value;

					var checkTick = function () {
						if (_self.canSearchTick > 0) {
							setTimeout(function () {
								_self.canSearchTick--;
								if (_self.canSearchTick === 0) {
									_self.query();
								} else {
									checkTick();
								}
							}, 20);
						}
					};

					if (_self.canSearchTick === 0) {
						_self.canSearchTick = 8;
						checkTick();
					} else {
						_self.canSearchTick = 8;
					}
				}
			},
			clear         : function () {
				this.$emit('input', null);
				this.preview = null;
				this.reset();
			},
			reset         : function () {
				var _self = this;
				_self.search = null;
				_self.canBrowse = false;
				_self.result = null;
				$(_self.$refs.search).val('');
			},
			select        : function (item, enter) {
				var _self = this;
				if (item != null) {
					_self.selected = item;
				} else if (_self.selected == null && _self.result != null && _self.result.length > 0) {
					_self.selected = _self.result[0];
				}

				if (enter === true) {
					_self.enter();
				}
			},
			up            : function () {
				var _self = this;
				if (_self.selected) {
					_self.select(_self.bounds().prev);
				} else {
					_self.select();
				}
			},
			down          : function () {
				var _self = this;
				if (_self.selected) {
					_self.select(_self.bounds().next);
				} else {
					_self.select();
				}
			},
			bounds        : function () {
				var _self = this;
				var result = {
					prev : null,
					next : null
				};
				if (_self.selected != null && _self.result != null) {
					for (var i = 0; i < _self.result.length; i++) {
						var item = _self.result[i];
						if (item.id === _self.selected.id) {
							result.prev = i >= 1 ? _self.result[i - 1] : null;
							result.next = i < _self.result.length - 1 ? _self.result[i + 1] : null;
						}
					}
				}

				return result;
			},
			cancel        : function () {
				this.reset();
			},
			enter         : function () {
				var _self = this;
				if (_self.selected) {
					_self.$emit('input', _self.selected.id);
					_self.preview = _self.selected;
					this.reset();
				} else {
					this.reset();
				}
			}
		},
		watch        : {
			value : function (value) {
				this.updatePreview();
			}
		}
	};
});