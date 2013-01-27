define(['knockout','jquery'],function(ko,$){
	var followLeft = function(el, valueAccessor,all){
		var $target = $(ko.utils.unwrapObservable(valueAccessor()));
		function update(){
			$target.css('left',($(el).position().left+$(el).width()+15)+'px');
		}
		$(el).data('followUpdate',update);
		var interval = setInterval(update,100);
		ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
			clearInterval(interval);
		});
	}
	ko.bindingHandlers.followLeft = {
		init: followLeft,
		update:function(el){
			setTimeout($(el).data('followUpdate'),0);
		}
	}
	return ko;
});
