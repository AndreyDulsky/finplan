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
              state.top = 34;
              state.width = state.maxWidth / 3+70;
              state.height = state.maxHeight - 42;
          },
          head: "Редактирование",
          close: true,
          modal: true,
          body: {
            localId: "formEdit",
            view: 'form',
            scroll : "y",
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

    //loading
    state.formEdit.clear();
    webix.extend(state.formEdit, webix.ProgressBar);
    state.formEdit.disable();
    state.formEdit.showProgress({
      type:"icon",
      hide: false
    });
    scope.bindCollection(result);
    //set values for form from table

    // state.formEdit.setValues(scope.getRecord());


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
    let scope = this;
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
        if (collections[elementId].params) {
          if (collections[elementId].params.filter) {
            let filters= collections[elementId].params.filter;

            for (let filterId in filters) {

              let dataFilter = new webix.DataCollection({ data: dataCollection.data });
              dataFilter.filter(function(obj) {
                return obj[filterId] == filters[filterId];
              });

              list.sync(dataFilter);
            }
          }
        } else {
          list.sync(dataCollection);
        }


        if (loadedCount === collectionsCount) {

          state.formEdit.setValues(scope.getRecord());
          state.formEdit.enable();
          state.formEdit.hideProgress();

        }
      });
      //set data collection
      //list.sync(dataCollection);
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
    let btnCancel = this.$$("btn_cancel");
    let btnCalculation = this.$$("btn_calculation");
    let comboContragentId = this.$$("contragent");
    let inputContragentName = this.$$("form_F");

    let comboProductId = this.$$("product");
    let inputProductName = this.$$("form_product_name");

    let comboProductSizeId = this.$$("product_size");
    let inputProductSizeName = this.$$("form_size_name");


    let comboClothId = this.$$("cloth");
    let inputClothName = this.$$("form_cloth_name");

    let comboKarkasId = this.$$("carcass_type");
    let inputProductSizeKarkasName = this.$$("carcass_type_name");

    let comboFootId = this.$$("leg");
    let inputFootName = this.$$("form_leg_name");

    let comboButtonId = this.$$("button");
    let inputButtonName = this.$$("form_button_name");

    let comboBottomId = this.$$("bottom");
    let inputBottomName = this.$$("form_bottom_name");

    let comboOtstrochkaId = this.$$("stitching");
    let inputOtstrochkaName = this.$$("form_stitching_name");

    let comboProductTypeId = this.$$("product_type");

    btnSave.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave();
    });
    btnCopy.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave(true);
    });
    btnCancel.attachEvent("onItemClick", function(newValue) {
      scope.state.win.hide();
    });

    btnCalculation.attachEvent("onItemClick", function(newValue) {
      scope.doClickCalculation(true);
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

    });
    comboProductId.attachEvent("onChange", function(newValue) {
      inputProductName.setValue(comboProductId.getText()+' '+comboProductSizeId.getText());
      scope.setPrice();
    });
    comboProductSizeId.attachEvent("onChange", function(newValue) {

      inputProductSizeName.setValue(comboProductSizeId.getText());
      inputProductName.setValue(comboProductId.getText()+' '+comboProductSizeId.getText());
      scope.changeSizeKarkasName(comboKarkasId.getText());
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
      inputButtonName.setValue(comboButtonId.getText());
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

      scope.changeSizeKarkasName(comboKarkasId.getText());
      scope.setPrice();

    });



  }

  changeSizeKarkasName(newValue) {
    let inputProductSizeKarkasName = this.$$("carcass_type_name");
    let comboProductSizeId = this.$$("product_size");
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
    } else {
      inputProductSizeKarkasName.setValue(comboProductSizeId.getText());
    }
  }



  attachClickEvents() {
    let scope = this;
    let api = this.apiRest;
    let state = this.state;
    webix.attachEvent("onClick", function(element, b, c) {
      // if (!element.target) {
      //   return;
      // }

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

  setPrice() {
    let api = this.apiRest;
    let state = this.state;
    let scope = this;
    let inputPrice = this.$$("form_price");
    let tableUrl = api.getUrl('get',"accounting/product-bed/get-price", {
      "per-page": "-1"
    });
    this.labelSetValue();
    //debugger;
    let valuesForm = state.formEdit.getValues();
    //debugger;
    if (valuesForm['product_id'] == '') return;
    if (valuesForm['cloth_id'] == '') return;
    if (valuesForm['size_id'] === '') return;
    if (valuesForm['leg_id'] === '') return;
    if (valuesForm['bottom_id'] === '') return;
    if (valuesForm['carcass_type_id'] === '') return;
    //if (valuesForm['stitching_id'] === '') return;
    //if (valuesForm['button_id'] === '') return;



    webix.ajax().get(tableUrl, valuesForm).then(function(data){
      let result = data.json();
      inputPrice.setValue(result['sum']);
      let res =0;
      for (let lebelId in result['rules']) {
        res = parseInt(result['rules'][lebelId]);
        if (res > 0 ) {
          res = '+' + result['rules'][lebelId];
          webix.html.removeCss(scope.$$(lebelId).$view,"red");
          webix.html.addCss(scope.$$(lebelId).$view, "green");
          scope.$$(lebelId).refresh();
        } else {
          webix.html.removeCss(scope.$$(lebelId).$view,"green");
          webix.html.addCss(scope.$$(lebelId).$view, "red");
          scope.$$(lebelId).refresh();
        }
        scope.$$(lebelId).setValue(res);

      }

    });
  }

  labelSetValue() {
    this.$$('leg_id').setValue('');
    this.$$('size').setValue('');
    this.$$('cloth_id').setValue('');
    this.$$('client_id').setValue('');
    this.$$("form_price").setValue(0);
  }

  doClickCalculation() {
    this.setPrice();
  }


}


