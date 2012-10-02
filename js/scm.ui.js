define(["scm","knockout","underscore"],function(SCM,ko,_){

var skin = ko.observable('skins/tunes/skin.css'),
	placement = ko.observable('top'),
	showPlaylist = ko.observable(false),
	display = ko.computed(function(){
		return SCM.message() || SCM.current().title();
	}),
	timer = (function(){
		function timeNo(no){
			no = parseInt(no);
			if (no < 10) return "0" + no;
			else return no;
		}
		return ko.computed(function(){
			var p = SCM.position();
			var d = SCM.duration();
			return timeNo(p / 60) + ":" + timeNo(p % 60) + 
				"|" + timeNo(d / 60) + ":" + timeNo(d % 60);
		});
	})(),
	togglePlaylist = function(){
		showPlaylist(!showPlaylist());
	},
	first = true;

	_.extend(SCM,{
		skin:skin, 
		placement:placement, 
		showPlaylist:showPlaylist,
		togglePlaylist:togglePlaylist,
		display:display,
		timer:timer
	});

	SCM.config = function(data){
		if(!first) return;
		first = false;
		_.extend(data,data.playback);
		if('skin' in data) SCM.skin(data.skin);
		if('volume' in data) SCM.volume(parseInt(data.volume));
		if('autoplay' in data) SCM.autoPlay(data.autoplay!='false' && data.autoplay);
		if('autostart' in data) SCM.autoPlay(data.autostart!='false' && data.autostart);
		if('shuffle' in data) SCM.isShuffle(data.shuffle!='false' && data.shuffle);
		if('repeat' in data) SCM.repeatMode(data.repeat);

		if('placement' in data) SCM.placement(data.placement);
		if('showplaylist' in data) SCM.showPlaylist(data.showplaylist!='false' && data.showplaylist);

		if('playlist' in data) SCM.loadPlaylist(data.playlist);
	};

});
