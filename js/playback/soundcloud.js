define(['scm','playback/soundmanager!','jquery'],function(SCM,sm,$){
		
	return {
		load:function(name, req, callback, config){
			var consumer_key = "89e7642d86f9241b0d1917ebfae99e38", 
				current;
			callback({
				on:function(url,finishCallback){
					var resolveURL = 'http://api.soundcloud.com/resolve?url=' + url + '&format=json&consumer_key=' 
						+ consumer_key + '&callback=?';
					current = $.getJSON(resolveURL, function(track){
						var url = track.stream_url;
						url = (url.indexOf("secret_token") == -1) ? url + '?' : url + '&';
						url += 'consumer_key=' + consumer_key;
						sm.on(url,finishCallback);
					});
				},
				off:function(){
					current.abort();
					sm.off();
				}
			});
		}
	};
});

