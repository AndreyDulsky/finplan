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

export default class UpdateFireJetView extends JetView {
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
          head: "Редактирование операции",
          close: true,
          modal: true,
          body: {
            localId: "formEdit",
            view: 'form',
            scroll : "auto",
            elements: [
              {
                "margin": 10,
                "rows": [{"view": "text", "name": "id", "width": 150, "hidden": true}, {
                  "view": "segmented",
                  "name": "type_transaction",
                  "value": 1,
                  "inputWidth": 320,
                  "options": [{"id": 1, "value": "Поступление"}, {"id": 2, "value": "Расход"}, {
                    "id": 3,
                    "value": "Перемещение"
                  }],
                  "align": "center"
                }, {
                  "localId": "label_move_from",
                  "label": "Откуда",
                  "view": "label",
                  "height": 38,
                  "css": {"text-align": "center"},
                  "hidden": true
                }, {
                  "cols": [{
                    "label": "Дата оплаты",
                    "value": "",
                    "view": "datepicker",
                    "labelWidth": 100,
                    "name": "date_transaction",
                    "timepicker": true,
                    "stringResult": true
                  }, {
                    "name": "is_committed",
                    "view": "checkbox",
                    "width": 40,
                    "value": true,
                    "checkValue": 1,
                    "uncheckValue": 2
                  }, {"label": "Подтвердить оплату", "view": "label"}]
                }, {
                  "label": "Счет",
                  "name": "account_id",
                  "id": "account",
                  "value": "",
                  "suggest": "firestore->accounting_account",
                  "placeholder": "Выберите счет",
                  "view": "combo",
                  "height": 38,
                  "labelWidth": 100,
                  "required": true,
                  "invalidMessage": "Значение не может быть пустым!"
                }, {
                  "cols": [{
                    "id": "form_edit_sum",
                    "name": "value",
                    "label": "Сумма",
                    "view": "text",
                    "labelWidth": 100,
                    "height": 36,
                    "value": 0,
                    "placeholder": "0.00",
                    "format": "1 111.00",
                    "invalidMessage": "Field can not be empty",
                    "required": true
                  }, {"label": "UAH (Украинская гривна)", "view": "label", "height": 36}]
                }, {
                  "localId": "label_value_break",
                  "template": "<a class='show-combo-value-break' href='javascript:void(0);'>Разбить сумму</a>",
                  "height": 20,
                  "css": {"padding-left": "100px", "margin-top": "0px !important"},
                  "hidden": false
                }, {
                  "hidden": true,
                  "name": "type_part_id",
                  "localId": "combo_value_break",
                  "value": "",
                  "options": [{"id": 1, "value": "Выберите как разбить сумму"}, {"id": 2, "value": "Контрагент"}, {
                    "id": 3,
                    "value": "Статья"
                  }, {"id": 4, "value": "Проект"}, {"id": 5, "value": "Контрагент, Статья"}],
                  "placeholder": "Выберите как разбить сумму",
                  "view": "combo",
                  "height": 38,
                  "css": {"padding-left": "100px", "margin-top": "0px !important"},
                  "width": 230
                }, {
                  "localId": "layout_part_value",
                  "padding": 30,
                  "css": {"background": "#f7fafb"},
                  "hidden": true,
                  "rows": [{
                    "localId": "table_part_value",
                    "id": "table_part",
                    "view": "datatable",
                    "css": "webix_header_border webix_data_border",
                    "columns": [{"id": "id", "header": "", "hidden": true}, {
                      "id": "index",
                      "header": "#",
                      "width": 20
                    }, {
                      "id": "contragent_id",
                      "options": "firestore->accounting_contragent",
                      "editor": "combo",
                      "header": "Контрагент",
                      "fillspace": true,
                      "footer": {"text": "Итого", "css": {"text-align": "right"}}
                    }, {
                      "id": "category_id",
                      "editor": "combo",
                      "header": "Статья",
                      "options": "firestore->accounting_category",
                      "adjust": true,
                      "hidden": true,
                      "batch": 3
                    }, {
                      "id": "project_id",
                      "editor": "combo",
                      "header": "Проект",
                      "options": "firestore->accounting_project",
                      "adjust": true,
                      "hidden": true,
                      "batch": 4
                    }, {
                      "id": "value",
                      "editor": "text",
                      "header": "Сумма",
                      "width": 100,
                      "sort": "int",
                      "css": {"text-align": "right"},
                      "footer": {"content": "summColumn", "css": {"text-align": "right"}}
                    }, {
                      "id": "part_procent",
                      "header": "Доля,%",
                      "width": 70,
                      "css": {"text-align": "right"},
                      "math": "procent($r, \"form_edit_sum\")",
                      "footer": {"content": "summColumn", "css": {"text-align": "right"}, "template": "#value#%"},
                      "template": "#part_procent#%"
                    }, {"id": "action-delete-part", "header": "", "width": 40, "template": "{common.trashIcon()}"}],
                    "editable": true,
                    "headerRowHeight": 30,
                    "rowHeight": 30,
                    "scroll": false,
                    "width": 300,
                    "autoheight": true,
                    "math": true,
                    "footer": true
                  }, {
                    "cols": [{
                      "borderless": true,
                      "localId": "label_add_row_table",
                      "template": "<a class='add-to-table' href='javascript:void(0);'>Добавить</a>",
                      "height": 20,
                      "css": {"background": "#f7fafb"},
                      "hidden": false
                    }]
                  }]
                }, {
                  "label": "Контрагент",
                  "name": "contragent_id",
                  "id": "contragent",
                  "value": "1",
                  "options": "firestore->accounting_contragent",
                  "view": "combo",
                  "height": 38,
                  "labelWidth": 100,
                  "placeholder": "Выберите контрагента"
                }, {
                  "label": "Статья",
                  "name": "category_id",
                  "id": "category",
                  "value": "1",
                  "options": "firestore->accounting_category",
                  "view": "combo",
                  "height": 38,
                  "labelWidth": 100,
                  "placeholder": "Выберите статью"
                }, {
                  "localId": "label_move_to",
                  "label": "Куда",
                  "view": "label",
                  "height": 38,
                  "css": {"text-align": "center"},
                  "hidden": true
                }, {
                  "label": "Счет",
                  "name": "account_move_id",
                  "id": "account_move",
                  "value": "",
                  "options": "firestore->accounting_account",
                  "placeholder": "Выберите счет",
                  "view": "combo",
                  "height": 38,
                  "labelWidth": 100,
                  "hidden": true,
                  "required": true,
                  "invalidMessage": "Значение не может быть пустым!"
                }, {
                  "label": "Проект",
                  "name": "project_id",
                  "id": "project",
                  "value": "1",
                  "options": "firestore->accounting_project",
                  "view": "combo",
                  "height": 38,
                  "labelWidth": 100,
                  "placeholder": "Выберите проект"
                }, {
                  "name": "comment",
                  "label": "Назначение платежа",
                  "view": "text",
                  "height": 52,
                  "labelWidth": 100,
                  "placeholder": "Введите комментарий"
                }]
              }, {
                "margin": 10,
                "cols": [{"view": "template", "template": " ", "role": "placeholder", "borderless": true}, {
                  "view": "button",
                  "label": "Отмена",
                  "localId": "btn_cancel",
                  "css": "webix_transparent",
                  "align": "right",
                  "width": 120
                }, {
                  "view": "button",
                  "localId": "btn_save",
                  "css": "webix_primary",
                  "label": "Сохранить",
                  "align": "right",
                  "width": 120
                }]
              }
            ]
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

    //state.formEdit.id = scope.getRecord().key;

    //scope.bindCollection(result);
    state.win.show();
    //scope.bindColumnCollection(result);
    scope.showParts(state.tableRecord);
    // in bindCollection show window after load all records

  }



