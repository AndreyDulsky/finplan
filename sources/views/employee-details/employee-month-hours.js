import {JetView} from "webix-jet";

//import {departments} from "models/department/departments";
import {typeSalary} from "models/department/type-salary";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

let formatMonthYear = webix.Date.dateToStr("%M %y");
let formatDateDayWeek = webix.Date.dateToStr("%D");
let formatDate = webix.Date.dateToStr("%d.%m");



export default class EmployeeMonthHoursView extends JetView{

  config(){
    let scope = this;
    let css = {"color": "green", "text-align": "right", "font-weight": 100};
    let cssNumber = {"text-align": "right"};
    return  {
      localId: "winEdit",
      view: "window",
      position: 'center',
      width: 1000,
      height: 600,
      close: true,
      modal: true,
      body:{
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
                    "label": scope.getParam('name'),
                    "width": 250
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

                  this.open();
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
      }
    };
  }

  init(view){
    let table = this.$$("card-employee-table");
    let scope = this;
  }

  showWindow(view) {
    let item = view.getSelectedItem();
    this.dateDocument = item.date_document;
    this.getRoot().show();
  }

  doClickOpenAll() {
    let table = this.$$("calendar-employee-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

}