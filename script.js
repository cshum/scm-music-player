(function(){
	var hasFrame = window.parent!=window,
		scripts = document.getElementsByTagName('script'),
		current = scripts[scripts.length-1],
		head = document.getElementsByTagName("head")[0],
		config = current.getAttribute('data-config'),
		url = location.href.replace(/scmplayer\=true/g, 'scmplayer=false'),
		host = url.substr(0,url.indexOf('/',10)),
		src = current.getAttribute('src').replace(/script\.js/g,'scm.html')+'#'+url,

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
			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0] );
			return v > 4 ? v : undef;
		})(),
		isMobile = navigator.userAgent.match(/iPad|iPhone|Android|Blackberry/i),


		init = function(){
			if(!document.body){ 
				setTimeout(init,10); 
				return;
			}
			if(!isMobile){
				if(!hasFrame || location.href.indexOf("scmplayer=true")>0){
					code();
					outside();
				}else
					inside();
			}
		},

		code = function(){
			head.innerHTML += '<style id="scmcss" type="text/css"> html,body{overflow:hidden;} body{margin:0;padding:0;border:0;} img,a,embed,object,div,address,table,iframe,p,span,form{ display:none;border:0;margin:0;padding:0; } #scmFrame{display:block; background-color:transparent; position:fixed; top:0px; left:0px; width:100%; height:100%; z-index:167;} </style>';
			
			var scmFrame = document.createElement('iframe');
			scmFrame.frameBorder = 0;
			scmFrame.id = "scmFrame";
			scmFrame.name = "scmFrame";
			scmFrame.allowTransparency = true;
			scmFrame.src = src;
			
			document.body.insertBefore(scmFrame,document.body.firstChild);
			
			addEvent(window,'load',function() {
				while(head.firstChild.id!="scmcss")
					head.removeChild(head.firstChild);
				while(document.body.lastChild.id!="scmFrame")
					document.body.removeChild(document.body.lastChild);
			});
		},
		outside = function(){
			//fix frame height
			addEvent(window,'resize',function(){
				var scmFrameStyle = document.getElementById('scmFrame').style;
				scmFrameStyle.height = (function(){
					if( typeof( window.innerHeight ) == 'number' )
						return window.innerHeight; 
					else if( document.documentElement && document.documentElement.clientHeight ) 
						return document.documentElement.clientHeight; 
					else if( document.body && document.body.clientHeight ) 
						return document.body.clientHeight; 
				})();
			});
		},
		inside = function(){
			window.top.location.hash = '#dsfsafdsa';
			window.SCM = (function(keys){
				var keys = keys.split(','),
					obj = {},
					post = function(key){
						return function(arg){
							var argStr = '';
							if(typeof(arg)!='undefined')
								argStr = (key.match(/(play|queue)/) ? 'new Song(':'(') +
									JSON.stringify(arg)+')';
							window.parent.postMessage('SCM.'+key+'('+argStr+')',host);
						}
					};
				for(var i=0;i<keys.length;i++){
					var key = keys[i];
					obj[key] = post(key);
				}
				return obj;
			})('config,queue,play,pause,next,previous,volume,'+
			'loadPlaylist,changeRepeatMode,toggleShuffle,togglePlaylist');

			window.parent.postMessage('SCM.config('+config+')',host);
		};

	if(window.SCM) return;
	init();
})();
