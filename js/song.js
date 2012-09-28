define(['knockout'],function(ko){
	return function(data){
		this.title = ko.observable(data.title);
		this.url = (function(){
			var url = ko.observable();
			return ko.computed({
				read:function(){
					return url();
				},
				write:function(value){
					url((value=='' || !value) ? null :value);
				}
			});
		})();
		this.url(data.url);
		this.on = ko.observable(false);

	}
});
