define(['scm','jquery'],function(SCM,$){
	var sound, playObserve, volumeObserve, positionObserve;

	function on(url,finishCallback){
		sound = soundManager.createSound({
			id:'SCMSoundManager',
			url:url,
			autoPlay:SCM.isPlay(),
			volume:SCM.volume(),
			whileloading:loading,
			whileplaying:playing,
			onfinish:finishCallback,
			onload:function(success){
				if(!success && !sound.bytesTotal)
					SCM.message('Error: Request not Found');
			}
		});
		playObserve = SCM.isPlay.subscribe(play);
		volumeObserve = SCM.volume.subscribe(volume);
		positionObserve = SCM.seekPosition.subscribe(position);

	}
	function off(){
		playObserve.dispose();
		volumeObserve.dispose();
		positionObserve.dispose();

		sound.destruct();
	}
	function play(value){
		if(value) sound.play();
		else sound.pause();
	}
	function volume(value){
		sound.setVolume(value);
	}
	function position(value){
		sound.setPosition(value*1000);
	}
	function loading(){
		SCM.loadedFraction(
			sound.bytesTotal>0 ? 
			sound.bytesLoaded/sound.bytesTotal : 0
		);
	}
	function playing(){
		SCM.position(sound.position/1000);
		SCM.duration(sound.durationEstimate/1000);
	}

	return {
		load:function(name, req, callback, config){
			soundManager.setup({
				onready:function(){
					callback({on:on, off:off});
				}
			});
		}
	};
});
