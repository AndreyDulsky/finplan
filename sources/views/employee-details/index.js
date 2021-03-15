import {JetView} from "webix-jet";
import EmployeeMonthHoursView from "views/employee-details/employee-month-hours";
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
                  view:"icon",
                  icon:"mdi mdi-keyboard-backspace",
                  width: 30,
                  click: function() {
                    scope.app.show("/top/employee-salary");
                  }
                },
                {
                  "view": "label",
                  "label": scope.getParam('name'),
                  "width": 250
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
                { id:"remainder", header:"Остаток", width: 80, sort: "string" },
                { id: "action-edit", "header": "", "width": 50, "template": "<i class='mdi mdi-eye hover'></i>"}
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
                onItemDblClick:function(id, e, trg) {
                  this.$scope.showInfoMonthHours.showWindow(this);
                },

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

    this.showInfoMonthHours = this.ui(EmployeeMonthHoursView);
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