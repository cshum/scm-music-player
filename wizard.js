String.implement({
    uniEscape: function(){
        var eStr = "";
        for (var i = 0; i < this.length; i++) 
            if (this.charCodeAt(i) > 127 || this.charAt(i) == "'" || this.charAt(i) == "\"" || this.charAt(i) == "\\") 
                eStr += escape(this.charAt(i));
            else 
                eStr += this.charAt(i);
        
        return eStr;
    }
});

window.asweb = window.asweb || {};
asweb.Stack = new Class({
	initialize:function(id){
		var self = this;
		this.id = id;
		this.no = null;
		$(id).getChildren().each(function($el,i){
			if($el.hasClass("on"))
				self.no = i;
		});
		
	},
	set:function(no){
		if(this.no!=null){
			$(this.id).getChildren()[this.no].removeClass("on");
		}
		this.no = no;
		$(this.id).getChildren()[this.no].addClass("on");
	}
});
asweb.Tab = new Class({
	initialize:function(id){
		var self = this;
		this.id = id;
		this.no = null;
		this.$tab = new Element("ul",{"class":"tab"});
		
		$(id).getChildren().each(function($el,i){
			var $li = new Element("li",{"text":$el.get("title")}).inject(self.$tab);
			$li.addEvent("click",function(){
				self.set(i);
			});
			$el.set("title","");
			if($el.hasClass("on")){
				$li.addClass("on");
				self.no = i;
			}
		});
		this.$tab.inject(id,"before");
		this.$tab.addEvent("mousedown",function(e){
			e.stop();
		});
	},
	set:function(no){
		if(this.no!=null){
			this.$tab.getChildren()[this.no].removeClass("on");
			$(this.id).getChildren()[this.no].removeClass("on");
		}
		this.no = no;
		this.$tab.getChildren()[this.no].addClass("on");
		$(this.id).getChildren()[this.no].addClass("on");
	}
	
});



