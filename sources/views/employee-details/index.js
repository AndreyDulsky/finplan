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
    let cssRed = {"color": "red", "text-align": "right", "font-weight": 100};

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
                { view:"icon", icon: 'mdi mdi-printer', autowidth:true, click: () =>  this.doClickPrint()},
                { view:"icon", icon: 'mdi mdi-microsoft-excel', autowidth:true, click: () =>  this.doClickToExcel()},
                { view:"icon", icon: 'mdi mdi-save', autowidth:true, click: () =>  this.doClickToSave()},

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
                { id:"date_salary", header:[ "Месяц" ], width: 70, sort: "date", format: formatMonthYear },

                { id:"employee_id", header:[ "ID"], width: 30, sort: "string", hidden: true },

                //{ id:"is_piecework", header:[ "Тип"], width: 70, sort: "string", type:'select', collection: typeSalary },
                { id:"rate", header:[ "Ставка"], width: 80, sort: "string", editor:"text", format: webix.Number.format, "css": css },
                { id:"rate_day", header:[ "Ставка за день" ], width: 115, sort: "string",  format: webix.Number.format, "css": cssNumber

                },
                //{ id:"all_time_days", header:[ "Рабочих дней",  "" ],  width: 110, sort: "string",  format: webix.Number.format, "css": cssNumber },
                { id:"work_time_days", header:[ "Дни посещ." ],  width: 95, sort: "string",  format: webix.Number.format, "css": cssNumber },
                { id:"work_time_hours", header:[ "Дни по часам" ],  width: 110, sort: "string",  format: webix.Number.format, "css": cssNumber },
                { id:"salary_rate", header:[ "ЗП по ставке" ], width: 100, sort: "string",   math:"[$r,work_time_hours]*[$r,rate_day]", format: webix.Number.format, "css": css },
                { id:"salary_piecework", header:[ "ЗП по сдельно" ], width: 110, sort: "string",  format: webix.Number.format,"css": css },
                { id:"award", header:[ "Премия" ],  width: 80, sort: "string",  format: webix.Number.format,"css": css },
                { id:"surcharges", header:[ "Доп./Выч." ], width: 90, sort: "string",   format: webix.Number.format, "css": css },

                //{ "fillspace": false},
                { id:"salary",  width: 90, sort: "string", math:"[$r,salary_rate] + [$r,award]+ [$r,surcharges] +[$r,salary_piecework]" ,
                  cssFormat: function() { return {'font-weight' : 500}; },
                  format: webix.Number.format, "css": cssNumber, header:[ "К выплате" ]},

               //{ id:"paid_out", header:"Выплачено", width: 100, sort: "string" },
                { id:"dept_start_month", header:"Долг с прош. месяца", width: 100, sort: "string", "css": cssNumber },
                { id:"transaction_sum", header:"Выпл.", width: 80, sort: "string", "css": cssRed, format: webix.Number.format },

                { id:"remainder", header:"Остаток", width: 80, sort: "string", "css": cssNumber,
                  cssFormat: function() { return {'font-weight' : 500}; },
                  format: webix.Number.format
                },
                { id: "action-edit", "header": "", "width": 50, "template": "<i class='mdi mdi-eye hover'></i>", "fillspace": true}
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/employee-salaries",
                {
                  'filter':'{"employee_id":"'+scope.getParam('id')+'"}',
                  'sort': 'date_salary',
                  'per-page':'-1',
                  'expand' : 'documentSalaryAccrual, employee,transactionPart'
                }),
              save: "api->accounting/employees",
              on:{
                "onresize":webix.once(function(){
                  // adjust by "title" column
                  //this.adjustRowHeight("is_piecework", true);
                  // or, adjust by any column
                  this.adjustRowHeight(null, true);
                })
              },
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
                onItemClick:function(id, e, trg) {
                  if (id.column == 'action-edit') {
                    this.$scope.showInfoMonthHours.showWindow(this);
                  }
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

  doClickPrint() {
    let table = this.$$("card-employee-table");
    webix.print(table, { fit:"data"});
  }

  doClickToExcel() {
    let table = this.$$("card-employee-table");
    webix.toExcel(table, {
      filename: "months_"+this.getParam('name'),
      styles: false,
      ignore: { "action-edit" : true},
      filter:function(obj){
        return obj.transaction_sum != 0;
      }
    });

  }

  doClickToSave() {
    let table = this.$$("card-employee-table");
    webix.toPNG(table, {
      download:false
    }).then(function(blob){
      //process raw data
      //let blob1 = new Blob(blob, {type:"application/png"});
      webix.html.download(blob, "myfile.pdf");
      debugger;
    });
  }

}