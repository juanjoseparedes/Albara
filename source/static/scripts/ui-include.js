(function ($) {
  	"use strict";
  	
	var promise = false,
		deferred = $.Deferred();
	_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
	$.fn.uiInclude = function(){
		if(!promise){
			promise = deferred.promise();
		}

		compile(this);

		function compile(node){
			node.find('[ui-include]').each(function(){
				var that = $(this),
					url  = that.attr('ui-include');
				promise = promise.then( 
					function(){
						var request = $.ajax({
							url: eval(url),
							method: "GET",
							dataType: "text"
						});

						var chained = request.then(
							function(text){
								var compiled = _.template(text.toString());
								var html = compiled({app: app});
								var ui = that.replaceWithPush( html );
				    			ui.find('[ui-jp]').uiJp();
								ui.find('[ui-include]').length && compile(ui);
							}
						);
						return chained;
					}
				);
			});
		}

		deferred.resolve();
		return promise;
	}

	$.fn.replaceWithPush = function(o) {
	    var $o = $(o);
	    this.replaceWith($o);
	    return $o;
	}

})(jQuery);
