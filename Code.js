const userSheetId = "1KwZ90VUZ6Qo5AAAgtGbU4e-qCHfC5DNdOuy-zSV2-_4";
const mainSheetId = "1tOC3D_EzKvnaK9FSgqcVrncNprhMrrmjm8pZ7cHjSF8";
const userMainFolderId = "1mIHKxguwN1Ncua125CNKttmXQnllEuVC";
const userMainFolder = DriveApp.getFolderById(userMainFolderId);
const mainSS = SpreadsheetApp.openById(mainSheetId);
const userSS = SpreadsheetApp.openById(userSheetId);


var ss = SpreadsheetApp.openById("1oLLgRuBYEr3HHrkZlAMAnBkVgtGy-AYyusk9uaARY4k");//User's account sheet id
var sheet = ss.getSheetByName('Users');//User's account sheet name

const doGet = (e) => {
  const method = e.parameter.method;
  const uid = e.parameter.uid;
  const areaId = e.parameter.areaId;
  const data = e.parameter.data;
  
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
};

const doPost = (e) => {
  doGet(e);
};