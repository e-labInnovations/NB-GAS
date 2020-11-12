
class area {
  constructor(uid, areaId) {
    this.uid = uid;
    this.areaId = areaId;
    this.billTemplate = mainSS.getSheetByName('Bill');
    
    this.Areas = new areas(uid);
    let ssId = this.Areas.getAreaById({areaId: areaId}).data.ssId;
    let areaSs = SpreadsheetApp.openById(ssId);
    let canEdit = this.canEdit()
    
    this.customers = new customers(uid, areaSs, canEdit);
    this.allProducts = new allProducts(uid, areaSs, canEdit);
    this.products = new products(uid, areaSs, canEdit);
  }
  
  canEdit() {
    let joinedMembers = this.Areas.getMembersByAreaId({areaId: this.areaId}).data;
    let areaObj = this.Areas.getAreaById({areaId: this.areaId}).data;
    let isOwner = areaObj.owner == this.uid;
    let isJoined = null;
    let isViewer = true;
    for (var i=0; i < joinedMembers.length; i++) {
        if (joinedMembers[i].userId === this.uid) {
          isJoined = true;
          isViewer = joinedMembers[i].role == 'Viewer';
        }
    }
    if(!isJoined) {
      if(!isOwner) {
        return false;
      }
    }
    return isOwner || !isViewer;
  }
}


  
//############################################################### CUSTOMERS ###############################################################
class customers {
  constructor(uid, areaSs, canEdit) {
    this.cSheet = areaSs.getSheetByName('Customers');
    this.cSheetLC = this.cSheet.getLastColumn();
    this.cSheetLR = this.cSheet.getLastRow();
    this.canEdit = canEdit;
  }
  //Add new customer
  addCustomer(data) {
    if(!this.canEdit) return getError('You don\'t have any permission to edit');
    let result = {};
    if(!("name" in data)) {
      result = getError('name is missing');
      return result;
    }
    
    let customerId = data.customerId || getNewId(6);
    let name = data.name;
    let phone = data.phone || '';
    let email = data.email || '';
    let about = data.about || '';
    let address = data.address || '';
    
    this.cSheet.appendRow([customerId, name, phone, email, about, address])
    
    return {customerId, name, phone, email, about, address};
  }
  
  //Update customer
  updateCustomer(data) {
    if(!this.canEdit) return getError('You don\'t have any permission to edit');
    let result = {};
    if(!("customerId" in data)) return getError('customerId is missing');
    let customerId = data.customerId;
    
    let customerRow = getRowById(this.cSheet, customerId, 1);
    if(!customerRow) return getError('Customer not found');
    
    let rowData = this.cSheet.getRange(customerRow, 1, 1, this.cSheetLC).getValues()[0];
    let name = data.name || rowData[1];
    let phone = data.phone || rowData[2];
    let email = data.email || rowData[3];
    let about = data.about || rowData[4];
    let address = data.address || rowData[5];
    this.cSheet.getRange(customerRow, 1, 1, this.cSheetLC).setValues([[customerId, name, phone, email, about, address]])
    
    return rowData;
  }
  
  //delete customer
  deleteCustomer(data) {
  }
}
  
//############################################################### All Products ###############################################################
class allProducts {
  constructor(uid, areaSs, canEdit) {
    this.apSheet = areaSs.getSheetByName('All Products');
    this.apSheetLC = this.apSheet.getLastColumn();
    this.apSheetLR = this.apSheet.getLastRow();
    this.canEdit = canEdit;
  }
  //Add new Product
  addProduct(data) {
    if(!this.canEdit) return getError('You don\'t have any permission to edit');
    let result = {};
    if(!("name" in data) || !("monthlyPrice" in data) ) {
      result = getError('name or monthlyPrice is missing');
      return result;
    }
    
    let pId = data.pId || getNewId(6);
    let name = data.name;
    let productCode = data.productCode || getInitials(name);
    let monthlyPrice = data.monthlyPrice;
    let pricingCycle = data.pricingCycle || 'Monthly';
    let logo = data.logo || 'https://via.placeholder.com/400x90.png?text='+name.replace(/\s+/g, '+');
    
    this.apSheet.appendRow([pId, name, productCode, monthlyPrice, pricingCycle, logo])
    
    return {pId, name, productCode, monthlyPrice, pricingCycle, logo};
  }
  
  //Update Product
  updateProduct(data) {
    if(!this.canEdit) return getError('You don\'t have any permission to edit');
    let result = {};
    if(!("pId" in data)) return getError('pId is missing');
    let pId = data.pId;
    
    let productRow = getRowById(this.apSheet, pId, 1);
    if(!productRow) return getError('Product not found');
    
    let rowData = this.apSheet.getRange(productRow, 1, 1, this.apSheetLC).getValues()[0];
    let name = data.name || rowData[1];
    let productCode = data.productCode || getInitials(name) || rowData[2];
    let monthlyPrice = data.monthlyPrice || rowData[3];
    let pricingCycle = data.pricingCycle || rowData[4];
    let logo = data.logo || rowData[5];
    this.apSheet.getRange(productRow, 1, 1, this.apSheetLC).setValues([[pId, name, productCode, monthlyPrice, pricingCycle, logo]])
    
    return rowData;
    
  }
  
  //delete Product
  deleteProduct(data) {
  }
}

  
//############################################################### Products ###############################################################
class products {
  constructor(uid, areaSs, canEdit) {
    this.pSheet = areaSs.getSheetByName('Products');
    this.pSheetLC = this.pSheet.getLastColumn();
    this.pSheetLR = this.pSheet.getLastRow();
    this.apSheet = areaSs.getSheetByName('All Products');
    this.apSheetLC = this.apSheet.getLastColumn();
    this.apSheetLR = this.apSheet.getLastRow();
    this.canEdit = canEdit;
  }
  //Add new Product
  addProduct(data) {
    if(!this.canEdit) return getError('You don\'t have any permission to edit');
    let result = {};
    if(!("pId" in data) || !("customerId" in data)) return getError('pId or customerId is missing');
    let pId = data.pId;
            
    let productRow = getRowById(this.apSheet, pId, 1);
    if(!productRow) return getError('Product not found');
    let rowData = this.apSheet.getRange(productRow, 1, 1, this.apSheetLC).getValues()[0];
    
    let customerId = data.customerId;
    let productId = getNewId(6);
    let monthlyPrice = data.monthlyPrice || rowData[3];
    let pricingCycle = data.pricingCycle || rowData[4];
    let startedDate = data.startedDate ? new Date(data.startedDate) : new Date();
    let expireDate = data.expireDate ? new Date(data.expireDate) : '';
    let status = data.status || 'ACTIVE';
    let note = data.note || '';
    
    this.pSheet.appendRow([productId, customerId, pId, monthlyPrice, pricingCycle, startedDate, expireDate, status, note])
    return 'New product added'
  }
  
  //Update Product
  updateProduct(data) {
  }
  
  //delete Product
  deleteProduct(data) {
  }
}

const tsetArea = () => {
  let Area = new area('ashad2', 'nmaltT');
//  let d = Area.customers.addCustomer({name: 'Mohammed Ashad'});
//  let d = Area.customers.updateCustomer({customerId: 'yF0NcU', name: 'Mohammed Ashad', phone: '8089931063'});
//  let d = Area.canEdit();
//  let d = Area.allProducts.addProduct({name: 'Mathrubhumi', monthlyPrice:240});
//  let d = Area.allProducts.updateProduct({pId: 'duNFun', name: 'Chandrika'});
  let d = Area.products.addProduct({pId: 'duNFun', customerId: 'yF0NcU'});        
  Logger.log(d)
}