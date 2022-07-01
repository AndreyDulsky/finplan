import {JetView} from "webix-jet";
import {FormClassState} from "core/service/FormClassState";



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

export default class formFilterView extends JetView {
  constructor(app, name){
    super(app,name);
    this.state = new FormClassState(this);
  }


  config() {
    this.apiRest = this.app.config.apiRest;
    this.win = {};

    return {
      rows: [
        {
          localId: "filterForm",
          view: 'form',
          scroll : "auto",
          //autoheight: true,
          elements: [{
            view:"button", click:() =>
              this.app.callEvent("save:form")
          }]//this.state.formConfig
        }
      ]
    }
  }

  init(view, url) {
    //this.initForm();
    //this.attachClickEvents();

  }

  initForm() {

    let scope = this;
    let state  = this.state;
    let api = this.apiRest;

    state.tableId = 'transaction-schema';//table.config.urlEdit;
    let prefix = 'accounting/';


    //state.table = table;
    state.formEdit = this.$$('filterForm');
    state.formUrl = prefix+state.tableId+"/form";

    state.formEdit.clearValidation();
    //get config elements for form and urls collection;
    let data, url, result;

    api.get(state.formUrl).then(function(data) {
      scope.getForm(data, scope);
    });


    //return result;
  }

  getForm(obj, scope) {

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

    //set values for form from table
    //state.formEdit.setValues(scope.getRecord());

    scope.bindCollection(result);
    //scope.bindColumnCollection(result);
    //scope.showParts(state.tableRecord);
    // in bindCollection show window after load all records
  }


  renderForm(elementsCount) {

    let state  = this.state;
    //render first time
    //if (elementsCount === 0 ) {
    if (state.formData.data.configForm != false) {
      state.formConfig = state.formData.data.configForm;
      webix.ui(
        state.formConfig,
        state.formEdit
      );
      debugger;
      //this.attachFormParamsElements();
      //if (elementsCount === 0 ) {
      //atach events for first render
      this.attachFormEvents();
      //}
    }

  }

  bindCollection(result) {

    let state = this.state;
    let scope = this;
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
        list.sync(dataCollection);
        if (loadedCount === collectionsCount) {

          //state.formEdit.setValues(scope.getRecord());
          state.formEdit.enable();
          state.formEdit.hideProgress();
        }
      });
      //set data collection
    }
    if (collectionsCount == 0 ) {
      //state.formEdit.setValues(scope.getRecord());
      state.formEdit.enable();
      state.formEdit.hideProgress();
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

    btnSave.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave();
    });
    btnCopy.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave(true);
    });

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
      record.flag_copy = record.id;
      record.id = '';
    }
    if (record['action-edit']!= 'undefined') delete record['action-edit'];
    if (record['action-view']!= 'undefined') delete record['action-view'];
    if (record['action-delete']!= 'undefined') delete record['action-delete'];


    if (this.state.table.$scope.getParam('id')) {
      record['list_id'] = this.state.table.$scope.getParam('id');
    }
    if (this.state.table.listId) {
      record['list_id'] = this.state.table.listId;
    }
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


