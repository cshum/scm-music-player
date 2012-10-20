define([
	"knockout","underscore","module","song",
	"lib/knockout/pauseable"
	],function(ko,_,module,Song){

var	playback = null, 
	current = (function(){
		var empty = new Song({title:""}),
			song = ko.observable(empty);
		return ko.computed({
			read: song,
			write: function(value){
				//empty as placeholder
				song().on(false);
				value = (value instanceof Song) ? value:empty;
				value.on(true);
				song(value);
				//when song change trigger start 
				start();
			}
		});
	})(),

	playlist = ko.observableArray(),
	autoPlay = ko.observable(false),
	queue = function(song){
		var matches = _(playlist()).filter(function(el){
			return el.url() == song.url();
		});
		if(matches.length>0) 
			return matches[0];
		else{
			playlist.push(song);
			return song;
		}
	},
	loadPlaylist = (function(){
		var list = _.map(module.config().playlist,function(val,idx){
			return {name:idx,regexp:new RegExp(val)};
		});
		function getModuleName(url){
			for(var i=0;i<list.length;i++)
				if(url.match(list[i].regexp))
					return list[i].name;
		}
		function done(result){
			message(null);
			playlist(result);
			var list = isShuffle() ? shuffledList():filteredList();
			current(list[0]);
			isPlay(autoPlay());
		}
		return function(data){
			message('Loading Playlist...');
			if(_.isString(data))
				require(['playlist/'+getModuleName(data)+'!'+data],done);
			else if(_.isArray(data))
				done(_(data).map(function(item){
					return new Song({
						title:unescape(item.title), 
						url:unescape(item.url)
					});
				}));
		}
	})(),
	filteredList = (function(){
		var list, isDirty = true;
		playlist.subscribe(function(){
			isDirty = true;
		});
		return function(){
			if(!isDirty) return list;
			list = _(playlist()).filter(function(song){
				return song.isValid();
			});
			isDirty = false;
			return list;
		}
	})(),

	shuffledList = (function(){
		var list, isDirty = true;
		//from http://jsfiddle.net/Tjirp/D288p/
		function shuffle(arr) {
			var l = arr.length,
				r, i, y, o;
			for (i = 0, y = l - 1; i < l; i++, y--) {
				r = Math.floor(Math.random() * (l - i));
				o = arr[r];
				arr[r] = arr[y];
				arr[y] = o;
			}
			return arr;
		}
		playlist.subscribe(function(){
			isDirty = true;
		});
		return function(){
			if(!isDirty) return list;
			list = _.shuffle(filteredList());
			isDirty = false;
			return list;
		}
	})(),

	message = ko.observable(null),

	isPlay = (function(){
		var isPlay = ko.observable(false);
		isPlay.subscribe(function(value){
			//if current empty find stuff to play
			if(value && !current().isValid()) 
				next();
		});
		return isPlay;
	})(),
	isShuffle = ko.observable(false),
	volume = ko.observable(50),
	repeatMode = ko.observable(1), //0 none, 1 all, 2 one

	pause = _(isPlay).bind(null,false),
	play = function(song){
		if(song instanceof Song)
			current(queue(song));
		isPlay(true);
	},
	remove = _(playlist.remove).bind(playlist),

	changeRepeatMode = function(){
		repeatMode((repeatMode()+1) % 3);
	},
	toggleShuffle = function(){
		isShuffle(!isShuffle());
	},

	duration = ko.observable(0),
	position = ko.observable(0),
	seekPosition = ko.observable(0),
	loadedFraction = ko.observable(0),
	playedFraction = ko.computed({
		read:function(){
			return value = duration()>0 ? 
				position()/duration():0;
		},
		write:function(value){
			seekPosition(Math.min(value,loadedFraction())*duration());
		}
	}).extend({pauseable:true}),

	start = (function(){
		var list = _.map(module.config().playback,function(val,idx){
			return {name:idx,regexp:new RegExp(val)};
		});
		function getModuleName(url){
			//match playback module
			for(var i=0;i<list.length;i++)
				if(url.match(list[i].regexp))
					return list[i].name;
			return 'diu';
		}

		return function(){
			//turn off current playback
			if(playback) playback.off();

			//reset stuffs
			duration(0);
			position(0);
			seekPosition(0);
			loadedFraction(0);

			//setup new playback
			if(current().isValid()) 
				require(['playback/'+getModuleName(current().url())+'!'],
				function(newPlayback){
					message(null);
					playback = newPlayback;
					playback.on(current().url(),finish);
				});
			else
				pause();
		}
	})(),

	change = function(d){
		var list = isShuffle() ? shuffledList():filteredList();
		var len = list.length;
		var i = d + _.indexOf(list,current());
		//empty playlist or non repeat end
		if(len==0 || (repeatMode()==0 && i==len)) current(null);
		//non repeat at beginning
		else if(repeatMode()==0 && i<0) current(list[0]);
		//wrap around
		else current(list[(i + len) % len]); 
	},

	next = _(change).bind(null,1),
	previous = _(change).bind(null,-1),

	finish = function(){
		//repeat one start again, otherwise next song
		if(repeatMode()==2) start();
		else next();
	};
		
	return {
		isShuffle:isShuffle, 
		isPlay:isPlay,
		autoPlay:autoPlay,
		repeatMode:repeatMode,
		volume:volume, 

		current:current, 
		message:message, 

		duration:duration, 
		position:position, 
		seekPosition:seekPosition,
		loadedFraction:loadedFraction,
		playedFraction:playedFraction,

		playlist: playlist, 
		queue: queue,
		remove: remove,
		loadPlaylist: loadPlaylist,

		play:play, 
		pause:pause,
		next:next, 
		previous:previous,
		changeRepeatMode:changeRepeatMode,
		toggleShuffle:toggleShuffle
	};
});
