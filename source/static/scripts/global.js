(function ($) {
	'use strict';

	function init() {
		$('[ui-jp]').uiJp();
		$('body').uiInclude();
	}

	$(document).on('pjaxStart', function () {
		$('#aside').modal('hide');
		$('body').removeClass('modal-open').find('.modal-backdrop').remove();
		$('.navbar-toggleable-sm').collapse('hide');
	});

	moment.locale('es');

	init();

})(jQuery);