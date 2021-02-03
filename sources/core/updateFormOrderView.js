import {JetView} from "webix-jet";
import {CoreEditClass} from "core/CoreEditClass";



const METHOD_CREATE = "create";
const METHOD_UPDATE = "update";
const TYPE_OPERATION_MOVE = 3;
const TYPE_TABLE_PART_DEFAULT = 1;
const TYPE_TABLE_PART_CONTRAGENT = 2;
const TYPE_TABLE_PART_CATEGORY = 3;
const TYPE_TABLE_PART_PROJECT = 4;



window.procent = function(row, id){
  let item = $$("table_part").getItem(row);
  let sum = $$(id).getValue();
  return Math.round(item.value*100*100/sum) / 100
}

let formatDate = webix.Date.dateToStr("%d.%m.%y");
let formatDateStandart = webix.Date.dateToStr("%Y-%m-%d");


export default class UpdateFormOrderView extends JetView {
  constructor(app, name){
    super(app,name);
    this.state = new CoreEditClass(this);
  }

  config() {
      this.apiRest = this.app.config.apiRest;
      this.win = {};
      return {
          localId: "winEdit",
          view: "window",
          position: function (state) {
              state.left = 44;
              state.top = 42;
              state.width = state.maxWidth / 3;
              state.height = state.maxHeight - 42;
          },
          head: "Редактирование",
          close: true,
          modal: true,
          body: {
            localId: "formEdit",
            view: 'form',
            scroll : "auto",
            elements: this.state.formConfig
          }
      }
  }

  init(view, url) {
    this.attachClickEvents();
  }

  showForm(table) {
    let scope = this;
    let state  = this.state;
    let api = this.apiRest;
    let record = table.getSelectedItem();
    let isUpdate = (record);
    state.tableId = table.config.urlEdit;
    state.table = table;
    state.tableRecord = record;
    state.isUpdate = isUpdate;
    state.formEdit = this.$$('formEdit');
    state.formUrl = "accounting/"+state.tableId+"/form";
    state.win = this.$$("winEdit");

    state.formEdit.clearValidation();
    //get config elements for form and urls collection;
    api.get(state.formUrl).then(function(data) {
      scope.showWindow(data, scope);
    });
  }

  showWindow(obj, scope) {
    let state  = scope.state;
    let elementsCount = Object.keys(state.formEdit.elements).length;
    let result = obj.json();


    //set state formData
    state.formData = result;
    //set elements form
    scope.renderForm(elementsCount);

    //set values for form from table
    state.formEdit.setValues(scope.getRecord());

    scope.bindCollection(result);
    //scope.bindColumnCollection(result);
    //scope.showParts(state.tableRecord);
    // in bindCollection show window after load all records
    state.win.show();
  }



  getRecord() {
    let state  = this.state;
    if (state.isUpdate) {
      return state.tableRecord;
    }
    return {
      C: formatDate(new Date()),
      D: formatDate(webix.Date.add(new Date(),21,"day",true)),
      index: 1,
      B: 6,
      G: 0,
      AE: formatDateStandart(webix.Date.add(new Date(),14,"day",true)),
      R: ''

    }
  }


  renderForm(elementsCount) {
    let state  = this.state;
    //render first time
    if (elementsCount === 0 ) {
      state.formConfig = state.formData.data.configForm;
      webix.ui(
        state.formConfig,
        state.formEdit
      );
      //this.attachFormParamsElements();

      //atach events for first render
      this.attachFormEvents();
    }
  }

  bindCollection(result) {
    let state = this.state;
    let api = this.apiRest;
    let loadedCount = 0;
    let collections = result.data.dataCollections;
    let collectionsCount = Object.keys(collections).length;
    let params = {"per-page": -1};
    for (let elementId in collections) {
      //find element by id and get his options
      let list = $$(elementId).getPopup().getList();
      //get data by url collection
      let nameField = (collections[elementId].field) ? collections[elementId].field : 'name';
      let dataCollection = api.getCollection(collections[elementId].url, params, nameField);

      dataCollection.waitData.then(function() {
        loadedCount++;
        if (loadedCount === collectionsCount) {
          state.win.show();
        }
      });
      //set data collection
      list.sync(dataCollection);
    }
  }

  bindColumnCollection(result) {
    let scope = this;
    let api = this.apiRest;
    let params = {"per-page": -1};
    let columnCollection = result.data.columnCollections;
    for (let tableLocalId in columnCollection) {
      let columns = columnCollection[tableLocalId];
      for (let columnId in columns) {
        scope.$$(tableLocalId).getColumnConfig(columnId).options = api.getCollection(
          columns[columnId].url, params
        );
      }
      scope.$$(tableLocalId).refreshColumns();
    }
  }

