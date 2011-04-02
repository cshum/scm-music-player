<?php
function unesc($name){ 
	if (get_magic_quotes_gpc()) return stripslashes($name);
	else return $name;
}
function fixURL($url){
	if($url=="")
		return "about:blank";
	$url = htmlspecialchars($url,ENT_QUOTES);
	$dummy="scmmusicplayer=adrianshum";
	if(strpos($url,"?")) 
		$url=str_replace("?","?".$dummy."&amp;",$url);
	else if(strpos($url,"#")) 
		$url=str_replace("#","?".$dummy."#",$url);
	else 
		$url.="?".$dummy;
	return $url;
}
function generateFrames($url,$data,$playerTop,$showPlaylist){
	$fs11 = '<frameset id="innerHalf" name="innerHalf" rows="*" cols="';
	$fs12 = '" framespacing="0" frameborder="no" border="0">';
	$fs12 .= '<frame name="data" id="data" noresize="noresize" title="('.$data.')" />';
	$content = '<frame src="'.$url.'"  name="content" id="content" />';
	$list1 = '<frame ';
	$listsrc = 'src="playlist.html"';
	$list2 = ' name="playlist" id="playlist" scrolling="no" noresize="noresize" title="" />';
	$fs13 = '</frameset>';
	if($showPlaylist)
		$inner = $fs11.'0,*,202'.$fs12.$content.$list1.$listsrc.$list2.$fs13;
	else
		$inner = $fs11.'0,*,1'.$fs12.$content.$list1.$list2.$fs13;
	
	$fs21 = '<frameset rows="';
	$fs22 = '" id="outerHalf" name="outerHalf" cols="*" frameborder="no" border="0" framespacing="0">';
	$player = '<frame src="player.html?310311" name="player" id="player" scrolling="no" noresize="noresize" title="" /> ';
	$fs23 = '</frameset>';
	
	if($playerTop==true)
		$outer = $fs21.'25,*'.$fs22.$player.$inner.$fs23;
	else
		$outer = $fs21.'*,25'.$fs22.$inner.$player.$fs23;
	
	return $outer;
}

$data = unesc($_POST['scmData']);
$playerTop = $_GET['place']!='bottom';
$showPlaylist = $_GET['showplaylist']=='true';
$url=fixURL($_GET['url']);

if($data==""){
	header( 'Location: http://scmplayer.net' ) ;
}else{ ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>SCM Music Player</title>
</head>
<?php echo generateFrames($url,$data,$playerTop,$showPlaylist); ?>
</html>

<?php } ?>
