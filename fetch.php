<?php

require_once("xml2json/xml2json.php");
$url = $_GET['url'];

// Open the Curl session
$session = curl_init($url);

$postvars = '';
foreach($_POST as $key => $value){
	$postvars .= $key.'='.$value.'&';
}
if($postvars!=''){
	curl_setopt ($session, CURLOPT_POST, true);
	curl_setopt ($session, CURLOPT_POSTFIELDS, $postvars);
}
// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$xml = curl_exec($session);

curl_close($session);

$json = xml2json::transformXmlStringToJson($xml);

echo($json);
?>
