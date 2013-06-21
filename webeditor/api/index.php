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
$res = mysql_query('SELECT json FROM points WHERE namespace="botsadhh"');
$row = mysql_fetch_object($res);
$json = $row->json;
echo $json;
