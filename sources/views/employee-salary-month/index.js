import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import {employees} from "models/employee/employees";
import {typeSalary} from "models/department/type-salary";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

let formatDateMonth = webix.Date.dateToStr("%Y %F");

export default class EmployeeSalaryMonthView extends JetView{

  config(){
    let scope = this;
    return {
      localId: "layout",
      type:"wide",
      cols:[
        {
          rows: [


            {
              "view": "toolbar",
              height: 40,
              paddingY:2,
              cols: [
                {
                  "view": "label",
                  "label": "Посещения",
                  "width": 150
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"icon",
                  icon:"mdi mdi-fullscreen",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set(this.$scope.$$("employee-salary-table"));
                  }
                },
              ]
            },
            {
              cols: [
                {width :5},
                {
                  view:"datepicker",
                  localId: 'dateFrom',
                  inputWidth:150,
                  label: 'с',
                  labelWidth:30,
                  width:160,
                  value: webix.Date.yearStart(new Date())
                },
                {
                  view:"datepicker",
                  localId: 'dateTo',
                  inputWidth:150,
                  label: 'по',
                  labelWidth:30,
                  width:160,
                  value: new Date()
                },
                {
                  view:"combo-close",
                  localId: 'employee-combo',
                  inputWidth:250,
                  label: 'по',
                  labelWidth:30,
                  width:280,
                  //name: 'employee_id',
                  suggest: {
                    body:{
                      data:employees,
                      template: webix.template("#value#")
                    }
                  }
                },
                {},
                {
                  view:"toggle",
                  type:"icon",
                  icon: 'mdi mdi-file-tree',
                  autowidth:true,
                  value :true,
                  click: function() { scope.doClickOpenAll() }

                },

              ]
            },

            {
              view: "treetable",
              localId: "employee-salary-table",
              urlEdit: 'employee-salary',
              //autoConfig: true,
              css:"webix_header_border webix_data_border",
              leftSplit:1,
              //rightSplit:2,
              select: 'cell',
              multiselect:true,
              blockselect:true,
              clipboard:"block",
              //areaselect:true,
              editable:true,
              editaction: "dblclick",
              resizeColumn: { headerOnly:true },

              hover:"myhover",
              columns:[
                { id:'employee_id', header:'Сотрудник',	width:240 , css: {"text-align": "left"},
                  template: function(obj, common) {
                    if (obj.$group) return common.treetable(obj, common) + obj.employee_name;
                    return common.treetable(obj, common)+formatDateMonth(obj.date_salary);
                  }
                },
                //{ id:'date_salary', header:'Месяц',	width:180 , css: {"text-align": "left"}, format: webix.Date.dateToStr("%Y %F")},
                { id:'is_piecework', header:'Тип зарплаты',	width:100 , css: {"text-align": "left"}, collection: typeSalary},
                { id:'is_taskmaster', header:'Бриг.',	width:50 , css: {"text-align": "right"}},
                { id:'rate', header:'Ставка',	width:100 , css: {"text-align": "right"}},
                { id:'status', header:'Статус',	width:100 , css: {"text-align": "right"}, collection: [{'id':'0',"value":'Уволен'},{'id':'1',"value":'Работает'}]},
                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": function(obj, common) {
                    return (!obj.$group) ? common.trashIcon() : '';
                  }
                },
                {
                  "id": "action-edit",
                  "header": "", "width": 50,
                  "template": function (obj, common) {
                    return (!obj.$group) ? common.editIcon() : '';
                  }
                }
              ],
              //url: this.app.config.apiRest.getUrl('get',"accounting/employee-salaries", {'sort':'name'}),//"api->accounting/contragents",
              save: "api->accounting/employee-salaries",
              // scheme: {
              //    $sort:{ by:"name", dir:"asc" },
              //  },
              scheme: {
                $group: {
                  by: 'employee_id',
                  map: {
                    'department_id': ['department_id'],
                    'department_name': ['department_name'],
                    'employee_id': ['employee_id'],
                    'employee_name': ['employee_name'],
                    'value' : ['index']
                  }
                },

                //$sort:{ by:"department_id", dir:"asc" },
              },
              ready:function(){
                this.openAll();
              },
              on:{
                "data->onStoreUpdated":function(){
                  // this.data.each(function(obj, i){
                  //   obj.index = i+1;
                  // })
                },
                onAfterEditStop:function(state, editor, ignoreUpdate){
                  var dtable = this;
                  if(state.value != state.old){
                    this.$scope.afterEditStop(state, editor, ignoreUpdate);
                  }
                },
                onItemClick:function(id, e, trg) {
                  if (id.column == 'action-delete') {
                    var table = this;
                    webix.confirm("Удалить запись?").then(function(result){
                      webix.dp(table).save(
                        id.row,
                        "delete"
                      ).then(function(obj){
                        webix.dp(table).ignore(function(){
                          table.remove(id.row);
                        });
                      }, function(){
                        webix.message("Ошибка! Запись не удалена!");
                      });
                    });
                  } else {
                    this.$scope.cashEdit.showForm(this);
                  }
                },
                onBeforeLoad:function(){
                  this.showOverlay("Loading...");
                },
                onAfterLoad:function(){
                  if (!this.count())
                    this.showOverlay("Sorry, there is no data");
                  else
                    this.hideOverlay();
                },
              }
            }
          ]
        },

      ]
    };
  }

  init(view){

    let form = this.$$("form-search");
    let table = this.$$("employee-salary-table");
    let employeeCombo = this.$$("employee-combo");
    let employeeId = employeeCombo.getValue();

    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());


    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/employee-salaries",
      { 'per-page' : -1,
        'sort': '[{"property":"employee_name","direction":"ASC"}, {"property":"date_salary","direction":"ASC"}]',
        'filter': '{"date_salary":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      }
    );
    let scope =this;
    table.load(tableUrl);

    table.attachEvent("onPaste", function(text) {
      let sel = this.getSelectedId(true);
      sel.forEach(item => {
        scope.updateRowPaste(item.column, this.getItem(item.row))
      });

    });
    employeeCombo.attachEvent("onChange", function(id) {
     scope.getDataTable();
    });

    dateFrom.attachEvent("onChange", function(id) {
      scope.getDataTable();
    });

    dateTo.attachEvent("onChange", function(id) {
      scope.getDataTable();
    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  getDataTable() {
    let form = this.$$("form-search");
    let table = this.$$("employee-salary-table");
    let employeeCombo = this.$$("employee-combo");
    let employeeId = employeeCombo.getValue();

    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let filter = {
      "date_salary" : {'>=':dateFromValue, '<=':dateToValue}
    };
    if (employeeId) {
      filter["employee_id"] = employeeId;
    }
    let params = {
      "filter": filter,
      "per-page" : "-1",
      "sort": [
        {"property":"employee_name","direction":"ASC"},
        {"property":"date_salary","direction":"ASC"}
      ]
    };
    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/employee-salaries");
    webix.ajax().get( tableUrl, params).then(function(data) {
      table.clearAll();
      table.parse(data);
      table.openAll();
    });
  }

  updateRowPaste(column, record) {
    let scope =this;
    let dateEdit = column.replace('-start','').replace('-end','');
    let employeeId = record.employee_id;

    let isStart = 0;
    let id = record[dateEdit+'-id'];
    if (column.indexOf('-start')!= -1) {
      isStart = 1;
    }
    let field = (isStart) ? 'int_start' : 'int_end';
    let row = {
      id : id
    };
    row[field] = record[column];
    let tableUrlUpdate = scope.app.config.apiRest.getUrl("put","accounting/employee-time-works", {},row.id);

    webix.ajax().put(tableUrlUpdate, row,{
      error:function(text, data, XmlHttpRequest){
        scope.$$('employee-salary-table').addCellCss(record.id, column, "webix_invalid_cell");
      },
      success:function(text, data, XmlHttpRequest){
        scope.$$('employee-salary-table').addCellCss(record.id, column, "webix_editing_cell");
      }
    });
  }



  resetColumns(){
    this.$$("employee-salary-table").config.columns = [
      // { id:"index", header:"#", sort:"int", width:50,
      //   template: function() {
      //     if (obj.$group) return common.treetable(obj, common) + obj.department_name;
      //     return obj.index;
      //   }
      // },
      { id:"employee_name", header:"Сотрудник", width: 240, sort: "string",
        template:function(obj, common) {
          //debugger;
          if (obj.$group) return common.treetable(obj, common) + obj.department_name;
          return common.treetable(obj, common) +obj.index+'. '+obj.employee_name;
        },
      },
    ];
    //this.$$("employee-salary-table").refreshColumns();
  };

  changeColumns(dateFrom, dateTo) {
    let getDaysArray = function(start, end) {
      for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
      }
      return arr;
    };

    let dates = getDaysArray(dateFrom.getValue(), dateTo.getValue());
    dates.reverse();
    let formatColumn = webix.Date.dateToStr("%D %d");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    this.resetColumns();
    for (let key in dates) {
      this.addColumn( format(dates[key]), formatColumn(dates[key]));
    }
    this.$$("employee-salary-table").refreshColumns();
  }

  addColumn(id, header) {
    var columns = this.$$("employee-salary-table").config.columns;
    let headerStart = [{text: header, colspan: 2}, "н."];
    let headerStop = [{text: "", colspan: 2}, "к."];

    columns.splice(1,0,{ id:id+'-end', header:headerStop,	width:50 , css: {"text-align": "right"},
      format: webix.Number.format, editor:"text",
      template: function(obj) {
        return (!obj[id+'-end'] || obj[id+'-end'] == 0) ? '':obj[id+'-end'];
      }
    });
    columns.splice(1,0,{ id:id+'-start', header:headerStart,	width:50 , css: {"text-align": "right"},
      format: webix.Number.format, editor:"text",
      template: function(obj) {
        return (!obj[id+'-start'] || obj[id+'-start'] == 0) ? '':obj[id+'-start']
      }
    });

  };

  afterEditStop(state, editor, ignoreUpdate) {

    let scope =this;
    let isUpdate = true;

    let table = this.$$('employee-salary-table');
    let record = table.getItem(editor.row);
    let column = editor.column;
    let value = (state.value) ? state.value : 0 ;
    this. updateRow(column, record, value);


  }

  updateRow(column, record, value) {
    let scope =this;
    let dateEdit = column.replace('-start','').replace('-end','');
    let employeeId = record.employee_id;

    let isStart = 0;
    let id = record[dateEdit+'-id'];
    if (column.indexOf('-start')!= -1) {
      isStart = 1;
    }
    let field = (isStart) ? 'int_start' : 'int_end';
    let row = {
      id : id
    };
    row[field] = value;
    let tableUrlUpdate = scope.app.config.apiRest.getUrl("put","accounting/employee-time-works", {},row.id);

    webix.ajax().put(tableUrlUpdate, row, {
      error:function(text, data, XmlHttpRequest){
        scope.$$('employee-salary-table').addCellCss(record.id, column, "webix_invalid_cell");
      },
      success:function(text, data, XmlHttpRequest){
        scope.$$('employee-salary-table').addCellCss(record.id, column, "webix_editing_cell");
      }
    });
  }

  doClickOpenAll() {
    let table = this.$$("employee-salary-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

}