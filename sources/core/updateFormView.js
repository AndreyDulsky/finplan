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

export default class UpdateFormView extends JetView {
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
              state.left = 52;
              state.top = 41;
              state.width = state.maxWidth / 3;
              state.height = state.maxHeight - 41;
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
    state.tableId = table.config.id;
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

    //scope.bindCollection(result);
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
      date_operation: new Date(),
      is_committed : 1,
      type_operation: 2
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
      let dataCollection = api.getCollection(collections[elementId].url, params);

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

    btnSave.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave();
    });

  }


  attachClickEvents() {
    let scope = this;
    webix.attachEvent("onClick", function(element, b, c) {
      if (!element.target) {
        return;
      }

      //debugger;
      //if (element.target.classList.value === "btn-save") {
      //  scope.onClickSave();
      //}

    });
  }


  doClickSave() {

    let state = this.state;
    if (!state.formEdit.validate()) return;

    let record = state.formEdit.getValues();


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


