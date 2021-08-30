import {JetView} from "webix-jet";
import {CoreEditClass} from "core/CoreEditClass";
import DocumentSalaryAccrualView from "views/document-salary-accrual/index";
import DocumentSalaryAccrualTable from  "views/document-salary-accrual/table";

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
    let scope = this;

    return this.win;
  }

  init(view, url) {

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
    state.win = {};
    let documentView = new DocumentSalaryAccrualView(this.app,'document-salary-accrual',record);
    state.win = this.ui({
      localId: "winEdit",
      //id: "winEdit",
      view: "window",
      move:true,
      //width: 1400,
      resize: true,
      height: 500,
      //fullscreen: true,
      position: 'center',

      head:{
        cols:[
          {template:"Начисление зарплаты", type:"header", borderless:true},
          {view:"icon", icon:"mdi mdi-fullscreen", tooltip:"enable fullscreen mode", click: function(obj, obj1){

            if(state.win.config.fullscreen) {
              webix.fullscreen.exit();
              this.define({icon:"mdi mdi-fullscreen", tooltip:"Enable fullscreen mode"});
            }
            else {
              webix.fullscreen.set(state.win);
              this.define({icon:"mdi mdi-fullscreen-exit", tooltip:"Disable fullscreen mode"});
            }
            this.refresh();
          }},
          {view:"icon", icon:"wxi-close", tooltip:"Close window", click: function(){
            state.win.close();
          }}
        ]
      },
      close: true,
      modal: true,
      body: {
        view: 'layout',
        "padding" : 10,
        "margin" : 10,
        rows:
        [{
          localId: "formEdit",
          view: 'form',
          //scroll : "true",
          width: 1400,
          elements: [
            {

              "margin" : 10,
              cols: [
                {
                  "id" : "form_edit_id",
                  "label": "ID",
                  "name":"id",
                  "localId" : "id",
                  "value": "",
                  "placeholder" : "ID",
                  "view": "text",
                  "height": 38,
                  "labelWidth": 50,
                  "width" : 150,
                  disabled: true,
                  invalidMessage:"Значение не может быть пустым!"
                },
                {
                  "id" : "form_edit_date_document",
                  "name":"date_document",
                  view:"datepicker",
                  localId: 'date_document',
                  //inputWidth:150,
                  label: 'Дата',
                  labelWidth:50,
                  width:180,
                  value: new Date(),
                  required: true,
                  invalidMessage:"Значение не может быть пустым!"
                },
                {
                  "id" : "form_edit_date_created",
                  "name":"date_created",
                  view:"datepicker",
                  localId: 'date_created',
                  //inputWidth:150,
                  label: 'Дата',
                  labelWidth:50,
                  width:180,
                  value: new Date(),
                  required: true,
                  invalidMessage:"Значение не может быть пустым!",
                  hidden: true
                },
                {
                  "id" : "form_edit_type_document",
                  "name":"type_document",
                  view:"text",
                  localId: 'type_document',
                  label: 'Тип документа',
                  labelWidth:50,
                  width:180,
                  value: '',
                  disabled: true,
                  format: '1 111,00',
                  invalidMessage:"Значение не может быть пустым!",
                  hidden: true
                },
                {
                  "id" : "form_edit_sum",
                  "name":"sum",
                  view:"text",
                  localId: 'sum',
                  label: 'Сумма',
                  labelWidth:50,
                  width:180,
                  value: '',
                  disabled: true,
                  format: '1 111,00',
                  invalidMessage:"Значение не может быть пустым!"
                }
              ]


            },
          ]
        },
        {
          view:"toolbar", paddingY:0,  elements:[
            { view:"icon", icon: 'mdi mdi-plus', autowidth:true, click: () =>  this.doClickAdd()},
            { view:"icon", icon: 'mdi mdi-refresh', autowidth:true, click: () =>  this.doClickFillAll()},
            { view:"icon", icon: 'mdi mdi-printer', autowidth:true, click: () =>  this.doClickPrint()},
            {},
          ]
        },
        documentView,
        {
          "margin": 10,
          "cols": [
            { "view": "template", "template": " ", "role": "placeholder", "borderless": true },
            { "view": "button", "label": "Печать", "css": "webix_transparent", "align": "right", "width": 120, click: () => this.doClickPrint() },
            { "view": "button", "label": "Отмена", "css": "webix_transparent", "align": "right", "width": 120, click: () => this.doClickCancel() },
            { "view": "button", "css": "webix_primary", "label": "Сохранить", "align": "right", "width": 120, click: () => this.doClickSave() }
          ]
        }
      ]}
    });


    //state.win.getBody().setValues(scope.getRecord());
    var res = webix.promise.defer();
    res.resolve(state.win.getBody()).then(function(result, res1) {

      let res2 = state.win.getBody().queryView({'localId':'document-salary-accrual-table'});

      res2.waitData.then(function(){
        //res2.openAll();
        res2.data.attachEvent("onDataUpdate", function(id, data, old){
          scope.setSumByTableRows()
        });
        res2.data.attachEvent("onAfterAdd", function(id, data, old){
          scope.setSumByTableRows()
        });
        res2.data.attachEvent("onAfterDelete", function(id){
          scope.setSumByTableRows()
        });
        res2.data.attachEvent("onItemClick", function(id){
          debugger;
        });
        // when we have data, do some actions
        scope.setSumByTableRows();
      });


    });

    // });
    state.win.show();

  }

  setSumByTableRows() {
    let state  = this.state;
    let scope = this;
    let res2 = state.win.getBody().queryView({'localId':'document-salary-accrual-table'});
    let sum = 0;
    res2.data.each(function(row){
      sum = sum + parseFloat(row.salary);
      console.log(row);
      console.log(sum);
    });
    state.tableRecord['sum'] = sum;
    let form = state.win.getBody().queryView({'localId':'formEdit'});
    form.setValues(scope.getRecord());
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

  doClickSave(copy = false) {
    this.doSaveTable();


    // if (copy) {
    //   state.isUpdate = false;
    //   record.id = '';
    // }
    // //debugger;
    // webix.dp(state.table).save(
    //   (state.isUpdate) ? record.id : webix.uid(),
    //   (state.isUpdate) ? "update" : "insert",
    //   record
    // ).then(function(obj){
    //   webix.dp(state.table).ignore(function(){
    //
    //     (state.isUpdate) ? state.table.updateItem(record.id, obj) : state.table.add(obj,0);
    //
    //     state.table.select(obj.id);
    //
    //     if (!state.isUpdate)  { state.table.scrollTo(0, 0) };
    //
    //     //state.table.sort("name", "asc", "string");
    //     //state.table.markSorting("name", "asc");
    //
    //   });
    //
    //   state.table.refresh();
    //   state.win.close();
    // }, function(){
    //   webix.message("Ошибка! Данные не сохранены!");
    // });
  }

  doSaveTable() {
    let scope =this;
    let isUpdate = true;

    let table = this.state.win.getBody().queryView({'localId':'document-salary-accrual-table'});
    let tableUrl = this.app.config.apiRest.getUrl("create","accounting/document-salary-accruals");
    let tableUrlUpdate = this.app.config.apiRest.getUrl("put","accounting/document-salary-accruals");
    let dateDocument = this.state.win.getBody().queryView({'localId':'date_document'}).getValue();
    let tableListUrl = this.app.config.apiRest.getUrl("create","accounting/list-salary-accruals");
    let rowList = {};
    let listId = (scope.state.tableRecord) ? scope.state.tableRecord.id : null;

    let state = this.state;
    state.formEdit = state.win.getBody().queryView({'localId':'formEdit'});
    if (!state.formEdit.validate()) return;
    //
    let record = state.formEdit.getValues();



    table.data.each(function(row){

      if (row.$group) return;
      for (var prop in row) {
        if (prop.indexOf('$') != -1) {
          delete row[prop];
        }
      }

      delete row['depends'];
      delete row['triggers'];


      row['date_document'] = dateDocument;

      if (!row['list_id']) {

        isUpdate = false;
        row['list_id'] = listId;
        delete row['id'];
        rowList = {
            'date_document' : dateDocument,
            'type_document' : 7,
            'sum' : 0
        };

        if (listId == null) {
          webix.ajax().post(tableListUrl, rowList).then(function (data) {
            let dataJson = data.json();
            listId = dataJson.id;
            row['list_id'] = listId;
            state.formEdit.setValues(dataJson);
            webix.ajax().post(tableUrl, row).then(function (data) {
              state.table.add(dataJson);
              state.table.updateItem(listId, dataJson);

            }).then(function() {
              state.win.close();
            });
          });
        } else {
          webix.ajax().post(tableUrl, row).then(function (data) {

          }).then(function() {
            state.win.close();
          });
        }


      } else {
        tableUrlUpdate = scope.app.config.apiRest.getUrl("put","accounting/document-salary-accruals", {},row.id);
        webix.ajax().sync().put(tableUrlUpdate, row);//.then(function(data){
        //   record = state.formEdit.getValues();
        //
        //   state.table.updateItem(record.id, record);
        // });


      }


    });
    record = state.formEdit.getValues();
    state.table.updateItem(record.id, record);
    state.win.close();
    //record = state.formEdit.getValues();
    //state.table.updateItem(listId, record);


  }



  doClickCancel() {
    let state = this.state;
    state.win.close();
  }

  doClickFillAll(employeeId = '') {
    let state = this.state;
    let table = this.state.win.getBody().queryView({'localId':'document-salary-accrual-table'});
    let formatDate = webix.Date.dateToStr("%Y-%m-%d");
    let dateDocument = state.win.getBody().queryView({'localId':'date_document'}).getValue();
    let params = {
      sort: 'employee_name',
      dateDocument: formatDate(dateDocument),
      filter1: '{"date_carpenter":{">=": "01.02.21", "<=":"28.02.21"}}',
      employee: "Василенко Роман"
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    };
    if (employeeId) {
      params['employee_id'] = employeeId;
    }
    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/employee-time-work/get-salary-by-days", params);
    let scope =this;
    webix.ajax().get(tableUrl).then(function(data){
      //table.clearAll();
      let dataJson = data.json().data;
      let dataEmployees = [];
      table.data.each(function(row){
        dataEmployees[row.employee_id] = row;
      });


      let row;
      for (var key in dataJson) {
        row = dataJson[key];
        delete row['id'];
        if (!dataEmployees[row['employee_id']]) {
          row.$css = 'webix_editing_cell';
          table.add(row);
          //table.addRowCss(dataEmployees[row.employee_id]['id'], "webix_invalid_cell");

        } else {
          if (employeeId!='') {
            let changes= [];
            for (var keyRow in row) {

              if (parseFloat(row[keyRow]) && Math.round(row[keyRow]) != Math.round(dataEmployees[row['employee_id']][keyRow])) {
                //console.log(Math.round(row[keyRow])+'='+Math.round(dataEmployees[row['employee_id']][keyRow]));
                changes.push(keyRow);
              }
            }
            table.updateItem(dataEmployees[row.employee_id]['id'], row);
            for (var keyChanges in changes) {
              table.addCellCss(dataEmployees[row.employee_id]['id'], changes[keyChanges], "webix_editing_cell");
            }
          }
        }
      }
      table.editCell(1, "employee_name", true, true);

    });
  }


  doClickPrint() {
    let table = this.state.win.getBody().queryView({'localId':'document-salary-accrual-table'});

    webix.print(table, {mode:"landscape", fit:"data"});
  }


}


