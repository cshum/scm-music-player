/* 
 * SCM Music Player by Chun Ming (Adrian) Shum
 * http://scmplayer.asweb.info
 * 
 */
window.SCM = window.SCM || {};

SCM.states = {
	start:"start",
	play:"play",
	pause:"pause",
	finish:"finish",
	error:"error"
}

/*
 * Player is the main class to be constructed. 
 * This also provide communications for the UI Classes
 */

SCM.Player = new Class({
	Implements:[Options,Events],

	options:{
		volume:50,
		autostart:false,
		shuffle:false
	},

	initialize: function(smId,ytId,playlist,options){
		var self = this;
		this.setOptions(options);
		this.playlist = playlist;
		
		//initialize playback states
		this.playback = null;
		this.soundManagerPlayback = new SCM.SoundManagerPlayback(smId,{
			onStateChange:function(state){
				if(self.playback == self.soundManagerPlayback)
					self.stateDispatcher(state);
			}
		});
		
		this.youtubePlayback = new SCM.YoutubePlayback(ytId,{
			onStateChange:function(state){
				if(self.playback == self.youtubePlayback)
					self.stateDispatcher(state);
			}
		});
		
		//initialize Counter 
		if(this.options.shuffle==true || this.options.shuffle=="true")
			this.counter = new SCM.ShuffleCounter(this.playlist.length);
		else
			this.counter = new SCM.Counter(this.playlist.length);
		
		this.index = this.counter.getNext();
		
		this.setVolume(this.options.volume);
		
		//delay a bit to have the listeners ready
		if(this.options.autostart==true || this.options.autostart=="true")
			(function(){ self.play(); }).delay(100);	// todo: make manual/ variable to compensate for lag
	},

	stateDispatcher:function(state){
		this.fireEvent("statechange",state);
		if(state==SCM.states.finish)
			this.next();
	},

	start: function(index){
		this.counter.setIndex(index);

		//pause present song
		if(this.playback)
			this.playback.pause();
			
		this.index = index;
		
		//decide whether to change playback (yt or sm)
		var url = this.playlist[this.index].url;
		if(url.indexOf("youtube.com/")>-1 || url.indexOf("youtu.be/")>-1)
			this.playback = this.youtubePlayback;
		else
			this.playback = this.soundManagerPlayback;
			
		//start new song
		this.stateDispatcher(SCM.states.start);
		this.playback.start(url);
	},

	next: function(){
		this.start(this.counter.getNext());
	},

	previous: function(){
		this.start(this.counter.getPrevious());
	},

	play:function(){
		if(!this.playback)
			this.start(this.index);
			
		this.playback.play();
	},

	seek:function(time){
		this.playback.seek(time);
	},

	pause:function(){
		this.playback.pause();
	},

	setVolume:function(volume){
		this.soundManagerPlayback.setVolume(volume);
		this.youtubePlayback.setVolume(volume);
	},

	getBytesLoaded: function(){
		return this.playback.getBytesLoaded() || 0;
	},

	getBytesTotal: function(){
		return this.playback.getBytesTotal() || 0;
	},

	getPosition: function(){
		return this.playback.getPosition() || 0;
	},

	getDuration: function(){
		return this.playback.getDuration() || 0;
	},

	getPlaylist:function(){
		return this.playlist;
	},

	getIndex:function(){
		return this.index;
	}
});


/*
 * The Playback classes provide bridges between 
 * Sound frameworks and the Player class.
 * 
 * HTML5 Playback, Silverlight Playback maybe added in the future
 */

SCM.PlaybackTemplate = new Class({
	Implements: Options,
	options: {
		onStateChange:function(state){}
	},
	initialize: function(id,options){
		this.id = id;
		this.setOptions(options);
	},
	start: function(url){},
	play: function(){},
	pause: function(){},
	seek: function(time){},
	setVolume: function(volume){},
	getBytesLoaded: function(){},
	getBytesTotal: function(){},
	getPosition: function(){},
	getDuration: function(){}
});

