/*
Areas
    create
    changeName
    delete
    getAreaById
    getAreasByOwner
    getMembersById
    getAreasByUser
    joinArea
    changeMemberRole
*/

class areas {
  constructor(uid) {
    this.uid = uid;
    this.areasSheet = mainSS.getSheetByName('Areas');
    this.areasSheetLC = this.areasSheet.getLastColumn();
    this.areasSheetLR = this.areasSheet.getLastRow();
    this.amSheet = mainSS.getSheetByName('Area Members');
    this.amSheetLC = this.amSheet.getLastColumn();
    this.amSheetLR = this.amSheet.getLastRow();
  }
  
  //Create New Area
  create(data) {
    let result = {};
    if(!("name" in data)) {
      result = getError('name is missing');
      return result;
    }
    
    let areaId = getNewId(6);
    let owner = this.uid;
    let ssId = createAreaSheet(data.name, data.owner);
    let createdDate = new Date();
    let name = data.name;
    let acceptJoin = data.acceptJoin || false;
    
    this.areasSheet.appendRow([areaId, owner, ssId, name, createdDate, acceptJoin]);
    return this.getAreasByUser({userId: owner});
  }
  
  //Update Area name
  changeName(data) {
    let result = {};
    if(!("areaId" in data) || !("name" in data)) {
      result = getError('areaId or name is missing');
      return result;
    }
    
    let areaId = data.areaId;
    let name = data.name
    let uid = this.uid;
    let currentArea = this.getAreaById({areaId: areaId}).data;
    if(currentArea.owner == uid) {
      let row = getRowById(this.areasSheet, areaId, 1);
      this.areasSheet.getRange(row, 4).setValue(name);
      DriveApp.getFileById(currentArea.ssId).setName(name)
      result = { status: 'success', data: 'Name updated'};
      return result;
    } else {
      result = getError('Only owner can edit an Area');
      return result;
    }
  }
  
  //Delete area
  delete(data) {
    let result = {};
    if(!("areaId" in data)) {
      result = getError('areaId is missing');
      return result;
    }
    
    let areaId = data.areaId;
    let uid = this.uid;
    let currentArea = this.getAreaById({areaId: areaId}).data;
    if(currentArea.owner == uid) {
      let row = getRowById(this.areasSheet, areaId, 1);
      this.areasSheet.deleteRow(row);
      result = { status: 'success', data: 'Area deleted'};
      return result;
    } else {
      result = getError('Only owner can delete an Area');
      return result;
    }
  }
  
  //Return single area by areaId
  getAreaById(data) {
    let result = {};
    if(!("areaId" in data)) {
      result = getError('areaId is missing');
      return result;
    }
    
    let areaId = data.areaId;
    let areasArrayData = this.areasSheet.getRange(2, 1, this.areasSheetLR-1, this.areasSheetLC).getValues();
    
    for(var i = 0;i<areasArrayData.length; i++){
      let rAreaId = areasArrayData[i][0]; //index 1 is areaId
      if (rAreaId == areaId) {
        let areaObj = {
          areaId : areasArrayData[i][0],
          owner : areasArrayData[i][1],
          ssId : areasArrayData[i][2],
          name : areasArrayData[i][3],
          createdDate : areasArrayData[i][4],
          acceptJoin : areasArrayData[i][5]
        };
        result = { status: 'success', data: areaObj};
        return result;
	  }
    }
  }
  
  //Return all area ownered by current user
  getAreasByOwner(data) {
    let result = {};
    let owner = this.uid;
    var dataArray = [];
    let areasArrayData = this.areasSheet.getRange(2, 1, this.areasSheetLR-1, this.areasSheetLC).getValues();
    
    for(var i = 0;i<areasArrayData.length; i++){
      let rOwner = areasArrayData[i][1]; //index 1 is owner
      if (rOwner == owner) {
        let areaObj = {
          areaId : areasArrayData[i][0],
          owner : areasArrayData[i][1],
          ssId : areasArrayData[i][2],
          name : areasArrayData[i][3],
          createdDate : areasArrayData[i][4],
          acceptJoin : areasArrayData[i][5]
        };
        dataArray.push(areaObj);
	  }
	}
    
    result = { status: 'success', data: dataArray};
    return result;
  }
  
  //Return all Member of area with areaId
  getMembersByAreaId(data) {
    let result = {};
    if(!("areaId" in data)) {
      result = getError('areaId is missing');
      return result;
    }
    
    let areaId = data.areaId;
    let membersArrayData = this.amSheet.getRange(2, 1, this.amSheetLR-1, this.amSheetLC).getValues();
    let membersArray = [];
    
    for(var i = 0;i<membersArrayData.length; i++){
      let rAreaId = membersArrayData[i][2]; //index 1 is areaId
      if (rAreaId == areaId) {
        let memberObj = {
          joinId : membersArrayData[i][0],
          userId : membersArrayData[i][1],
          areaId : membersArrayData[i][2],
          role : membersArrayData[i][3],
          joinedDate : membersArrayData[i][4]
        };
        membersArray.push(memberObj);
	  }
    }
    
    result = { status: 'success', data: membersArray};
    return result;
    
  }
  
