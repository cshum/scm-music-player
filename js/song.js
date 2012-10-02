define(['knockout'],function(ko){
	return function(data){
		var self = this;
		this.title = ko.observable(unescape(data.title));
		this.url = ko.observable(unescape(data.url));
		this.on = ko.observable(false);
		this.isValid = ko.computed(function(){
			return self.url() && self.url()!='';
		});

	}
});
