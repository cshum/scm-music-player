(function(){
	var hasFrame = window.parent!=window,
		scripts = document.getElementsByTagName('script'),
		current = scripts[scripts.length-1],
		config = current.getAttribute('data-config'),
		head = document.getElementsByTagName("head")[0],
		dest = location.href.replace(/scmplayer\=true/g, 'scmplayer=false'),
		destHost = dest.substr(0,dest.indexOf('/',10)),
		scm = current.getAttribute('src').replace('scmplayer.co','scmplayer.net').replace('https:',location.protocol).replace('http:',location.protocol).replace(/script\.js.*/g,'scm.html')+'#'+dest,
		scmHost = scm.substr(0,scm.indexOf('/',10)),
		isOutside = !hasFrame || location.href.indexOf("scmplayer=true")>0,
		postMessage = function(msg){
			return window.top.document.getElementById('scmframe')
				.contentWindow.postMessage(msg,scmHost);
		},
		postFactory = function(obj,keys){
			var keys = keys.split(','),
				post = function(key){
					return function(arg){
						var argStr = '';
						if(typeof(arg)!='undefined')
							argStr = (key.match(/(play|queue)/) ? 'new Song(':'(') +
								JSON.stringify(arg)+')';
						postMessage('SCM.'+key+'('+argStr+')');
					}
				};
			for(var i=0;i<keys.length;i++){
				var key = keys[i];
				obj[key] = post(key);
			}
		},
		postConfig = function(config){
			if(!isOutside)
			postMessage('SCM.config('+config+')');
		},

		addEvent = function(elm, evType, fn) {
			if(elm.addEventListener) 
				elm.addEventListener(evType, fn);
			else if (elm.attachEvent) 
				elm.attachEvent('on' + evType, fn);
			else
				elm['on' + evType] = fn;
		},
		isIE = (function(){
			var undef,v = 3,div = document.createElement('div'),
			all = div.getElementsByTagName('i');
			while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',all[0] );
			return v > 4 ? v : undef;
		})(),
		isMobile = navigator.userAgent.match(/iPad|iPhone|Android|Blackberry/i),
		isIPad= navigator.userAgent.match(/iPad/i),

		init = function(){
			if(!document.body){ 
				setTimeout(init,10); 
				return;
			}
			if(isOutside) outside(); else inside();
		},

		outside = function(){
			var css = 'html,body{overflow:hidden;} body{margin:0;padding:0;border:0;} img,a,embed,object,div,address,table,iframe,p,span,form,header,section,footer{ display:none;border:0;margin:0;padding:0; }  #tumblr_controls{display:none;} #scmframe{display:block; background-color:transparent; position:fixed; top:0px; left:0px; width:100%; height:100%; z-index:1667;} ';
			var style = document.createElement('style');
			style.type = 'text/css';
			style.id = 'scmcss';

			if(style.styleSheet) style.styleSheet.cssText = css;
			else style.appendChild(document.createTextNode(css));

			head.appendChild(style);
			/*
			while(head.firstChild.id!="scmcss")
				head.removeChild(head.firstChild);
			*/
			var scmframe = document.createElement('iframe');
			scmframe.frameBorder = 0;
			scmframe.id = "scmframe";
			scmframe.allowTransparency = true;
			scmframe.src = scm;
			
			document.body.insertBefore(scmframe,document.body.firstChild);

			var resize = function(){
				scmframe.style.height = (function(){
					if( typeof( window.innerHeight ) == 'number' )
						return window.innerHeight; 
					else if( document.documentElement && document.documentElement.clientHeight ) 
						return document.documentElement.clientHeight; 
					else if( document.body && document.body.clientHeight ) 
						return document.body.clientHeight; 
				})();
			};

			addEvent(window,'load',function() {
				setTimeout(function(){
					while(document.body.firstChild!=scmframe)
						document.body.removeChild(document.body.firstChild);
					while(document.body.lastChild!=scmframe)
						document.body.removeChild(document.body.lastChild);
					resize();
				},0);
			});

			//fix frame height in IE
			addEvent(window,'resize',resize);
			//pushState and hash change detection
			var getPath = function(){
					return location.href.replace(/#.*/,'');
				},
				path = getPath(),
				hash = location.hash;
			setInterval(function(){
				if(getPath()!=path){
					path = getPath();
					window.scminside.location.replace(path);
				}
				if(location.hash != hash){
					hash = location.hash;
					window.scminside.location.hash = hash;
				}
			},100);
		},
		inside = function(){
			//change title
			window.top.document.title = document.title;
			//fix links
			var filter = function(host){
					host = host.replace(/blogspot.[a-z.]*/i,'blogspot.com');
					host = host.replace(/^(http(s)?:\/\/)?(www.)?/i,'');
					return host;
				};
			addEvent(document.body,'click',function(e){
				var tar = e.target;
				while(!tar.tagName.match(/^(a|area)$/i) && tar!=document.body) 
					tar = tar.parentNode;
				if(tar.tagName.match(/^(a|area)$/i) && 
					!tar.href.match(/.(jpg|png)$/i) && //ignore picture link
					!tar.href.match(/^javascript:/) //ignore javascript link
				){ 
					if(tar.href.indexOf('#')==0){
						//hash
						if(tar.href != "#"){
							window.top.scminside = window;
							window.top.location.hash = location.hash;
							e.preventDefault();
						}
					}else if(tar.title.match(/^(SCM:|\[SCM\])/i)){
						//SCM Play link
						var title = tar.title.replace(/^(SCM:|\[SCM\])( )?/i,'');
						var url = tar.href;
						SCM.play({title:title,url:url});
						e.preventDefault();
					}else if(tar.href.match(/\.css$/)){
						//auto add skin
						window.open('http://scmplayer.net/#skin='+tar.href,'_blank');
						window.focus();
						e.preventDefault();
					}else if(filter(tar.href).indexOf(filter(location.host))==-1 ){
						if(tar.href.match(/^http(s)?/)){
							//external links
							window.open(tar.href,'_blank');
							window.focus();
							e.preventDefault();
						}
					}else if(history.pushState){
						//internal link & has pushState
						//change address bar href
						var url = filter(tar.href).replace(filter(destHost),'');
						window.top.scminside = window;
						window.top.history.pushState(null,null,url);
						e.preventDefault();
					}
				}
			});

		};

	//SCM interface
	var SCM = {};

	postFactory(SCM,
		'queue,play,pause,next,previous,volume,skin,placement,'+
		'loadPlaylist,repeatMode,isShuffle,showPlaylist,'+
		'togglePlaylist,toggleShuffle,changeRepeatMode');

	if(window.SCM && window.SCMMusicPlayer) return;

  if (!isMobile) {
    init();
  }

	//send config
	if(config) postConfig(config);
	SCM.init = postConfig;

	window.SCMMusicPlayer = window.SCMMusicPlayer || SCM;
	window.SCM = window.SCM || SCM;
})();