  //Return all areas of current user
  getAreasByUser(data) {
    let result = {};
    let userId = this.uid;
    var ownerDataArray = this.getAreasByOwner({owner: userId}).data;
    var dataArray = ownerDataArray.map(area => {
                                       return {...area, joinedDate: area.createdDate, role: 'Owner'}
                                       });
    
    let areasArrayData = this.amSheet.getRange(2, 1, this.amSheetLR-1, this.amSheetLC).getValues();
    
    for(var i = 0;i<areasArrayData.length; i++){
      let rUserId = areasArrayData[i][1]; //index 1 is userId
      if (rUserId == userId) {
        let areaObj = this.getAreaById({areaId: areasArrayData[i][2]}).data;
        areaObj.joinId = areasArrayData[i][0]
        areaObj.role = areasArrayData[i][3]
        areaObj.joinedDate = areasArrayData[i][4]
        dataArray.push(areaObj);
	  }
	}
    
    result = { status: 'success', data: dataArray}
    return result
  }
  
  //Join to Area
  joinArea(data) {
    let result = {}
    if(!("areaId" in data)) {
      result = getError('areaId is missing');
      return result;
    }
    
    let userId = this.uid;
    let areaId = data.areaId;
    
    
    let allAreas = this.getAreasByUser(data).data;
    for(var i = 0; i<allAreas.length; i++){
      if(allAreas[i].areaId == areaId){
        result = getError('You are already joined before');
        return result;
      }
    }
    
    let areaObj = this.getAreaById({areaId:areaId}).data;
    if(areaObj.acceptJoin) {
      let joinId = getNewId(6);
      let role = 'Viewer';
      let joinDate = new Date();
      this.amSheet.appendRow([joinId, userId, areaId, role, joinDate]);
      return this.getAreasByUser({userId: userId});
    } else {
      result = getError(`The Area with the areaId "${areaObj.areaId}"  not accept new joins`);
      return result
    }
  }
  
  //Change area member role
  changeMemberRole(data) {
    let result = {};
    if(!("joinId" in data) || !("role" in data)) {
      result = getError('joinId or role is missing');
      return result;
    }
    
    let joinId = data.joinId;
    let owner = this.uid;
    let role = data.role;
    
    let membersArrayData = this.amSheet.getRange(2, 1, this.amSheetLR-1, this.amSheetLC).getValues();
    
    for(var i = 0;i<membersArrayData.length; i++){
      let rJoinId = membersArrayData[i][0]; //index 1 is joinId
      if (rJoinId == joinId) {
        let areaObj = this.getAreaById({areaId:membersArrayData[i][2]}).data;
        if(areaObj.owner == owner) {
          let row = i+2;
          this.amSheet.getRange(row, 4).setValue(role);
          return this.getMembersByAreaId({areaId:membersArrayData[i][2]});
        } else {
          result = getError(`You are not the owner of the Area with the areaId "${areaObj.areaId}"`);
          return result;
        }
	  }
    }
    result = getError(`The Member with the joinId "${joinId}" not exist`);
    return result;
    
  }
  
  
}

//###############################################################################################################

const createAreaSheet = (name, userId) => {
  let userSheetTemplate = DriveApp.getFileById(userSheetId);
  let userFolder = getOrCreateUserFolder(userId);
  let NewUserSheet = userSheetTemplate.makeCopy(name, userFolder);
  return NewUserSheet.getId();
}

const getOrCreateUserFolder = (childFolderName) => {
  var childFolder, childFolders;
  // Gets FolderIterator for childFolder
  childFolders = userMainFolder.getFoldersByName(childFolderName);
  /* Checks if FolderIterator has Folders with given name
  Assuming there's only a childFolder with given name... */ 
  while (childFolders.hasNext()) {
    childFolder = childFolders.next();
  }
  // If childFolder is not defined it creates it inside the parentFolder
  if (!childFolder) {
    childFolder = userMainFolder.createFolder(childFolderName);
  }
  return childFolder;
}

const test = () => {
  let Areas = new areas('ashad2');
//  let d = Area.getMembersByAreaId({userId:'ashad1', owner:'ashad1', name:'Thech', areaId: 'nmaltT', role: 'Editor', joinnId: 'wMOSkD'})
//  let d = Areas.changeMemberRole({owner: 'ashad2', joinId: 'wMOSkD', role: 'Viewer'});
  let d = Areas.changeName({areaId: 'nmaltT', name: 'New Appla'});
//  let d = Areas.delete({areaId: 'nmaltT'});
//  let d = Areas.joinArea({areaId: 'nmaltT'});
  Logger.log(d)
}