<?php require "config.php"; ?>
//IE detection
var SCMMusicPlayer_isIE = true; 
document.write('<![if !IE]><script type="text/javascript">SCMMusicPlayer_isIE=false;</script><![endif]>');

window.SCMMusicPlayer = window.SCMMusicPlayer || {
init:function(dataStr){
	this.dataStr = dataStr;
	this.data = eval('('+dataStr+')');
	if(this.data.showplaylist == "large"){
		this.data.showplaylist = screen.width>1280 ? 'true':'false';
	}
	
	this.url = '<?php echo $dir; ?>container.php?url='+ escape( location.href.replace(/scmplayer\=true/g, 'scmplayer=false')) +'&place='+this.data.placement+'&showplaylist='+this.data.showplaylist;
	this.hasFrame = window.parent!=window;
	
	this.frameBgColor = '#FFF';
	if(this.data.backgroundColor) 
		this.frameBgColor = this.data.backgroundColor;
	if(navigator.userAgent.match(/iPad|iPhone|Android|Blackberry/i) == null){
		if(!this.hasFrame || location.href.indexOf("scmplayer=true")>0){
			if(!SCMMusicPlayer_isIE)
				this.codeNonIE();
			else
				this.codeIE();
			this.initEventsWithPlayer();
		}else{
			this.initEventsWithoutPlayer();
		}
	}
},
codeNonIE:function(){
	var scmCSSCode = '<style type="text/css"> html,body{overflow:hidden;} body{margin:0;padding:0;border:0;} img,embed,object,div,address,table,iframe,p,span,form{ display:none;border:0;margin:0;padding:0; } #scmFrame{display:block; background-color:'+this.frameBgColor+'; position:fixed; top:0px; left:0px; width:100%; height:100%; z-index:167;} </style>';
	document.write(scmCSSCode);
	var scmCSS = document.createElement('div');
	scmCSS.id="scmCSS";
	scmCSS.innerHTML = scmCSSCode;
	
	var scmFrame = document.createElement('iframe');
	scmFrame.frameBorder = 0;
	scmFrame.id = "scmFrame";
	scmFrame.name = "scmFrame";
	
	var scmSendData = document.createElement('form');
	scmSendData.action = this.url;
	scmSendData.method = "post";
	scmSendData.id = "scmSendData";
	if(!this.hasFrame)
		scmSendData.target = "scmFrame";
	else
		scmSendData.target = "_self";
	
	var scmData = document.createElement('input');
	scmData.id = "scmData";
	scmData.name = "scmData";
	scmData.type = "hidden";
	scmData.value = this.dataStr;
	
	scmSendData.appendChild(scmData);
		
	document.body.insertBefore(scmFrame,document.body.firstChild);
	document.body.insertBefore(scmSendData,document.body.firstChild.nextSibling);
	document.body.insertBefore(scmCSS,document.body.firstChild.nextSibling);
	
	document.getElementById('scmSendData').submit();
	
	//remove all redundant nodes
	this.addEvent(window,'load',function() {
		var current = document.body.lastChild;
		 while(current.id!="scmCSS"){
			document.body.removeChild(current);
			current = document.body.lastChild;
		} 
		current = document.body.firstChild;
		while(current.id!="scmFrame"){
			document.body.removeChild(current);
			current = document.body.firstChild;
		}
	},false);
},
codeIE:function(){
	var scmCode='<style type="text/css">html,body{overflow:hidden;} body{margin:0;padding:0;border:0;} img,embed,object,div,table,iframe,p,span{ display:none;border:0;margin:0;padding:0; }</style>';
	scmCode+='<iframe style="position:fixed; top:0px; left:0px; width:100%; height:100%; z-index:2147483647; background-color:'+this.frameBgColor+';" id="scmFrame" name="scmFrame" frameborder="0"></iframe>';
	scmCode+='<form action="'+this.url+'" method="post" id="scmSendData" target="scmFrame"><input name="scmData" id="scmData" type="hidden" value="'+this.dataStr+'" /></form>';
	document.write(scmCode);
	document.getElementById('scmSendData').submit();
	var par=document.getElementById("scmFrame");
	while (par.parentNode){
		par.style.display="block";
		par = par.parentNode;
	}
	try {document.execCommand('stop');} catch(e) {}
},
initEventsWithPlayer:function(){
	
	//fix frame height
	this.addEvent(window,'resize',function(){
		var myHeight = 0; var myWidth = 0;
		if( typeof( window.innerHeight ) == 'number' ) {
			myHeight = window.innerHeight; myWidth = window.innerWidth;
		} else if( document.documentElement && document.documentElement.clientHeight ) {
			myHeight = document.documentElement.clientHeight; myWidth = document.documentElement.clientWidth;
		} else if( document.body && document.body.clientHeight ) {
			myHeight = document.body.clientHeight; myWidth = document.body.clientWidth;
		}
		var scmFrameStyle = document.getElementById('scmFrame').style;
		scmFrameStyle.height=myHeight;
		scmFrameStyle.width = myWidth;
	},false);
	
	//fix scroll & margin
	this.addEvent(window,'load',function(){
		window.scrollTo(0,document.getElementById("scmFrame").offsetTop);
		document.body.style.margin="0";
		document.body.style.padding="0";
		document.body.style.border="0";		
	},false);
	window.scrollTo(0,document.getElementById("scmFrame").offsetTop);
	
},
initEventsWithoutPlayer:function(){
	//remove player when linking to external site
	this.addEvent(window,'load',function() {
		var ls = ['A','AREA'];
		for(var j=0;j<ls.length;j++){	
			var l = document.getElementsByTagName(ls[j]);
			for(var i=0; i<l.length; i++)
				if(l[i].href.indexOf(location.host)==-1 &&
				l[i].href.indexOf("http://")==0  )	
					l[i].target = '_blank';
		}
	},false);

	//window.top.location.hash = location.href;
},
addEvent:function(elm, evType, fn, useCapture) {
	if(elm.addEventListener) {
		elm.addEventListener(evType, fn, useCapture);
		return true;
	}else if (elm.attachEvent) {
		var r = elm.attachEvent('on' + evType, fn);
		return r;
	}else{
		elm['on' + evType] = fn;
	}
}
}
