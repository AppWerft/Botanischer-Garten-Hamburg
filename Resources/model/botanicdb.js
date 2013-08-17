const noHidden = 0;
Ti.include('/depot/punchcards.js');
var foo = [1, 7, 67, 111, 45];
var familyList = [];
for (var counter = 0; counter < familyNames.length; counter++) {
	familyList[counter] = {
		exists : true,
		name : familyNames[counter]
	};
}
var cols = PunchCards[0].length, rows = PunchCards.length
for (var loop = 0; loop < foo.length; loop++) {// alle Parameter
	for (var row = 0; row < rows; row++) {// alle Spalten (Parameter)
		if (foo[loop] == row + 1) {// relevante Eigenschaft
			for (var col = 0; col < cols; col++) {// alle Familien
				if (PunchCards[row][col] == 0) {
					familyList[col].exists = 0;
				}
			}
		}
	}
}
var res = [];
for (var i = 0; i < familyList.length; i++) {
	if (familyList[i].exists == 1)
		res.push(familyList[i].name);
};
console.log(res.length);
/*
 var link = Ti.Database.install('/depot/botanic.db', 'botanic');
 //link.execute('DELETE FROM familyNames');

 //link.execute('DELETE FROM punch');
 for (var f = 0; f < PunchCards.length; f++) {
 var punch = PunchCards[f];
 for (var p = 0; p < punch.length; p++) {
 if (punch[p]) {
 var q = 'INSERT INTO punch VALUES ("' + parseInt(f + 1) + '","' + parseInt(p + 1) + '")';
 //		link.execute(q);
 }
 }
 }*/