'use strict';

anxeb.vue.include.helper('browse', {
	image : function (params) {
		return new Promise(function (resolve, reject) {
			var input = document.createElement('input');
			input.type = 'file';

			input.onchange = function () {
				if (this.files && this.files[0]) {
					var file = this.files[0];

					if (file) {
						var reader = new FileReader();
						reader.onloadend = function () {
							var width = (params !== undefined ? params.width : null) || 800;
							var height = (params !== undefined ? params.height : null) || 800;

							var tempImg = new Image();
							tempImg.onload = function () {
								var maxWidth = width;
								var maxHeight = height;
								var tempW = tempImg.width;
								var tempH = tempImg.height;

								if (tempW > tempH) {
									if (tempW > maxWidth) {
										tempH *= maxWidth / tempW;
										tempW = maxWidth;
									}
								} else {
									if (tempH > maxHeight) {
										tempW *= maxHeight / tempH;
										tempH = maxHeight;
									}
								}

								var crop = 0;
								var canvas = document.createElement('canvas');
								canvas.width = tempW;
								canvas.height = tempH;
								var ctx = canvas.getContext('2d');
								ctx.drawImage(this, 0, crop, tempW, tempH - crop);

								canvas.toBlob(function (blob) {
									resolve({
										href : URL.createObjectURL(blob),
										data : canvas.toDataURL(file.type)
									});
								}, file.type);
							};
							tempImg.onerror = function (err) {
								if (reject) {
									reject(err)
								}
							};
							tempImg.src = reader.result;
						};
						reader.readAsDataURL(file);
					} else {
						if (reject) {
							reject();
						}
					}
				}
			};
			input.click();
		});
	}
});