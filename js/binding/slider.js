define(['knockout','jquery','jquery.ui'],function(ko,$){
	ko.bindingHandlers.slider = {
		//wrapper for jquery ui slider
		init: function(el, valueAccessor,allBindingsAccessor) {
			var options = allBindingsAccessor().sliderOptions || {};
			//initialize the control
			$(el).slider(options);

			//handle the value changing in the UI
			var observable = valueAccessor();
			var setObservable = function(){
				var sliderValue = $(el).slider("value");
				var step = options.step;
				if(Math.round(sliderValue/step) != Math.round(observable()/step))
					observable(sliderValue);
			}
			if(options.liveUpdate)
				ko.utils.registerEventHandler(el, "slide", _.throttle(setObservable,50));
			ko.utils.registerEventHandler(el, "slidechange", setObservable);

			if(options.pauseable){
				ko.utils.registerEventHandler(el, "slidestart", function(){
					observable.pause();
				});
				ko.utils.registerEventHandler(el, "slidestop", function(){
					setTimeout(function(){
						observable.resume();
					},0);
				});
			}

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				$(el).slider("destroy");
			});
		},
		//handle the model value changing
		update: function(el, valueAccessor) {
			var value = valueAccessor();
			$(el).slider("value",ko.utils.unwrapObservable(value));   
		}
	};
	return ko;
});
