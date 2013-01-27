define(['knockout','jquery'],function(ko,$){
	var innerBound = function(el, valueAccessor){
		var options = ko.utils.unwrapObservable(valueAccessor());
		var $bound = $(el).find(options.bound);
		var $handle = $(el).find(options.handle);
		var width = 0;
		function update(){
			if(width==$handle.width()) return;
			width = $handle.width();
			var halfWidth = width/2;
			$bound.css('width',$(el).width()-$handle.width())
				.css('marginLeft',halfWidth)
				.css('marginRight',halfWidth);
			$handle.css('marginLeft',-halfWidth);
		}
		var interval = setInterval(update,100);
		ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
			clearInterval(interval);
		});
		update();
	}
	ko.bindingHandlers.innerBound = {
		init:innerBound
	}
});

