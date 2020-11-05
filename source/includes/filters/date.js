'use strict';

anxeb.vue.include.filter('date', function (value, params) {
	if (value) {
		var date = moment(String(value));
		if (params === 'short') {
			return date.format('D [de] MMMM');
		} else if (params === 'full') {
			return date.format('D [de] MMMM YYYY');
		} else if (params === 'timed') {
			return date.format('DD/MM/YYYY h:mm:A');
		} else {
			return date.format('D/M/YYYY');
		}
	}
});