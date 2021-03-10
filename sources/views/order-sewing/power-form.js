import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
//import {departments} from "models/department/departments";
//import {typeSalary} from "models/department/type-salary";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


webix.GroupMethods.medianEmpty = function(prop, data){
  if (!data.length) return 0;
  var summ = 0;
  for (var i = data.length - 1; i >= 0; i--) {

    if (data[i].$level == 1 ) {
      let per =prop(data[i]);
      if (per!="") {

        //per = parseFloat(per);
        if (per !== null) per = per.replace(".",",");
        per = webix.Number.parse(per, {
          decimalSize: 2, groupSize: 3,
          decimalDelimiter: ",", groupDelimiter: ""
        });
        if (!isNaN(per)) {
          summ += per * 1;
        }
      }

    }
  }

  return webix.i18n.numberFormat(summ,{
    groupDelimiter:",",
    groupSize:3,
    decimalDelimiter:".",
    decimalSize:2
  });
};

export default class PowerFormView extends JetView{

  config(){

    let scope = this;
    return {
      view: 'window',
      close: true,
      modal: true,
      height:500,
      width:600,
      position:"center",
      head:{
        cols:[
          {template:"Мощность в часах", type:"header", borderless:true},
          {view:"icon", icon:"mdi mdi-fullscreen", tooltip:"enable fullscreen mode", click: function(){
            if(scope.getRoot().config.fullscreen){
              webix.fullscreen.exit();
              this.define({icon:"mdi mdi-fullscreen", tooltip:"Enable fullscreen mode"});
            }
            else{
              webix.fullscreen.set(scope.getRoot());
              this.define({icon:"mdi mdi-fullscreen-exit", tooltip:"Disable fullscreen mode"});
            }
            this.refresh();
          }},
          {view:"icon", icon:"wxi-close", tooltip:"Close window", click: function(){

            scope.getRoot().close();
          }}
        ]
      },
      body: {
        localId: "layout",
        type:"wide",

        cols:[
          {
            rows: [

              {
                view: "treetable",
                localId: "power-table",
                urlEdit: 'employee',
                //autoConfig: true,
                css:"webix_header_border webix_data_border",
                //leftSplit:1,
                //rightSplit:2,
                select: true,
                //datafetch:100,
                //datathrottle: 500,
                //loadahead:100,
                resizeColumn: { headerOnly:true },

                columns:[
                  // { id:"index", header:"ID", width: 40 },
                  // { id:"employee_name", header:"Наименование", width: 150},
                  // { id:"power", header:"Мощность, ч", width: 150}
                ],
                //url: this.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits?dateFrom=2021-03-10&dateTo=2021-03-11", {'sort':'name'}),//"api->accounting/contragents",
                //save: "api->accounting/employees",
                scheme: {
                  $init:function(obj){ obj.index = this.count()+1; },
                  // $group: {
                  //   by: 'department_id',
                  //   map: {
                  //     'department' : ['department'],
                  //     'department_id': ['department_id'],
                  //     'department_name': ['department_name'],
                  //
                  //     'employee_name': ['employee_name'],
                  //     'power' : ["power","median"],
                  //     'value' : ['index']
                  //   }
                  // },

                  //$sort:{ by:"department_id", dir:"asc" },
                },
                ready:function(){
                  this.openAll();
                },

                on:{
                  onItemClick:function(id, e, trg) {
                    this.$scope.cashEdit.showForm(this);
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
      }
    };
  }

  showWindow() {
    this.getRoot().show();
  }

  init(view){

    let table = this.$$("power-table");
    this.table = table;

    let dateFromValue = this._parent.dateFrom;
    let dateToValue = this._parent.dateFrom;
    let scope = this.table;
    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/employee-time-work/powers",
      {"dateFrom": dateFromValue, "dateTo": dateToValue, 'expand' : 'department,employee','filter': {'status' : 1} });

    this.changeColumns(dateFromValue, dateToValue);
    table.clearAll();
    let indexPower = dateFromValue+'-power';
    let map = {
      'department' : ['department'],
      'department_id': ['department_id'],
      'department_name': ['department_name'],

      'employee_name': ['employee_name'],
      'value' : ['index']
    };
    map[indexPower] = [indexPower,"medianEmpty"];
    table.load(tableUrl).then(function() {

      table.group({
        by: 'department_id',
        map: map
      });
      table.openAll();
    });


    this.cashEdit = this.ui(UpdateFormView);
  }

  changeColumns(dateFrom, dateTo) {
    let table = this.$$("power-table");
    let formatDate = webix.Date.strToDate("%Y-%m-%d");
    let getDaysArray = function(start, end) {
      for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
      }
      return arr;
    };

    let dates = getDaysArray(formatDate(dateFrom), formatDate(dateTo));
    dates.reverse();
    let formatColumn = webix.Date.dateToStr("%D %d");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    this.resetColumns();
    for (let key in dates) {
      this.addColumn( format(dates[key]), formatColumn(dates[key]));
    }

    this.$$("power-table").refreshColumns();

  }

  addColumn(id, header) {
    var columns = this.$$("power-table").config.columns;
    let headerStart = [{text: header, colspan: 2}, "н."];
    let headerStop = [{text: "", colspan: 2}, "к."];

    columns.splice(1,0,{ id:id+'-power', header:'Мощность, ч',"fillspace": true, css: {"text-align": "right"},
      format: webix.Number.format, editor:"text",

    });
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


  }

  resetColumns(){
    this.$$("power-table").config.columns = [
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

}