SCM.SoundManagerPlayback = new Class({
	Extends: SCM.PlaybackTemplate,
	initialize: function(id,options){
		this.parent(id,options);
		this.sound = null;
		this.volume = 50;
	},
	start: function(url){
		var self = this;
		if (this.sound)
			this.sound.destruct();
			
		this.sound = soundManager.createSound({
			id: this.id,
			url: url,
			onplay:function(){ self.options.onStateChange(SCM.states.play); },
			onresume:function(){ self.options.onStateChange(SCM.states.play); },
			onpause:function(){ self.options.onStateChange(SCM.states.pause); },
			onfinish:function(){ self.options.onStateChange(SCM.states.finish); },
			onload:function(success){
				if(!success && !self.getBytesTotal())
					self.options.onStateChange(SCM.states.error);
			}
		});
		this.setVolume();
		this.play();
	},
	play: function(url){
		if (this.sound)
			this.sound.play();
	},
	pause: function(){
		if (this.sound)
			this.sound.pause();
	},
	seek: function(time){
		if (this.sound)
			this.sound.setPosition(time*1000);
	},
	setVolume: function(volume){
		this.volume = volume || this.volume;
		if (this.sound)
			this.sound.setVolume(this.volume);
	},
	getBytesLoaded: function(){
		return this.sound ? this.sound.bytesLoaded: null;
	},
	getBytesTotal: function(){
		return this.sound ? this.sound.bytesTotal: null;
	},
	getPosition: function(){
		return this.sound ? this.sound.position/1000: null;
	},
	getDuration: function(){
		return this.sound ? this.sound.durationEstimate/1000: null;
	}
});

SCM.YoutubePlayback = new Class({
	Extends: SCM.PlaybackTemplate,
	
	initialize: function(id, options)
	{
		this.parent(id,options);
		this.state = null;
		
		SCM.YoutubePlayback[this.id] = this;
		$(this.id).addEventListener("onStateChange","SCM.YoutubePlayback."+this.id+".stateDispatcher");
		$(this.id).addEventListener("onError","SCM.YoutubePlayback."+this.id+".errorDispatcher")
	},
	
	start: function(url){
		$(this.id).loadVideoById(SCM.parseYoutubeVideoId(url), 0, "small");
		this.stateDispatcher(1);
	},
	play: function(){
		$(this.id).playVideo();
	},
	pause: function(){
		$(this.id).pauseVideo();
	},
	seek: function(time){
		$(this.id).seekTo(time,false);
	},
	setVolume: function(volume){
		$(this.id).setVolume(volume);
	},
	getBytesLoaded: function(){
		return $(this.id).getVideoBytesLoaded();
	},
	getBytesTotal: function(){
		return $(this.id).getVideoBytesTotal();
	},
	getPosition: function(){
		return $(this.id).getCurrentTime();
	},
	getDuration: function(){
		return $(this.id).getDuration();
	},
	stateDispatcher:function(ytState){
		//convert yt states into SCM states
		var state = null;
		switch(ytState){
			case -1: state = SCM.states.play; break;
			case 1: state = SCM.states.play; break;
			case 3: state = SCM.states.play; break;
			case 2: state = SCM.states.pause; break;
			case 0: state = SCM.states.finish; break;
		}
		if(state && state!=this.state){
			this.state = state;
			this.options.onStateChange(this.state);
		}
	},
	errorDispatcher:function(){
		this.options.onStateChange(SCM.states.error);
	}
});


/*
 * Counter classes control how the next/previous playback to be counted
 */

SCM.Counter = new Class({
	initialize:function(length){
		//length of playlist
		this.length = length;
		this.index = -1;
	},
	getNext:function(){
		return (this.index + 1) % this.length;
	},
	getPrevious:function(){
		return (this.index - 1 + this.length) % this.length;
	},
	setIndex:function(index){
		this.index = index;
	}
});
/*
 * Anyone come up with a better idea of shuffling songs? :p
 */
SCM.ShuffleCounter = new Class({
	Extends:SCM.Counter,
	
	initialize:function(length){
		this.parent(length);
		this.played = [];
		this.remaining = [];
	},
	
	getNext:function(){
		this.remaining.erase(this.index);
		if(this.remaining.length==0)
			for(var i=0; i<this.length;i++)
				if(this.index!=i)
					this.remaining.push(i);
		var ran = Math.floor(this.remaining.length*Math.random());
		var no = this.remaining.splice(ran,1)[0];
		this.played.push(no);
		return no;
	},
	
	getPrevious:function(){
		if(this.played.length>1)
			var no = this.played.pop();
		return this.played.getLast();
	}
});

