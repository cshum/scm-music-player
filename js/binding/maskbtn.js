define(['knockout','jquery','underscore'],function(ko,$){
	ko.bindingHandlers.maskBtn = {
		init:function(el,valueAccessor){
			var options = ko.utils.unwrapObservable(valueAccessor());
			_.defaults(options,{
				css:null,
				hasOffset:true,
				align:'left'
			});
			//button setup
			var bgChange = function(pos){
				if(options.hasOffset && pos=='top')
					$(this).removeClass(options.css);
				else{
					$(this).addClass(options.css);
					var left = parseInt($(this).css("left"));
					var right = parseInt($(this).css("right"));
					var bgx =  options.align=='left'? -left: right+$(this).width();
					$(this).css("backgroundPosition", (options.hasOffset?bgx:0) + "px "+pos);
				}
			}
			$(el)
				.on("mousedown",_.bind(bgChange,el,'bottom'))
				.on("mouseup",_.bind(bgChange,el,'top'))
				.on("mouseleave",_.bind(bgChange,el,'top'));

			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				$(el).off();
			});
		}
	}
	return ko;
});
