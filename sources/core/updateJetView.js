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

export default class UpdateJetView extends JetView {
  constructor(app, name){
    super(app,name);
    if (!this.state) {
      this.state = new CoreEditClass(this);
    }
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
              state.width = state.maxWidth / 3;
              state.height = state.maxHeight - 34;
          },
          head: "Редактирование операции",
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
    scope.bindColumnCollection(result);
    scope.showParts(state.tableRecord);
    // in bindCollection show window after load all records
    //state.win.show();
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

  attachFormParamsElements() {
    let state = this.state;
    let tablePartValue = this.$$("table_part_value");

    tablePartValue.scheme_setter({
      $init:function(obj){ obj.index = this.count()+1; }
    });

    state.table.scheme_setter({
      $init: function(obj) {
        //obj.account = obj.account.name;
        //obj.contragent = obj.contragent.name;
        //obj.category = obj.category.name;
        //obj.project = obj.project.name;
      },
      $update: function(obj) {
        //obj.account = obj.account.name;
        //obj.contragent = obj.contragent.name;
        //obj.category = obj.category.name;
        //obj.project = obj.project.name;
      }
    });

  }

  renderForm(elementsCount) {
    let state  = this.state;

    //render first time
    //if (elementsCount === 0 ) {
      state.formConfig = state.formData.data.configForm;
      webix.ui(
        state.formConfig,
        state.formEdit
      );
      this.attachFormParamsElements();

      //atach events for first render
      this.attachFormEvents();
    //}
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
    let typeOperation = state.formEdit.elements["type_operation"];
    let comboValueBreak = this.$$("combo_value_break");
    let tablePartValue = this.$$("table_part_value");
    let btnSave = this.$$("btn_save");
    let formEditSum = $$("form_edit_sum");


    //change type_operation
    typeOperation.attachEvent("onChange", function(newValue, oldValue) {
      scope.typeOperationChange(newValue);
    });

    comboValueBreak.attachEvent("onChange", function(newValue) {
      scope.comboValueBreakChange(newValue);
    });

    btnSave.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave();
    });

    tablePartValue.attachEvent("onItemClick", function(id, e, trg) {
      if (id.column === 'action-delete-part') {
        this.remove(id.row);
      }
    });

    formEditSum.attachEvent("onChange", function(id, e, trg) {

      if (tablePartValue.data.count() === 1) {
        tablePartValue.getItem(tablePartValue.getIdByIndex(0)).value = id;
      }
      tablePartValue.refreshColumns();
    });
  }

  typeOperationChange(newValue) {
    let state = this.state;
    let scope = this;
    let labelMoveFrom = scope.$$("label_move_from");
    let labelMoveTo = scope.$$("label_move_to");
    let labelValueBreak = scope.$$("label_value_break");
    let accountMoveId = state.formEdit.elements["account_move_id"];
    let contragentId = state.formEdit.elements["contragent_id"];
    let categoryId = state.formEdit.elements["category_id"];
    let comboValueBreak = this.$$("combo_value_break");
    let showMove = (newValue == TYPE_OPERATION_MOVE);
    let logicShow = [
      {"element" : labelMoveFrom, "status" : showMove},
      {"element" : labelMoveTo, "status" : showMove},
      {"element" : accountMoveId, "status" : showMove},
      {"element" : labelValueBreak, "status" : !showMove},
      {"element" : contragentId, "status" : !showMove},
      {"element" : categoryId, "status" : !showMove}
    ];
    if (showMove) {
      //call comboValueBreakChange
      comboValueBreak.setValue(TYPE_TABLE_PART_DEFAULT);
    }
    for (let key in logicShow) {
      (logicShow[key]["status"])
        ? logicShow[key]["element"].show() : logicShow[key]["element"].hide()
    }

  }

  comboValueBreakChange(newValue) {
    let state = this.state;
    let tablePartValue = this.$$("table_part_value");
    let comboValueBreak = this.$$("combo_value_break");
    let layoutPartValue = this.$$("layout_part_value");
    let contragentId = state.formEdit.elements["contragent_id"];
    let categoryId = state.formEdit.elements["category_id"];
    let projectId = state.formEdit.elements["project_id"];
    let show = (newValue > TYPE_TABLE_PART_DEFAULT);
    let partCategory =  (newValue == TYPE_TABLE_PART_CATEGORY);
    let partProject =  (newValue == TYPE_TABLE_PART_PROJECT);
    let logicShow = [
      {"element" : layoutPartValue, "status" : show},
      {"element" : comboValueBreak, "status" : show},
      {"element" : contragentId, "status" : !show},
      {"element" : categoryId, "status" : !partCategory},
      {"element" : projectId, "status" : !partProject},
    ];
    if (partCategory) {
      categoryId.setValue("");
    }
    if (partProject) {
      projectId.setValue("");
    }
    contragentId.setValue("");

    tablePartValue.showColumnBatch(newValue);

    for (let key in logicShow) {
      (logicShow[key]["status"])
        ? logicShow[key]["element"].show() : logicShow[key]["element"].hide()
    }

    if (!show) {
      tablePartValue.clearAll();
    }
  }

  attachClickEvents() {
    let scope = this;
    webix.attachEvent("onClick", function(element, b, c) {

      if (!element.target) {
        return;
      }
      if (element.target.classList.value === "show-combo-value-break") {
        scope.onClickShowComboValueBreak();
      }
      //debugger;
      //if (element.target.classList.value === "btn-save") {
      //  scope.onClickSave();
      //}

      if (element.target.classList.value === "add-to-table") {
        let table = scope.$$("table_part_value");
        table.add({"index":"","contragent_id" : "", "category_id" : "", "project_id" : "", "value" : "0.00", "part_procent":"" });
      }
    });
  }

  onClickShowComboValueBreak() {
    let combo = this.$$("combo_value_break");
    if (combo.isVisible()) {
      this.$$("combo_value_break").hide();
    } else {
      this.$$("combo_value_break").show();
    }
  }

  showParts(selectedItem) {
    let state = this.state;
    let tableParts = this.$$("table_part_value");
    tableParts.clearAll();
    if (!selectedItem) {
      return;
    }
    let branches = state.table.data.getBranch(selectedItem.id);
    for (let key in branches) {
      tableParts.add(branches[key]);
    }
  }

  doClickSave() {
    let state = this.state;

    if (!state.formEdit.validate()) return;

    let record = state.formEdit.getValues();


    if (record['$count']!= 'undefined') delete record['$count'];
    if (record['$level']!= 'undefined') delete record['$level'];
    if (record['$parent']!= 'undefined') delete record['$parent'];
    if (record['action-edit']!= 'undefined') delete record['action-edit'];
    if (record['action-view']!= 'undefined') delete record['action-view'];
    if (record['action-delete']!= 'undefined') delete record['action-delete'];



    record.account = { name: this.$$("account").getText() };

    //record.contragent = { name: this.$$("account").getText() };
    //record.category = { name: this.$$("account").getText() };
    //record.project = { name: this.$$("account").getText() };
    let parts = this.getParts();
    if (parts.length == 0 ) {
      //this.doSave(record);
    }
    let changes = [];
    if (record.type_part_id == 2) {
      changes = ["category_id", "project_id"];
    }
    if (record.type_part_id == 3) {
      changes = ["project_id"];
    }

    for (let key in parts) {
      for (let keyPart in parts[key]) {

        if (changes.indexOf(keyPart) != -1) {
          parts[key][keyPart] = record[keyPart];
        }
      }
      if (parts[key]['$count']!= 'undefined') delete parts[key]['$count'];
      if (parts[key]['$level']!= 'undefined') delete parts[key]['$level'];
      if (parts[key]['$parent']!= 'undefined') delete parts[key]['$parent'];
      if (parts[key]['$part_procent']!= 'undefined') delete parts[key]['$part_procent'];

    }

    record.data = parts;

    webix.dp(state.table).save(
      (state.isUpdate) ? record.id : webix.uid(),
      (state.isUpdate) ? "update" : "insert",
      record
    ).then(function(obj){

      webix.dp(state.table).ignore(function(){

        (state.isUpdate) ? state.table.updateItem(record.id, obj) : state.table.add(obj,0);
        //state.table.group("transaction_id");

        if (obj && obj.id) state.table.select(obj.id);
        let parentId =  state.table.getSelectedId();

        if (obj.data.length > 1 ) {
          for (let key in obj.data) {
            (state.isUpdate) ? state.table.updateItem(record.data[key].id, obj.data[key]) : state.table.add(obj.data[key],0, parentId);
          }
        }
        if (!state.isUpdate)  { state.table.scrollTo(0, 0) };

        state.table.sort("date_operation", "desc", "string");
        state.table.markSorting("date_operation", "desc");

      });

      state.table.refresh();
      state.win.hide();
    }, function(){
      webix.message("Ошибка! Данные не сохранены!");
    });
  }



  getParts() {
    let tableParts = this.$$("table_part_value");
    let records = tableParts.serialize();
    let parts = [];
    for (let key in records) {
      parts.push(records[key]);
    }
    return parts;
  }


}