/*
 * Playlist Fetcher class
 * Quite messed up here... 
 * maybe someone can improve it :p
 */
SCM.PlaylistFetcher = new Class({
	Implements: Options,
	
	options:{
		onComplete:function(playlist){},
		onError:function(){}
	},
	
	initialize:function(data,options){
		this.setOptions(options);
		var self = this;
		var playlist = [];
		
		//data can be a manual playlist object, or a playlist url String
		if($type(data)=="string"){
			//Proadcast
			if(data.indexOf("youtube.com") > -1 && (data.indexOf("list=") > -1 || data.indexOf("p=") > -1 || data.indexOf("v=") > -1))
			{
				var id_playlist = '';
				var id_video = '';
				
				if (data.indexOf("p=") > -1)
				{
					var idPos = data.indexOf("p=") + 2;
					var ampPos = data.indexOf("&", idPos);
					if (ampPos == -1) ampPos = data.length;
					id_playlist = data.substr(idPos, ampPos - idPos);
				}
				else if (data.indexOf("list=") > -1)
				{
					var idPos = data.indexOf("list=") + 7;	// list= always appends PL before the ID for no good reason
					var ampPos = data.indexOf("&", idPos);
					if (ampPos == -1) ampPos = data.length;
					id_playlist = data.substr(idPos, ampPos - idPos);
				}

				if (data.indexOf("p=") > -1 || data.indexOf("list=") > -1)
				{
					//Youtube Playlist
					new Request.JSONP({
						url: "http://gdata.youtube.com/feeds/api/playlists/"+SCM.parseYoutubePlaylistId(data)+"?alt=json&max-results=50",
						method: "get",
						onComplete: function(data){
							data.feed.entry.each(function(el)
							{
								var restrictions = "";
								if (el.app$control && el.app$control.yt$state && el.app$control.yt$state.name) restrictions = el.app$control.yt$state.name;

								playlist.push({
									title : el.title.$t,
									url : el.link[0].href,
									link : el.link[0].href,
									access : restrictions
								});
							});
							self.options.onComplete(playlist);
						}
					}).send();
				}
				else
				{	// adding a single video
					var idPos = data.indexOf("v=") + 2;		// has to have a "v=" since we searched for it earlier
					var ampPos = data.indexOf("&", idPos);
					if (ampPos == -1) ampPos = data.length;
					id_video = data.substr(idPos, ampPos - idPos);

					//Youtube Video (single)
					new Request.JSONP({	
						url: "https://gdata.youtube.com/feeds/api/videos/"+id_video+"?alt=json",
						method: "get",
						onComplete: function(data)
						{
							if ($type(data)=="string" && data.indexOf("Invalid id") > -1)
							{	// not a video we can retreive
								playlist.push({
									title : '-unknown-',
									url : '',
									link : '',
									access : 'restricted'
								});							
							}
							else
							{
								playlist.push({
										title : data.entry.title.$t,
										url : data.entry.link[0].href,
										link : data.entry.link[0].href
								});
							}
							
							self.options.onComplete(playlist);
						}
					}).send();
				}
			}
			else
			{
				//Other playlist format (itunes rss or xspf)
				new Request.JSON({
				    url: "fetch.php?url=" + encodeURIComponent(data),
				    method: "get",
				    onComplete: function(data){
				    	try{
					        if(data.playlist){
					        	//xspf
					        	(data.playlist.tracklist || data.playlist.trackList)
					        	.track.each(function(el){
					        		playlist.push({
					        			title:el["title"],
					        			link:el["info"],
					        			url:el["location"]
					        		});
					        	});
					        }else if(data.rss){
					        	//itunes rss
					        	
					        	data.rss.channel.item.each(function(el){
					        		playlist.push({
					        			title:el["title"],
					        			url:el["enclosure"]["@attributes"]["url"],
					        			link:el["link"]
					        		});
					        	});
					        	
					        }else{
					        	self.options.onError();
					        }
					        self.options.onComplete(playlist);
					    }catch(err){
					    	self.options.onError();
					    }
				    }
				}).send();
			}
		}else{
			//Manual Playlist
			data.each(function(el){
				playlist.push({
					title:unescape(el.title),
					url:unescape(el.url)
				});
			});
			self.options.onComplete(playlist);
		}
	}
});

