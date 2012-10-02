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
	};

	_.extend(SCM,{
		skin:skin, 
		placement:placement, 
		showPlaylist:showPlaylist,
		togglePlaylist:togglePlaylist,
		display:display,
		timer:timer
	});

	SCM.config = function(data){
		SCM.skin(data.skin || 'skins/tunes/skin.css');
		SCM.volume(parseInt(data.volume || 50));
		SCM.isPlay(data.autoplay=='true' || data.autoplay);
		SCM.isShuffle(data.shuffle=='true' || data.shuffle);
		SCM.repeatMode(data.repeat || 0);

		SCM.placement(data.placement || 'top');
		SCM.showPlaylist(data.showplaylist);

		SCM.loadPlaylist(data.playlist);
	};

});
