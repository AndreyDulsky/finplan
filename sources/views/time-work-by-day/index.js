import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class ProductsBedView extends JetView{
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
                    webix.fullscreen.set(this.$scope.$$("time-work-table"));
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
                  value: webix.Date.weekStart(new Date())
                },
                {
                  view:"datepicker",
                  localId: 'dateTo',
                  inputWidth:150,
                  label: 'по',
                  labelWidth:30,
                  width:160,
                  value: webix.Date.add(webix.Date.weekStart(new Date()),6,'day')
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
              localId: "time-work-table",
              //urlEdit: 'time-work',
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

              ],
              //url: this.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits", {'sort':'name'}),//"api->accounting/contragents",
              //save: "api->accounting/employee-time-works",
              // scheme: {
              //    $sort:{ by:"name", dir:"asc" },
              //  },
              scheme: {
                $group: {
                  by: 'department_id',
                  map: {
                    'department' : ['department'],
                    'department_id': ['department_id'],
                    'department_name': ['department_name'],

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
    let table = this.$$("time-work-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits", {"dateFrom": dateFromValue, "dateTo": dateToValue, 'expand' : 'department'});
    let scope =this;
    scope.changeColumns(dateFrom, dateTo);
    table.clearAll();
    table.load(tableUrl).then(function() {
      table.openAll();
    });

    table.attachEvent("onPaste", function(text) {
      // define your pasting logic here
      let sel = this.getSelectedId(true);
      sel.forEach(item => {
        //this.getItem(item.row)[item.column] = text;
        //this.refresh(item.row);
        scope.updateRowPaste(item.column, this.getItem(item.row))
      });

    });

    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);


      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl).then(function() {
        table.openAll();
      });
    });
    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl).then(function() {
        table.openAll();
      });
    });

    //this.cashEdit = this.ui(UpdateFormView);
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
        scope.$$('time-work-table').addCellCss(record.id, column, "webix_invalid_cell");
      },
      success:function(text, data, XmlHttpRequest){
        scope.$$('time-work-table').addCellCss(record.id, column, "webix_editing_cell");
      }
    });
  }



  resetColumns(){
    this.$$("time-work-table").config.columns = [
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
    //this.$$("time-work-table").refreshColumns();
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
    this.$$("time-work-table").refreshColumns();
  }

  addColumn(id, header) {
    var columns = this.$$("time-work-table").config.columns;
    let headerStart = [{text: header, colspan: 2}, "н."];
    let headerStop = [{text: "", colspan: 2}, "к."];

    columns.splice(1,0,{ id:id+'-end', header:headerStop,	width:50 , css: {"text-align": "right"},
      format: webix.Number.format, editor:"text",
      template: function(obj) {
        let result = (!obj[id+'-end'] || obj[id+'-end'] == 0) ? '':obj[id+'-end'];
        //if (obj[id+'-type'] == 'Прогул') return '<div class="highlight-red" >'+result+'</div>';
        return result;
      },
      cssFormat: function(value, obj) {
        return (obj[id+'-type'] == 'Прогул') ? 'highlight-red': {};
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

    let table = this.$$('time-work-table');
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
        scope.$$('time-work-table').addCellCss(record.id, column, "webix_invalid_cell");
      },
      success:function(text, data, XmlHttpRequest){
        scope.$$('time-work-table').addCellCss(record.id, column, "webix_editing_cell");
      }
    });
  }

  doClickOpenAll() {
    let table = this.$$("time-work-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

}