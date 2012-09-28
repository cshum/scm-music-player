define(['scm','module','jquery'],function(SCM,module,$){
	var config = module.config(),
	callback, sound, playObserve, volumeObserve, positionObserve;

	$.getScript(config.script,function(){
		soundManager.setup({
			url:config.url,
			useHTML5Audio:true,
			preferFlash:false,
			allowScriptAccess: 'always',
			onready:function(){
				callback({on:on, off:off});
			}
		});
	});

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
		load:function(name, req, onLoad, config){
			callback = onLoad;
		}
	};
});