  attachFormEvents() {
    let scope = this;
    let state = this.state;
    let btnSave = this.$$("btn_save");
    let btnCopy = this.$$("btn_copy");
    let comboContragentId = this.$$("contragent");
    let inputContragentName = this.$$("form_F");

    let comboProductId = this.$$("product");
    let inputProductName = this.$$("form_product_name");

    let comboProductSizeId = this.$$("product_size");
    let inputProductSizeName = this.$$("form_size_name");


    let comboClothId = this.$$("cloth");
    let inputClothName = this.$$("form_cloth_name");

    let comboKarkasId = this.$$("karkas");
    let inputProductSizeKarkasName = this.$$("size_karkas_name");

    let comboFootId = this.$$("foot");
    let inputFootName = this.$$("form_foot_name");

    let comboButtonId = this.$$("button");
    let inputButtonName = this.$$("form_button_name");

    let comboBottomId = this.$$("bottom");
    let inputBottomName = this.$$("form_bottom_name");

    let comboOtstrochkaId = this.$$("otstrochka");
    let inputOtstrochkaName = this.$$("form_otstrochka_name");

    let comboProductTypeId = this.$$("product_type");

    btnSave.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave();
    });
    btnCopy.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave(true);
    });

    // comboProductId.getPopup().getList().bind(comboProductTypeId.getPopup().getList(), function(obj, filter){
    //   //debugger;
    //   return obj.type_id == filter.id; //note is the list data obj (table name on the server side)
    // });
    let api = this.apiRest;
    let params = {"per-page": -1};

    comboProductTypeId.attachEvent("onChange", function(newValue) {
      comboProductId.setValue();
      let dataCollection = api.getCollection('accounting/product-beds', params);
      dataCollection.filter(function(obj) {
        return obj.type_id == newValue;
      });

      comboProductId.getPopup().getList().sync(dataCollection);

    });

    comboContragentId.attachEvent("onChange", function(newValue) {
      inputContragentName.setValue(comboContragentId.getText());
      scope.setPrice();
    });
    comboProductId.attachEvent("onChange", function(newValue) {
      inputProductName.setValue(comboProductId.getText()+' '+comboProductSizeId.getText());
      scope.setPrice();
    });
    comboProductSizeId.attachEvent("onChange", function(newValue) {
      inputProductSizeName.setValue(comboProductSizeId.getText());
      inputProductName.setValue(comboProductId.getText()+' '+comboProductSizeId.getText());
      scope.setPrice();
    });
    comboClothId.attachEvent("onChange", function(newValue) {
      inputClothName.setValue(comboClothId.getText());
      scope.setPrice();
    });
    comboFootId.attachEvent("onChange", function(newValue) {
      inputFootName.setValue(comboFootId.getText());
      scope.setPrice();
    });
    comboButtonId.attachEvent("onChange", function(newValue) {
      inputButtonName.setValue(comboButtonId.getValue());
      scope.setPrice();
    });

    comboBottomId.attachEvent("onChange", function(newValue) {
      inputBottomName.setValue(comboBottomId.getText());
      scope.setPrice();
    });

    comboOtstrochkaId.attachEvent("onChange", function(newValue) {
      inputOtstrochkaName.setValue(comboOtstrochkaId.getText());
      scope.setPrice();
    });

    comboKarkasId.attachEvent("onChange", function(newValue) {
      if (newValue == 'без каркаса') {
        inputProductSizeKarkasName.setValue('');
      }
      if (newValue == 'стандарт') {
        inputProductSizeKarkasName.setValue(comboProductSizeId.getText());
      }
      if (newValue == 'подиум') {
        inputProductSizeKarkasName.setValue(comboProductSizeId.getText());
      }
      if (newValue == 'люкс') {
        inputProductSizeKarkasName.setValue(comboProductSizeId.getText()+' '+newValue);
      }
      scope.setPrice();

    });



  }

  setPrice() {
    let inputPrice = this.$$("form_price");
    inputPrice.setValue(this.getPrice());
  }
  getPrice() {
    let comboProductId = this.$$("product");
    let comboProductSizeId = this.$$("product_size");
    let comboClothId = this.$$("cloth");
    let comboKarkasId = this.$$("karkas");
    let comboFootId = this.$$("foot");
    let comboButtonId = this.$$("button");
    let comboBottomId = this.$$("bottom");
    let comboOtstrochkaId = this.$$("otstrochka");
    let product, cloth, price =0, index = '', indexMore7 = 0, size;

    if (comboProductId.getValue()!=0 && comboProductSizeId.getValue()!=0 && comboClothId.getValue()!=0) {
      product = comboProductId.getList().getItem(comboProductId.getValue());
      cloth = comboClothId.getList().getItem(comboClothId.getValue());
      size = comboProductSizeId.getList().getItem(comboProductSizeId.getValue());
      index = cloth.category;
      if (index > 7) {
        indexMore7 = index-7;
      }
      index = (index == 0) ? index = 'price' : 'price_'+index;
      price = parseInt(product[index]);
      if (indexMore7 > 0) {
        price= price + (parseInt(product['price_7']) - parseInt(product['price_6']))*parseInt(indexMore7);
      }

      if (size.name === '180х200') {
        price = price * 1.13;
      }
      if (size.name === '200х200') {
        price = price * 1.35;
      }
      if (size.name === '140х200') {
        price = price - 220;
      }
      if (size.name === '120х200') {
        price = price - 430;
      }
      if (size.name === '90х200') {
        price = price - 600;
      }
    }
    return Math.round(price);
  }

  attachClickEvents() {
    let scope = this;
    webix.attachEvent("onClick", function(element, b, c) {
      // if (!element.target) {
      //   return;
      // }

      //debugger;
      //if (element.target.classList.value === "btn-save") {
      //  scope.onClickSave();
      //}

    });
  }


  doClickSave(copy = false) {

    let state = this.state;
    if (!state.formEdit.validate()) return;

    let record = state.formEdit.getValues();
    if (copy) {
      state.isUpdate = false;
      record.id = '';
    }
    //debugger;
    webix.dp(state.table).save(
      (state.isUpdate) ? record.id : webix.uid(),
      (state.isUpdate) ? "update" : "insert",
      record
    ).then(function(obj){
      webix.dp(state.table).ignore(function(){

        (state.isUpdate) ? state.table.updateItem(record.id, obj) : state.table.add(obj,0);

        state.table.select(obj.id);

        if (!state.isUpdate)  { state.table.scrollTo(0, 0) };

        //state.table.sort("name", "asc", "string");
        //state.table.markSorting("name", "asc");

      });

      state.table.refresh();
      state.win.hide();
    }, function(){
      webix.message("Ошибка! Данные не сохранены!");
    });
  }


}


