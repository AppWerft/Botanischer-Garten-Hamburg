<?php

include('app_conf.php');
$DBNAME   = 'polygoneeditor';
header('Content-type: application/json');
if (!$link) {
    die('Verbindung nicht möglich : ' . mysql_error());
}
$db_selected = mysql_select_db($DBNAME,$link);
mysql_query("SET NAMES UTF8");
mysql_query("SET CHARACTER_SET UTF8");	

if ($_POST && $_POST['key'] == 'loki') {
//	error_log('P'.print_r($_POST,true));
	$title = $_POST['name'];
	$vertex = $_POST['vertex'];
	$sql = 'INSERT INTO vertices (client, title, vertex) VALUES ("loki","'.mysql_real_escape_string($title).'","' . mysql_real_escape_string($vertex) . '");';
	mysql_query($sql);error_log($sql);
	error_log(mysql_error()); 
} else {
	$sql = 'SELECT vertex ,title,TIME_TO_SEC(TIMEDIFF(NOW(),ctime)) AS age from vertices  where ctime IN (SELECT max(ctime) FROM vertices WHERE client="loki" GROUP BY title ORDER BY ctime)';
	$res = mysql_query($sql);
	$vertices = array();
	while ($row = mysql_fetch_object($res)){
		$vertices[$row->title] =  json_decode($row->vertex);
	}
	echo json_encode($vertices);
}	