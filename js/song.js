define(['knockout'],function(ko){
	return function(data){
		var self = this;
		data = data || {};
		this.title = ko.observable(data.title || '');
		this.url = ko.observable(data.url || '');
		this.on = ko.observable(false);
		this.isValid = ko.computed(function(){
			return (typeof self.url() === 'string') && self.url()!='';
		});

	}
});
