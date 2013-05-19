<?php
$res = (object) array();
$area = '';
$lines = file('form_de.txt');
foreach ($lines AS $line) {
	$line = rtrim($line);
	if (!preg_match('/^[\d]+/',$line)) {
		$area = $line;
	} else {
		$parts = preg_match('/^([0-9]+)\.(.*)/',$line,$m);
		$x = (object) array($m[1]=>$m[2]);	
		$res->{$area}->{$m[1]}= ltrim($m[2]);
	}
}

echo 'var filter=' .json_encode($res).';';