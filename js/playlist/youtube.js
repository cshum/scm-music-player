define(['jquery','song'],function($,Song){
	function parseId(url){
		var prefix = '(list=|p=|/playlists/)',
			id = '[a-zA-Z0-9_\-]*',
			match = prefix+id;
		return url.match(new RegExp(match))[0].replace(new RegExp(prefix),'');
	}
	return {
		load:function(url, req, callback, config){
			var playlistURL = 'http://gdata.youtube.com/feeds/api/playlists/'+
				parseId(url)+'?v=2&alt=json&max-results=50&callback=?';
			$.getJSON(playlistURL, function(data) {
				callback($.map(data.feed.entry,function(item){
					return new Song({
						title:item.title.$t,
						url:item.content.src
					})
				}));
			});
		}
	};
});