  getRecord() {
    let state  = this.state;
    if (state.isUpdate) {
      return state.tableRecord;
    }
    return {
      date_transaction: new Date(),
      is_committed : 1,
      type_transaction: 2
    }
  }

  attachFormParamsElements() {
    let state = this.state;
    let tablePartValue = this.$$("table_part_value");

    tablePartValue.scheme_setter({
      $init:function(obj){ obj.index = this.count()+1; }
    });

    // state.table.scheme_setter({
    //   $init: function(obj) {
    //     obj.account = obj.account.name;
    //     obj.contragent = obj.contragent.name;
    //     obj.category = obj.category.name;
    //     obj.project = obj.project.name;
    //   },
    //   $update: function(obj) {
    //     obj.account = obj.account.name;
    //     obj.contragent = obj.contragent.name;
    //     obj.category = obj.category.name;
    //     obj.project = obj.project.name;
    //   }
    // });

  }

  renderForm(elementsCount) {
    let state  = this.state;

    //render first time
    //if (elementsCount === 0 ) {
      //state.formConfig = state.formData.data.configForm;
      /*webix.ui(
        state.formConfig,
        state.formEdit
      );*/
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
    let typeOperation = state.formEdit.elements["type_transaction"];
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
    for (let key in logicShow) {
      (logicShow[key]["status"])
        ? logicShow[key]["element"].show() : logicShow[key]["element"].hide()
    }
    if (showMove) {
      //call comboValueBreakChange
      comboValueBreak.setValue(TYPE_TABLE_PART_DEFAULT);
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

      if (element.target.classList.value === "btn-save") {
        scope.onClickSave();
      }

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
    //debugger;
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
    if (record['account_id']) {
      record['account'] = state.formEdit.elements['account_id'].getPopup().getList().getItem(record['account_id']);
    } else { record['account'] = {id:"", value:""} }

    if (record['contragent_id']) {
      record['contragent'] = state.formEdit.elements['contragent_id'].getPopup().getList().getItem(record['contragent_id'] );
    } else { record['contragent'] = {id:"", value:""} }
    if (record['category_id']) {
      record['category'] = state.formEdit.elements['category_id'].getPopup().getList().getItem(record['category_id']) ;
    } else { record['category'] = {id:"", value:""} }
    if (record['project_id']) {
      record['project'] = state.formEdit.elements['project_id'].getPopup().getList().getItem(record['project_id']);
    } else { record['project'] = {id:"", value:""} }
    if (record['account_move_id']) {
      record['account_move'] = state.formEdit.elements['account_move_id'].getPopup().getList().getItem(record['account_move_id']);
    } else { record['account_move'] = {id:"", value:""} }


    record.data = this.getParts();

    webix.dp(state.table).save(
      (state.isUpdate) ? record.id : webix.uid(),
      (state.isUpdate) ? "update" : "insert",
      record
    ).then(function(obj){
      webix.dp(state.table).ignore(function(){
        //record.id = obj.id;
        //debugger;
        (state.isUpdate) ? state.table.updateItem(record.id, obj) : state.table.add(obj,0);
        state.table.select(record.id);
        state.table.scrollTo(0, 0);
        state.table.sort("date_transaction", "desc", "string");
        state.table.markSorting("date_transaction", "desc");
      });
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


