<?php 
require "config.php";

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<title>SCM Music Player - seamless music for your website.</title>
<link rel="stylesheet" type="text/css" href="reset.css" />
<link rel="stylesheet" type="text/css" href="site.css" />
<style type="text/css">

.skinPreview{ height:25px;width:100%; }
</style>
</head>

<body>


<!--SCM Music Player by Adrian C Shum - http://scmplayer.net-->
<script type="text/javascript" src="<?php echo $dir; ?>script.php" ><!--
//--></script>
<script type="text/javascript"><!--
SCMMusicPlayer.init("{'skin':'skins/cyber/skin.css','playback':{'autostart':'false','shuffle':'false','volume':'50'},'playlist':[{'title':'Never Gonna Give You Up','url':'http://www.youtube.com/watch?v=oHg5SJYRHA0'},{'title':'8-Bit Rick Roll','url':'http://www.youtube.com/watch?v=b1WWpKEPdT4'},{'title':'Trolololololol','url':'http://www.youtube.com/watch?v=2Z4m4lnjxkY'},{'title':'Rick Roll Reversed','url':'http://www.youtube.com/watch?v=aD4bn5pp32w'},{'title':'Scary Roll','url':'http://www.youtube.com/watch?v=Jwj0gLriTnk'},{'title':'Who Killed Captain Alex','url':'http://www.youtube.com/watch?v=BymeLkZ7GqM'},{'title':'Who Killed Captain Alex Remix','url':'http://www.youtube.com/watch?v=_51NDCK6uIU'},{'title':'Never Gonna Give You Up','url':'http://www.youtube.com/watch?v=oHg5SJYRHA0'},{'title':'8-Bit Rick Roll','url':'http://www.youtube.com/watch?v=b1WWpKEPdT4'}],'placement':'bottom','showplaylist':'false'}");
//--></script>
<!--End of SCM Music Player script-->


<a href="http://github.com/cshum/SCM-Music-Player/" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://d3nwyuy0nl342s.cloudfront.net/img/7afbc8b248c68eb468279e8c17986ad46549fb71/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub"></a>

<div style="background:#666;color:#fff;">
<div id="title">
<p class="caption">seamless music for your website</p>
<h2><a href="http://scmplayer.net">SCM Music Player</a></h2>

</div>
</div>
<div id="container">


<div id="navigation" >
<ul class="linkList">
<li><a href="#title">HOME</a></li>
<li><a href="#development">DEVELOPMENT</a></li>
<li><a href="#donate">DONATE</a></li>
<li><a href="#about">ABOUT</a></li>
<li><a href="#contact">CONTACT</a></li>
</ul>
<p>
<?php if(array_key_exists("scmmusicplayer",$_GET)){ ?>

<script type="text/javascript"><!--
google_ad_client = "pub-6799082498278077";
/* 160x600, created 03/10/10 */
google_ad_slot = "6159633219";
google_ad_width = 160;
google_ad_height = 600;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>

 <?php } ?> 
</p>
</div>



<div id="content">
<p class="large"><a href="http://scmplayer.net">SCM Music Player</a> is a free and open source web music player, that brings a seamless music experience to your website. Support Wordpress, Tumblr, Blogger.</p>

<a name="wizard"></a>
<h3>SETUP WIZARD</h3>
<ul class="bullet"> 
<li>Go through each tab to <strong>Choose Skin</strong>, <strong>Edit Playlist</strong>, and <strong>Configure Settings</strong>. Select <strong>Done</strong> to proceed.</li> 
<li><strong>Returning user?</strong> You can select <strong>Import Profile</strong>, to load up and edit your current script.</li> 
</ul>

<div class="loading" id="loading" style="height:200px;"></div>

<ul id="parts" class="stack" style="display:none;">
<li class="stackItem on">
<form id="wizardForm" name="wizardForm">
<ul id="wizardTab" class="tabContent">
<li title="Choose Skin" class="on tabItem">
<ul class="list" >
<table class="data" id="skinChoice" >
<tr><th colspan="2">DEFAULT SKINS</th></tr>
<tr style="display:none;"><td style="width:620px;"><iframe src="" class="skinPreview" frameborder="0"></iframe></td>
<td style="text-align:center;width:30px;"><input type="radio" name="skinType" value="skins/tunes/skin.css" checked="checked" /> </td>
</tr>
</table>
<table class="data">
<tr><th colspan="2">CUSTOM SKIN URL</th></tr>
<tr><td><input type="text" id="customSkin" name="customSkin" style="width:610px;" value="" /></td>
<td style="text-align:center;width:30px;"><input type="radio" name="skinType" id="skinTypeCustom" value="custom" /> </td>
</tr>