/*
 * UI Classes (View)
 */
SCM.UITemplate = new Class({
	setPlayer:function(player){
		var self = this;
		player.addEvent("statechange",function(state){
			self.onStateChange(state);
		});
		this.onPlayerReady(player);
	},
	onPlayerReady:function(player){},
	onStateChange:function(state){}
});

SCM.BarUI = new Class({
	Extends:SCM.UITemplate,
	Implements:Options,
	options:{
		onPlaylistToggle:function(){}
	},
	initialize:function(options){
		this.setOptions(options);
		var self = this;
		this.defaultTooltipMsg = $("tooltip").getElement("a").get("text");
		this.updateTimer(false);
		window.addEvent("resize",function(){
			self.updateSeekerSize();
		});
	},
	onPlayerReady:function(player){
		this.player = player;
		this.setCurrentTitle();
		
		this.initButtons();
		this.initVolume();
		this.initSeeker();
		this.setVolume(this.player.options.volume);
		this.setPlay(false);
	},
	onStateChange:function(state){
		this.setPlay(state==SCM.states.play || state==SCM.states.start);
		
		if(state==SCM.states.start){
			this.setCurrentTitle();
			this.playInterval(true);
			this.isPlaying = true;
		}
		if(state==SCM.states.error || state==SCM.states.finish){
			this.playInterval(false);
			this.isPlaying = false;
		}
	},
	playInterval:function(start){
		var self = this;
		if(start){
			if(!this.interval){
				this.interval = (function(){
					self.updateBufferedBar();
					self.updateTimer(true);
				}).periodical(100);
			}
		}else{
			$clear(this.interval);
			this.interval = null;
		}
	},
	initButtons:function(){
		var self = this;
		$$('.button').each(function($btn){
			var bgX;
			//define background position of pressed buttons
			if($btn.get('id')=="play")
				bgX = 0;
			else{
				var btnX = $btn.getPosition().x;
				var rightX = $("seeker").getPosition().x + $("seeker").getSize().x;
				if(btnX >= rightX)
					bgX = window.getSize().x - btnX; //right side buttons
				else
					bgX = -btnX; //left side buttons
				$btn.addClass("mainImage");
			}
			$btn.setStyle("backgroundPosition", bgX+"px top");
			$btn.addEvents({
				mouseup:function(){
					this.setStyle("backgroundPosition", bgX + "px top");
				},
				mouseleave:function(){
					this.setStyle("backgroundPosition", bgX + "px top");
				},
				mousedown:function(){
					this.setStyle("backgroundPosition", bgX + "px bottom");
				}
			});
		});
		
		$("play").addEvent("click",function(){
			self.player.play();
		});
		$("pause").addEvent("click",function(){
			self.player.pause();
		});
		$("previous").addEvent("click",function(){
			self.player.previous();
		});
		$("next").addEvent("click",function(){
			self.player.next();
		});
		$("list").addEvents({
			mouseover:function(){
				self.setTooltip("Toggle Playlist");
			},
			mouseleave:function(){
				self.defaultTooltip();
			},
			click:function(){
				self.options.onPlaylistToggle();
			}
		});
	},
	initVolume:function(){
		var self = this;
		this.volume = new Slider("volume","volumeSlider",{
			steps:100,
			range: [0,100],
			onChange: function(value){
				self.setTooltip("Volume: " + value + "%");
				self.player.setVolume(value);
			},
			onComplete: function(){
				self.defaultTooltip();
			}
		});		
	},
	initSeeker:function(){
		this.seekerDragging = false;
		var self = this;
		var dragging = function(e){
			var mouseX = e.client.x - $("seeker").getPosition().x;
			$("seekerSlider").setStyle("left",Math.max(0,Math.min($("seekerBuffered").getSize().x-15,mouseX)));
		}
		var release = function(e){
			if(self.seekerDragging){
				self.seekerDragging = false;
				var pec = $("seekerSlider").getPosition($("seeker")).x/$("seeker").getSize().x*100;
				self.player.seek(self.player.getDuration()*pec/100);
				$("seekerSlider").setStyle("left",pec+"%");
			}
		}
		$$("#seekerMask").addEvents({
			mousedown:function(e){
				if(self.isPlaying){
					self.seekerDragging = true;
					dragging(e);
				}
			},
			mousemove:function(e){
				if(self.seekerDragging)
					dragging(e);
			},
			mouseup:release,
			mouseleave:release
		});
	},
	setVolume:function(volume){
		this.volume.set(volume);
	},
	updateBufferedBar:function(){
		var loaded = this.player.getBytesLoaded();
		var total = this.player.getBytesTotal();
		$("seekerBuffered").setStyle("width", (total>0 ? loaded/total*100 : 0) + "%");
	},
	updateTimer:function(real){
		var timeNo = function(no){
			no = parseInt(no);
			if (no < 10) 
				return "0" + no;
			else 
				return no;
		}
		var p = real? this.player.getPosition() : 0;
		var d = real? this.player.getDuration() : 0;
		$("timer").set("text", timeNo(p / 60) + ":" + timeNo(p % 60) + "|" + timeNo(d / 60) + ":" + timeNo(d % 60));
		if(!this.seekerDragging){
			$("seekerSlider").setStyle("left",(d>0? p/d*100 :0)+"%");
		}
	},
	updateSeekerSize:function(){
		$("seeker").setStyle("display","block");
		var seekerRight = $("seeker").getPosition().x+$("seeker").getSize().x;
		var titleRight = $("title").getPosition().x+$("title").getSize().x;
		$("seeker").setStyle("width",Math.max(1,seekerRight-titleRight-10));
	},
	setPlay:function(isPlay){
		$("play").setStyle("display", isPlay ? "none" : "block");
		$("pause").setStyle("display", isPlay ? "block" : "none");
	},
	setCurrentTitle:function(){
		this.setTitle(this.player.getPlaylist()[this.player.getIndex()].title);
	},
	setTitle:function(title){
		$("title").set("text",title);
		this.updateSeekerSize();
	},
	defaultTooltip:function(){
		this.setTooltip(this.defaultTooltipMsg);
	},
	setTooltip:function(msg){
		$("tooltip").getElement("a").set("text",msg);
	}
});

