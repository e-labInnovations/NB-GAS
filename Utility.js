const getNewId = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const resJSON = (result) => {
  return ContentService
    .createTextOutput(result)
    .setMimeType(ContentService.MimeType.JSON);
}

const getError = (err) => {
  return { status: 'error', error: err}
}

const getRowById = (sheet, id, col) => {
	var lr= sheet.getLastRow();
	var lc= sheet.getLastColumn();
	var row = null;
	
	for(var i = 1;i<=lr; i++){
    	var rid = sheet.getRange(i,col).getValue();
    	if(rid == id ){
			row = i;
		}
	}
	return row;
}

const getInitials = (string) => {
  if(!string) return null;
  switch(string) {
    case 'Malayala Manorama':
      return 'MN';
      break;
    case 'Suprabhaatham':
      return 'SUP';
      break;
    case 'Siraj':
      return 'SIR';
      break;
    case 'Madhyamam':
      return 'MM';
      break;
    case 'Chandrika':
      return 'CH';
      break;
    case 'Mathrubhumi':
      return 'MB';
      break;
    case 'Deshabhimani':
      return 'DA';
      break;
    case 'Thejas':
      return 'TJS';
      break;
    default:
      var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();
  
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
  }
};