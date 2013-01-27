define(['knockout','jquery'],function(ko,$){
	ko.bindingHandlers.caption = {
		init: function(el, valueAccessor,allBindingsAccessor){
			var options = allBindingsAccessor().captionOptions || {};
			var value = ko.utils.unwrapObservable(valueAccessor());
			$(el).data('captionTarget',options.target);
			$(el).data('captionText',value);
			$(el).data('originalText',$(options.target).text());
			var caption = function(){
				var target = $(el).data('captionTarget');
				$(target).text($(el).data('captionText'));
			}
			var revert = function(){
				var target = $(el).data('captionTarget');
				$(target).text($(el).data('originalText'));
			}
			if(options.trigger=='hover'){
				$(el)
					.on('mouseover',caption)
					.on('mouseleave',revert);
			}else if(options.trigger=='slide'){
				$(el)
					.on('slidestart',function(){
						caption();
						$(el).on('slide',caption);
					})
					.on('slidestop',function(){
						$(el).off('slide',caption);
						revert();
					});
			}
			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				$(el).off();
			});
		},
		update:function(el, valueAccessor){
			var value = ko.utils.unwrapObservable(valueAccessor());
			$(el).data('captionText',value);
		}
	}
	return ko;
});

