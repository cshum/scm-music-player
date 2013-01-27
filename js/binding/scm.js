define(['knockout','jquery','underscore'],function(ko,$){
	//Mask Button
	ko.bindingHandlers.maskBtn = {
		init:function(el,valueAccessor){
			var options = ko.utils.unwrapObservable(valueAccessor());
			_.defaults(options,{
				css:null,
				hasOffset:true,
				align:'left'
			});
			//button setup
			var bgChange = function(pos){
				if(options.hasOffset && pos=='top')
					$(this).removeClass(options.css);
				else{
					$(this).addClass(options.css);
					var left = parseInt($(this).css("left"));
					var right = parseInt($(this).css("right"));
					var bgx =  options.align=='left'? -left: right+$(this).width();
					$(this).css("backgroundPosition", (options.hasOffset?bgx:0) + "px "+pos);
				}
			}
			$(el)
				.on("mousedown",_.bind(bgChange,el,'bottom'))
				.on("mouseup",_.bind(bgChange,el,'top'))
				.on("mouseleave",_.bind(bgChange,el,'top'));

			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				$(el).off();
			});
		}
	};
	//hover caption
	ko.bindingHandlers.caption = {
		init: function(el, valueAccessor,allBindingsAccessor){
			var options = allBindingsAccessor().captionOptions || {};
			var value = ko.utils.unwrapObservable(valueAccessor());
			$(el).data('captionTarget',options.target);
			$(el).data('captionText',value);
			$(el).data('originalText',$(options.target).text());
			var caption = function(){
				var target = $(el).data('captionTarget');
				$(target).text($(el).data('captionText'));
			}
			var revert = function(){
				var target = $(el).data('captionTarget');
				$(target).text($(el).data('originalText'));
			}
			if(options.trigger=='hover'){
				$(el)
					.on('mouseover',caption)
					.on('mouseleave',revert);
			}else if(options.trigger=='slide'){
				$(el)
					.on('slidestart',function(){
						caption();
						$(el).on('slide',caption);
					})
					.on('slidestop',function(){
						$(el).off('slide',caption);
						revert();
					});
			}
			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				$(el).off();
			});
		},
		update:function(el, valueAccessor){
			var value = ko.utils.unwrapObservable(valueAccessor());
			$(el).data('captionText',value);
		}
	}
	//seeker follow left
	ko.bindingHandlers.followLeft = {
		init: function(el, valueAccessor,all){
			var $target = $(ko.utils.unwrapObservable(valueAccessor()));
			function update(){
				$target.css('left',($(el).position().left+$(el).width()+15)+'px');
			}
			$(el).data('followUpdate',update);
			var interval = setInterval(update,100);
			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				clearInterval(interval);
			});
		},
		update:function(el){
			setTimeout($(el).data('followUpdate'),0);
		}
	}
	//Volume Slider innerBound
	ko.bindingHandlers.innerBound = {
		init:function(el, valueAccessor){
			var options = ko.utils.unwrapObservable(valueAccessor());
			var $bound = $(el).find(options.bound);
			var $handle = $(el).find(options.handle);
			var width = 0;
			function update(){
				if(width==$handle.width()) return;
				width = $handle.width();
				var halfWidth = width/2;
				$bound.css('width',$(el).width()-$handle.width())
					.css('marginLeft',halfWidth)
					.css('marginRight',halfWidth);
				$handle.css('marginLeft',-halfWidth);
			}
			var interval = setInterval(update,100);
			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				clearInterval(interval);
			});
			update();
		}
	}
	return ko;
});

