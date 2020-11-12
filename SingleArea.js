
class area {
  constructor(uid, areaId) {
    this.uid = uid;
    this.areaId = areaId;
    this.billTemplate = mainSS.getSheetByName('Bill');
    
    this.Areas = new areas(uid);
    let ssId = this.Areas.getAreaById({areaId: areaId}).data.ssId;
    let areaSs = SpreadsheetApp.openById(ssId);
    
    this.customers = new customers(uid, areaSs);
    this.allProducts = new allProducts(uid, areaSs);
    this.products = new products(uid, areaSs);
  }
  
  canEdit() {
    let joinedMembers = this.Areas.getMembersByAreaId({areaId: this.areaId}).data;
    let areaObj = this.Areas.getAreaById({areaId: this.areaId}).data;
    let isOwner = areaObj.owner == this.uid;
    let isViewer = true;
    for (var i=0; i < joinedMembers.length; i++) {
        if (joinedMembers[i].userId === this.uid) {
            isViewer = joinedMembers[i].role == 'Viewer';
        }
    }
    return isOwner || !isViewer;
  }
}


  
//############################################################### CUSTOMERS ###############################################################
class customers {
  constructor(uid, areaSs) {
    this.cSheet = areaSs.getSheetByName('Customers');
    this.cSheetLC = this.cSheet.getLastColumn();
    this.cSheetLR = this.cSheet.getLastRow();
  }
  //Add new customer
  addCustomer(data) {
    return 'New customer added'
  }
  
  //Update customer
  updateCustomer(data) {
  }
  
  //delete customer
  deleteCustomer(data) {
  }
}
  
//############################################################### All Products ###############################################################
class allProducts {
  constructor(uid, areaSs) {
    this.apSheet = areaSs.getSheetByName('All Products');
    this.apSheetLC = this.apSheet.getLastColumn();
    this.apSheetLR = this.apSheet.getLastRow();
  }
  //Add new Product
  addProduct(data) {
    return 'New product added'
  }
  
  //Update Product
  updateProduct(data) {
  }
  
  //delete Product
  deleteProduct(data) {
  }
}

  
//############################################################### Products ###############################################################
class products {
  constructor(uid, areaSs) {
    this.pSheet = areaSs.getSheetByName('Products');
    this.pSheetLC = this.pSheet.getLastColumn();
    this.pSheetLR = this.pSheet.getLastRow();
  }
  //Add new Product
  addProduct(data) {
    return 'New product added'
  }
  
  //Update Product
  updateProduct(data) {
  }
  
  //delete Product
  deleteProduct(data) {
  }
}


  
const canEdit = (uid, areaId) => {
  return this.cSheetLC
}

const tsetArea = () => {
  let Area = new area('ashad2', 'nmaltT');
  //let d = Area.allProducts.addProduct({areaId: 'nmaltT'});
  let d = Area.canEdit();
  Logger.log(d)
}