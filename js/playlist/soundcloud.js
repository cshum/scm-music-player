define(['jquery','song'],function($,Song){
	var consumer_key = "89e7642d86f9241b0d1917ebfae99e38";

	return {
		load:function(url, req, callback, config){
			var resolveURL = 'http://api.soundcloud.com/resolve?url=' + url + '&format=json&consumer_key=' 
				+ consumer_key + '&callback=?';
			$.getJSON(resolveURL, function(data){
				callback($.map(data.tracks,function(track){
					var url = track.stream_url;
					url = (url.indexOf("secret_token") == -1) ? url + '?' : url + '&';
					url += 'consumer_key=' + consumer_key;
					return new Song({
						title:track.title,
						url:url
					});
				}));
			});
		}
	}
});

