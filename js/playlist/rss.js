define([
'underscore','song',
'https://www.google.com/jsapi'
],function(_,Song){
	//uses google feed api

	var queue = {}, isLoaded = false;

	window.googleFeedLoad = function(){
		isLoaded = true;
		_.each(queue,function(callback,url){
			var feed = new google.feeds.Feed(url);
			feed.setNumEntries(100);
			feed.load(function(result){
				callback(_.map(result.feed.entries,function(entry){
					return new Song({
						title:entry.title,
						url:entry.link
					});
				}));
			});
		});
		queue = {};
	}
	google.load("feeds", "1",{callback:'googleFeedLoad'});

	return {
		load:function(url, req, callback, config){
			queue[url] = callback;
			if(isLoaded) googleFeedLoad();
		}
	};
});