</table>
</ul>

</li>
<li title="Edit Playlist" class="tabItem">
<p><input type="radio" name="listType" id="manualListRadio" value="manual" checked="checked" /> Manual Playlist 
<input type="radio" name="listType" id="dynamicListRadio" value="dynamic" /> Podcast (Youtube Playlist / RSS / XSPF)</p>
<ul id="listTypes" class="stack">
<li class="stackItem">
<ul class="bullet">
<li>Insert Song Title, and Song URL (e.g. http://somesite.com/file.mp3):</li>
<li>You can use Youtube address (http://www.youtube.com/watch?v=VIDEO_ID) as Song URL.</li>
</ul>
<table class="data" id="manualList" >
<tr>
<th style="width:310px">SONG TITLE</th>
<th style="width:310px">SONG URL</th>
<th></th>
</tr>
<tr style="display:none;">
<td><input type="text" value="" style="width:290px;" class="songTitle" name="title[]"/></td>
<td><input type="text" value="" style="width:290px;" class="songURL" name="url[]"/></td>
<td><input type="button" class="delete" value="x" /></td>
</tr>
</table>
<p><input type="button" value="Add More Songs" id="addSongsButton" /></p>
</li>
<li class="stackItem">
<h4>PLAYLIST URL</h4>
<p><input type="text" value="" style="width:500px;" id="dynamicURL" name="dynamicURL"/></p>
</li>
</ul>

</li>
<li title="Configure Settings" class="tabItem">


<table class="data" style="width:100%;" >
<tr><th colspan="2">PLAYBACK</th></tr>
<tr>
	<td style="width:50%;" >Autostart</td>
	<td>
		<select class="playback" name="autostart">
        <option value="true" >Yes</option>
        <option value="false" selected="selected">No</option>
		</select>
	</td>
</tr>
<tr>
	<td>Shuffle Playback</td>
	<td>
		<select class="playback" name="shuffle">
        <option value="true" >Yes</option>
        <option value="false" selected="selected">No</option>
		</select>
	</td>
</tr>
<tr>
	<td>Default Volume</td>
	<td>
		<select class="playback" name="volume">
<?php
		for($i=10;$i<=100;$i+=10)
			if($i==50)
				echo '<option selected="selected" value="50">50%</option>';
			else
				echo '<option value="'.$i.'">'.$i.'%</option>';
?>
		</select>
	</td>
</tr>
</table>


<table class="data" style="width:100%;" >
<tr><th colspan="2">APPEARENCE</th></tr>
<tr>
	<td style="width:50%;">Placement of the Player</td>
	<td>
		<select class="appearence" name="placement">
		<option value="top">Top</option>
        <option value="bottom" selected="selected">Bottom</option>
		</select>
	</td>
</tr>
<tr>
	<td style="width:50%;">Show Playlist by Default</td>
	<td>
		<select class="appearence" name="showplaylist">
		<option value="large">Only on large screen</option>
        <option value="true" >Yes</option>
        <option value="false" selected="selected">No</option>
		</select>
	</td>
</tr>

</table>


</li>
</ul>
</form>
<div style="padding-top:15px;">
<input type="button" id="wizardDone" style="float:right;" value="Done"/>
<input type="button" id="wizardImport" value="Import Profile"/>
</div>

</li>
<li class="stackItem gridContent">
<h4>IMPORT PROFILE</h4>
<p>You can import profile from your current SCM Music Player script, by pasting it to the field below. Press Ok to proceed.</p>
<p><textarea  style="width:640px;height:200px;" id="importField" ></textarea></p>
<p><input type="button" id="importOk" value="OK"/> 
<input type="button" id="importCancel" value="Cancel"/></p>
</li>

<li class="stackItem gridContent">
<h4>DONE</h4>
<p>Congratulations! Your SCM Music Player script has been created.</p>
<p>Please paste the following code under beginning of &lt;body&gt; tag (i.e. on top of webpage content).</p>
<p><textarea  style="width:640px;height:200px;" id="doneField" readonly="readonly" >
<!--SCM Music Player by Adrian C Shum - http://scmplayer.net-->
&lt;script type="text/javascript" src="<?php echo $dir; ?>script.php" &gt;&lt;!--
//--&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;&lt;!--
SCMMusicPlayer.init(&quot;=settings=&quot;);
//--&gt;&lt;/script&gt;
<!--End of SCM Music Player script-->
</textarea></p>
<p><input type="button" id="doneBack" value="Back"/></p>
</li>
</ul>

<h3 id="donate">DONATE</h3>
<p>SCM Music Player is free and open source. You can buy me a beer if you appreciate my work. :)</p>
<form action="https://www.paypal.com/cgi-bin/webscr" target="_top" method="post">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" style="border:none;" src="https://www.paypal.com/en_GB/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online.">
<img alt="" border="0" src="https://www.paypal.com/en_GB/i/scr/pixel.gif" width="1" height="1">
</form>

<h3 id="development">DEVELOPMENT</h3>
<p>SCM Music Player is now provided under a BSD License. It is free for both personal or commercial projects.
You can fork my source code, or report issues at Github.
</p> 
<p><a href="http://github.com/cshum/SCM-Music-Player/">SCM Music Player@Github</a></p>



<h3 id="about">ABOUT</h3> 
<p><a href="http://scmplayer.net">SCM Music Player</a> is a free and open source web music player, with powerful features that brings a seamless music experience for your website. Built with</p> 
<ul class="bullet"> 
<li>Mootools - Javascript Framework (<a href="http://mootools.net">http://mootools.net</a>)</li> 
<li>SoundManager 2 - Javascript Sound API (<a href="http://www.schillmania.com/projects/soundmanager2/">http://www.schillmania.com/projects/soundmanager2/</a>) </li> 
<li>YouTube Javascript API (<a href="http://code.google.com/apis/youtube/js_api_reference.html">http://code.google.com/apis/youtube/js_api_reference.html</a>)</li> 
</ul> 
 
<p>SCM Music Player is created by <a href="http://cshum.com">Adrian C Shum</a>. Trying to get my desire into web technologies, by creating fun and useful stuffs for the web.</p> 
 
<h3 id="contact">CONTACT</h3> 
<ul class="bullet"> 
<li>Email: <a href="&#x6D;&#x61;&#x69;&#x6C;&#x74;&#x6F;&#x3A;&#x6D;&#x61;&#x69;&#x6C;&#x40;&#x63;&#x73;&#x68;&#x75;&#x6D;&#x2E;&#x63;&#x6F;&#x6D;"> 
&#x6D;&#x61;&#x69;&#x6C;&#x40;&#x63;&#x73;&#x68;&#x75;&#x6D;&#x2E;&#x63;&#x6F;&#x6D;</a></li> 
</ul> 
<p>You can contact me for comments, feedback and questions etc. 
I will try to response, but I may be busy if you didn't get a reply for a week or two.</p> 
</div>

<div style="clear:both;padding-bottom:10px;"></div>
</div>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/mootools/1.2.5/mootools-yui-compressed.js"></script>
<script type="text/javascript" src="mootools-1.2.4.4-more.js"></script> 
<script type="text/javascript" src="wizard.js"></script>
<script type="text/javascript">
window.addEvent(Browser.Engine.trident ? "load": "domready",function(){
		$("loading").setStyle("display","none");
		$("parts").setStyle("display","block");
		
		new asweb.SCMWizard([
			"skins/tunes/skin.css",
			"skins/aquaBlue/skin.css",
			"skins/aquaPurple/skin.css",
			"skins/aquaPink/skin.css",
			"skins/aquaOrange/skin.css",
			"skins/aquaGreen/skin.css",
			"skins/cyber/skin.css",
			"skins/black/skin.css",
			"skins/blue/skin.css",
			"skins/purple/skin.css",
			"skins/pink/skin.css",
			"skins/orange/skin.css",
			"skins/green/skin.css"
		]);
});
</script>
</body>

</html>