asweb.SCMWizard = new Class({
	initialize:function(skins){
		var self = this;
		this.wizardTab = new asweb.Tab("wizardTab");
		this.skins = skins;
		this.initSkins();
		this.initSongs();
		this.initParts();
		this.setManualList();
		$("manualListRadio").addEvent("click",function(){
			self.setManualList();
		});
		$("dynamicListRadio").addEvent("click",function(){
			self.setDynamicList();
		});
		$("customSkin").addEvent("click",function(){
			$("skinTypeCustom").set("checked",true);
		});
	},
	initParts:function(){
		var self = this;
		this.parts = new asweb.Stack("parts");
		
		$$("#importCancel,#doneBack").addEvent("click",function(){
			self.parts.set(0);
		});
		$("wizardImport").addEvent("click",function(){
			self.parts.set(1);
		});
		$("doneField").addEvent("click",function(){
			this.focus();
			this.select();
		});
		this.codeTemplate = $("doneField").get("value");
		$("wizardDone").addEvent("click",function(){
			if(self.exportCode()){
				self.parts.set(2);
			}else{
				alert("You haven't added any songs yet. Please go and Edit Playlist first.");
				self.wizardTab.set(1);
			}
			
		});
		
		$("importOk").addEvent("click",function(){
			if(self.importCode()){
				self.parts.set(0);
			}else{
				alert("Sorry, we cannot recognize your script.\n "+
				"Please make sure you have pasted the appropriate SCM Music Player script to be imported.");
			}
		});
	},
	initSkins:function(){
		$skinTemp = $("skinChoice").getElements("tr")[1].clone();
		$skinTemp.setStyle("display","");
		this.skins.each(function(url,i){
			$item = $skinTemp.clone();
			$item.getElement("iframe").set("src","skinPreview.html#"+url);
			$item.getElement("input").set("value",url);
			if(i>0)
				$item.getElement("input").set("checked",false);
			$item.inject($("skinChoice").getElement("tbody") || $("skinChoice"));
		});
		
		this.listTypes = new asweb.Stack("listTypes");
	},
	initSongs:function(){
		var self = this;
		
		this.smoothScroll = new Fx.Scroll($(document.body),{
			duration:500
		});
		this.$songItem = $("manualList").getElements("tr")[1].clone();
		this.$songItem.setStyle("display","");
		
		for(var i=0;i<9;i++)
			this.addSong();
		$("addSongsButton").addEvent("click",function(){
			for(var i=0;i<5;i++)
				self.addSong();
			//self.smoothScroll.toBottom();
		});
	},
	setManualList:function(){
		$("manualListRadio").set("checked",true);
		this.listTypes.set(0);
	},
	setDynamicList:function(){
		$("dynamicListRadio").set("checked",true);
		this.listTypes.set(1);
	},
	addSong:function(obj){
		var $item = this.$songItem.clone();
		if(obj){
			$item.getElement(".songTitle").set("value",unescape(obj.title));
			$item.getElement(".songURL").set("value",unescape(obj.url));
		}
		$item.getElement(".delete").addEvent("click",function(){
			$item.dispose();
		});
		$item.inject($("manualList").getElement("tbody") || $("manualList"));
	},
	removeAllSongs:function(){
		var $all = $("manualList").getElements("tr");
		for(var i=$all.length-1;i>=2;i--){
			$all[i].dispose();
		}
	},
	getConfig:function(){
		var form = $("wizardForm").toQueryString().parseQueryString();
		var playback = {
			autostart:form.autostart,
			shuffle:form.shuffle,
			volume:form.volume
		};
		if(form.listType=="manual"){
			var playlist = [];
			form.url.each(function(url,i){
				if(url!="")
					playlist.push({
						title:form.title[i].clean().uniEscape(),
						url:url.clean().uniEscape()
					});
			});
		}else{
			var playlist = form.dynamicURL;
		}
		return {
			skin:form.skinType == 'custom' ? form.customSkin : form.skinType,
			playback:playback,
			playlist:playlist,
			placement:form.placement,
			showplaylist:form.showplaylist
		};
	},
	setConfig:function(config){
		var self = this;
		var skinIndex = this.skins.indexOf(config.skin);
		if(skinIndex==-1){
			$("skinTypeCustom").set("checked",true);
			$("customSkin").set("value",config.skin);
		}else{
			$("skinChoice").getElements("input")[skinIndex+1].set("checked",true);
		}
		
		if($type(config.playlist)=="string"){
			this.setDynamicList();
			$("dynamicURL").set("value",config.playlist);
		}else{
			this.removeAllSongs();
			config.playlist.each(function(el){
				self.addSong(el);
			});
		}
		$$(".appearence").each(function($el){
			var name = $el.get("name");
			$el.set("value",config[name]);
		});
		$$(".playback").each(function($el){
			var name = $el.get("name");
			$el.set("value",config.playback[name]);
		});
		
	},
	importCode:function(){
		var code = $("importField").get("value");
		try{
			var v3Start = code.indexOf('new SCMMusicPlayer("');
            var v3End = code.lastIndexOf('");');
            var v5Start = code.indexOf('SCMMusicPlayer.init("');
            var v5End = code.lastIndexOf('");');
            
             if (v3Start > -1) {
             	var config = eval("(" + code.substring(v3Start + 20, v3End) + ")");
             	if(config.file)
             		config.playlist = config.file;
             	else{
             		config.playlist = config.playlist.map(function(el){
             			return {
             				title:el.title,
             				url:el.file
             			}
             		});
             	}
             	this.setConfig(config);
             	return true;
             }else if(v5Start > -1){
             	var config = eval("(" + code.substring(v5Start + 21, v5End) + ")");
             	this.setConfig(config);
             	return true;
             }else{
             	return false;
             }
		}catch(e){
			return false;
		}
	},
	exportCode:function(){
		var config = this.getConfig();
		if(config.playlist.length == 0)
			return false; 
		var configCode = JSON.encode(config).replace(/\"/g, "'");
		$("doneField").set("value",this.codeTemplate.replace(/\=settings\=/,configCode));
		return true;
	}
});
