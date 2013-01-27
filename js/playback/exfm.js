define(["scm", "playback/soundmanager!", "jquery"], function(SCM, sm, $) {
	return {
		load: function(name, req, callback, config) {
			var current;
				callback({
				on: function(url, finishCallback) {
					var songIDIndex = url.indexOf("song");
					var songID = url.substr(songIDIndex);
					songID = $.trim(songID);
					var resolveURL = "http://ex.fm/api/v3/" + songID + "?callback=?";
					current = $.getJSON(resolveURL, function(track) {
						var url = track.song.url;
						if (url) {
							sm.on(url, finishCallback);
						}
					});
				},
				off: function() {
					current.abort();
					sm.off();
				}
			});
		}
	};
}); 
