'use strict';

anxeb.vue.include.helper('tools', {
	data          : {
		copy : function (data, params) {
			var result = JSON.parse(JSON.stringify(data));
			if (params) {
				for (var p in params) {
					result[p] = params[p];
				}
			}
			return result;
		}
	},
	requiredError : function (prefix, fields, newMsg) {
		var _fields = [];
		var msg = newMsg || 'Uno o varios campos son requeridos en la solicitud';

		for (var f = 0; f < fields.length; f++) {
			_fields.push({
				name  : fields[f],
				index : f
			})
		}

		if (_fields.length > 0) {
			var err = {
				message : msg,
				code    : 8005,
				meta    : {
					fields : _fields
				}
			};

			this.highlight(err, {
				prefix : prefix
			});

			return err;
		} else {
			return null;
		}
	},
	unhighlight   : function () {
		$("form .app-invalid-field").removeClass("app-invalid-field");
	},
	highlight     : function (err, params) {
		$("form .app-invalid-field").removeClass("app-invalid-field");

		if (!err) {
			return;
		}

		var prefix = (params && params.prefix ? params.prefix : 'model');
		var fields = err.meta && err.meta.fields ? err.meta.fields : (err.inner && err.inner.meta && err.inner.meta.fields ? err.inner.meta.fields : []);

		var inx = null;
		var focusField = null;

		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];
			var container = $("[field-name='" + prefix + "." + field.name + "']");
			container.addClass("app-invalid-field");

			if (field.index !== undefined) {
				if (inx === null || inx > field.index) {
					inx = field.index;
					focusField = field.name;
				}
			}
		}
		if (focusField) {
			$("[field-name='" + prefix + "." + focusField + "'] input").focus();
			$("[field-name='" + prefix + "." + focusField + "'] select").focus();
			$("[field-name='" + prefix + "." + focusField + "'] textarea").focus();
		}
	}
});