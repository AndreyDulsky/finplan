import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
//import {departments} from "models/department/departments";
import {typeSalary} from "models/department/type-salary";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

let formatMonthYear = webix.Date.dateToStr("%M %y");
let formatDateDayWeek = webix.Date.dateToStr("%D");
let formatDate = webix.Date.dateToStr("%d.%m");



export default class EmployeeSalaryView extends JetView{
  urlChange(view, url){
    //webix.message(url[0].params.id);
  }
  config(){
    let scope = this;
    let css = {"color": "green", "text-align": "right", "font-weight": 100};
    let cssNumber = {"text-align": "right"};
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
                  "label": "Карта сотрудника",
                  "width": 150
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"icon",
                  icon:"mdi mdi-fullscreen",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set(this.$scope.$$("card-employee-table"));
                  }
                },
              ]
            },
            {
              "view": "toolbar",
              "height": 40,
              "paddingY":2,
              "cols": [
                {
                  "label": "Добавить",
                  "type":"icon",
                  "icon":"mdi mdi-plus",
                  "view": "button",
                  "height": 50,
                  "css": "webix_primary",
                  //"width": 120,
                  autowidth:true,
                  click: () => this.doAddClick()
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
              localId: "card-employee-table",
              urlEdit: 'employee',
              //autoConfig: true,
              css:"webix_header_border webix_data_border",
              //leftSplit:1,
              //rightSplit:2,
              select: true,
              editable:true,
              editaction: "dblclick",
              //datafetch:100,
              //datathrottle: 500,
              //loadahead:100,
              resizeColumn: { headerOnly:true },

              columns:[
                { id:"date_document", header:[ "Месяц",  "" ], width: 70, sort: "string", format: formatMonthYear },

                { id:"employee_id", header:[ "ID",  "" ], width: 30, sort: "string", hidden: true },

                { id:"is_piecework", header:[ "Тип",  "" ], width: 70, sort: "string", type:'select', collection: typeSalary },
                { id:"rate", header:[ "Ставка",  "" ], width: 80, sort: "string", editor:"text", format: webix.Number.format, "css": css },
                { id:"rate_day", header:[ "Ставка за день",  "" ], width: 120, sort: "string",  format: webix.Number.format, "css": cssNumber

                },
                { id:"all_time_days", header:[ "Рабочих дней",  { content:"summColumn" } ],  width: 110, sort: "string",  format: webix.Number.format, "css": cssNumber },
                { id:"work_time_days", header:[ "Дни посещения",  { content:"summColumn" } ],  width: 120, sort: "string",  format: webix.Number.format, "css": cssNumber },
                { id:"work_time_hours", header:[ "Дни по часам",  { content:"summColumn" } ],  width: 110, sort: "string",  format: webix.Number.format, "css": cssNumber },
                { id:"salary_rate", header:[ "ЗП по ставке",  { content:"summColumn" } ], width: 100, sort: "string",   math:"[$r,work_time_hours]*[$r,rate_day]", format: webix.Number.format, "css": cssNumber },
                { id:"salary_piecework", header:[ "ЗП по сдельно",  { content:"summColumn" } ], width: 110, sort: "string", editor:"text", format: webix.Number.format,"css": css },
                { id:"award", header:[ "Премия",  { content:"summColumn" } ],  width: 100, sort: "string", editor:"text", format: webix.Number.format,"css": css },
                { id:"surcharges", header:[ "Доп./Выч.",  { content:"summColumn" } ], width: 120, sort: "string",  editor:"text", format: webix.Number.format, "css": css },
                { "fillspace": true},
                { id:"salary",  width: 100, sort: "string", math:"[$r,salary_rate] + [$r,award]+ [$r,surcharges] +[$r,salary_piecework]" ,
                  format: webix.Number.format, "css": cssNumber, header:[ "К выплате",  { content:"summColumn" } ]},

                { id:"paid_out", header:"Выплачено", width: 100, sort: "string" },
                { id:"paid_out_month", header:"Выпл-но за месяц", width: 100, sort: "string" },
                { id:"debt_prev_month", header:"Долг с прош. месяца", width: 100, sort: "string" },
                { id:"remainder", header:"Остаток", width: 80, sort: "string" }
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/document-salary-accruals",  {'filter':'{"employee_id":"'+scope.getParam('id')+'"}', 'per-page':'-1'}),//"api->accounting/contragents",
              save: "api->accounting/employees",

              scheme: {
                // $group: {
                //   by: 'department_name',
                //   map: {
                //     'department_name' : ['department_name'],
                //     'name' : ['name'],
                //     'department_id' : ['department_id']
                //   }
                // },
                //
                // $sort:{ by:"department_id", dir:"asc", as:"int" },
              },
              ready:function() {
                //this.openAll();
              },
              on:{


                onBeforeLoad:function() {
                  this.showOverlay("Loading...");
                },
                onAfterLoad:function() {
                  if (!this.count())
                    this.showOverlay("Sorry, there is no data");
                  else
                    this.hideOverlay();
                },
              }
            },
            {
              view: "treetable",
              localId: "calendar-employee-table",
              urlEdit: 'employee',
              //autoConfig: true,
              css:"webix_header_border webix_data_border",
              leftSplit:1,
              math: true,
              select: true,
              editable:true,
              editaction: "dblclick",
              resizeColumn: { headerOnly:true },
              columns:[
                { id:"date_work", header:[ "Дата",  "" ], width: 120, sort: "string",
                  template:function(obj, common) {
                    if (obj.$group) return common.treetable(obj, common) + formatMonthYear(obj.value);
                    return common.treetable(obj, common)+formatDate(obj.date_work);
                  },
                },

                { id:"day_week", header:[ "День нед.",  "" ], width: 70, sort: "string", hidden: false,
                  cssFormat: function(value, obj) {

                    if (obj.date_type == 0) {
                      return {'background-color' : '#eee'};
                    }
                  },
                  template: function(obj) {
                    return formatDateDayWeek(obj.date_work);
                  }
                },
                { id:"int_start", header:[ "Нач",  "" ], width: 60, sort: "string",
                  css: {'text-align' : 'center'},
                  template: function(obj) {
                    if (obj.$group) return '';
                    return (obj.int_start == 0) ? '' : obj.int_start;
                  }
                },
                { id:"int_end", header:[ "Оконч.",  "" ], width: 60, sort: "string",
                  css: {'text-align' : 'center'},
                  template: function(obj) {
                    if (obj.$group) return '';
                    return (obj.int_end == 0) ? '' : obj.int_end;
                  }
                },
                { id:"qty_hours", header:[ "К-во часов.",  "" ], width: 100, sort: "string",
                  css: {'text-align' : 'center'},
                  template: function(obj) {
                    if (obj.$group) return '';
                    if (obj.int_start == 0) return '';
                    if (obj.int_end == 0) return '';
                    return  obj.int_end- obj.int_start -1;
                  }
                },
                { id:"pay_prepaid", header:[ "Аванс",  "" ], width: 100, sort: "string" },
                { id:"pay", header:[ "Оплата",  "" ], width: 100, sort: "string" },
                { id:"salary_day", header:[ "З.п/ч",  "" ], width: 100, sort: "string" },
                { id:"description", header:[ "Описание",  "" ], width: 100, sort: "string" },
                { id:"signature", header:[ "Подпись",  "" ], width: 100, sort: "string" },
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/employee-time-works",  {'filter':'{"employee_id":'+scope.getParam('id')+'}', 'per-page':'-1'}),
              save: "api->accounting/employee-time-works",

              scheme: {
                $group: {
                  by: function(obj) {
                    return formatMonthYear(obj.date_work);
                  },
                  map: {
                    'value' : ['date_work']
                  }
                },

                $sort:{ by:"date_work", dir:"asc", as:"date" },
              },
              ready:function() {
                //this.openAll();
              },
              on:{
                onBeforeLoad:function() {
                  this.showOverlay("Loading...");
                },
                onAfterLoad:function() {
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
    let table = this.$$("card-employee-table");
    //table.markSorting("name", "asc");
    let scope = this;


    form.attachEvent("onChange", function(obj){
      let filter = {'search':form.getValue()};
      let objFilter = { filter: filter };

      webix.extend(table, webix.ProgressBar);

      table.clearAll(true);
      table.showProgress({
        delay:2000,
        hide:false
      });

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/employees', {'sort':'name'}), objFilter).then(function(data) {
        table.parse(data);
        table.openAll();
      });


      // table.loadNext(0, 0, 0, 0, 1).then(function (data) {
      //     table.clearAll(true);
      //     table.parse(data);
      // });

    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  doAddClick() {
    this.$$('card-employee-table').unselect();
    this.cashEdit.showForm(this.$$('card-employee-table'));
  }

  doClickOpenAll() {
    let table = this.$$("card-employee-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

}