SCM.ListUI = new Class({
	Extends:SCM.UITemplate,
	initialize:function(){
		var self = this;
		this.index = 0;
		
		var resizer = function(){
			var exceeded = $("playlist").getSize().y - $("playlistItems").getSize().y;
			$("playlistItems").setStyle("height",Math.max(window.getSize().y-exceeded, 200));
		}
		resizer();
		
		if (Browser.Engine.name == 'trident')
			window.setInterval(resizer, 100);
		else 
			window.addEvent("resize", resizer);
	},
	
	onPlayerReady:function(player){
		var self = this;
		this.player = player;
		$("playlistItems").empty();
		
		player.getPlaylist().each(function(item,index){
			var $item = $$(".itemTextOnly")[0].clone();
			$item.getElements(".title").set("text",item.title);
			$item.getElements(".description").set("text",item.description);
			$item.getElements(".number").set("text",index+1);
			$item.addEvent("click",function(){
				player.start(index);
				self.updateFocus(index);
			});
			
			$item.inject("playlistItems");
		});
		
		$("playlistItems").getElements("li:odd").addClass("odd");
		$("playlistItems").getElements("li:even").addClass("even");
		this.updateFocus(this.player.getIndex());
	},
	
	onStateChange:function(state){
		if(state==SCM.states.start)
			this.updateFocus(this.player.getIndex());
	},

	updateFocus:function(index){
		if(this.index!=null){
			$("playlistItems")
			.getElements("li:nth-child(" + (this.index + 1) + ")")
			.removeClass("focus");
		}
		this.index = index;
		$("playlistItems")
		.getElements("li:nth-child(" + (this.index + 1) + ")")
		.addClass("focus");
	}
});

/*
 * Utility functions
 */
SCM.parseYoutubeVideoId = function(url){
	var veq = url.indexOf("v=");
	var vsh = url.indexOf("/v/");
	var id = "";
	if(veq>-1)
		id = url.substr(veq+2,11);
	else if(vsh>-1)
		id = url.substr(vsh+3,11);
	else
		id = url;
	return id;
}
SCM.parseYoutubePlaylistId = function(url){
	if (url.indexOf("p=") > -1)
		return url.substr(url.indexOf("p=")+2,16);
	else if (url.indexOf("list=") > -1)
		return url.substr(url.indexOf("list=")+7,16);
	else
		return '';
}

