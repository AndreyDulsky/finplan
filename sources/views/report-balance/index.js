import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class ReportCashFlowView extends JetView{
  config(){
    return {
      localId: "layout",
      type:"wide",
      cols:[
        {
          rows: [


            {
              "view": "toolbar",
              //height: 40,
              paddingY:2,
              cols: [
                {
                  "view": "label",
                  "label": "Баланс",
                  "width":250
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("balance-table");
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
                {}

              ]
            },
            {
              view: "treetable",
              localId: "balance-table",
              autoConfig: true,
              css:"webix_header_border webix_data_border",
              hover: "myhover",
              leftSplit:1,
              //rightSplit:1,
              expand: true,
              header: true,
              footer: false,
              //select: true,
              //select:"row",
              select: "cell", multiselect: true, blockselect: true,
              clipboard:"block",
              editable:true,
              math: true,
              editMath:true,
              editaction: "dblclick",
              resizeColumn: { headerOnly:true },
              columns:[
                // { id:"name", header:"Наиименование", width: 380, sort: "string", "open":true, template:"{common.treetable()} #name#" },
                // { id:"value", header:"Итого",	width:100, css: {"text-align": "right", "font-weight": "500", "color":"#222"}, format: webix.Number.format,
                //   footer: {content: "summColumn", css: {"text-align": "right"}, 'editor' : 'text'},
                // },
              ],
              //url: this.app.config.apiRest.getUrl('get',"accounting/category/cashflow", {"expand":"data","per-page": "-1"}),
             // save: this.app.config.apiRest.getUrl('get',"accounting/report-balances"),
              ready:function(){

                //this.openAll();
              },
              scheme:{
                // $group:{
                //   by:"category_id",
                //   // footer:{
                //   //   sum:["sum", "sum"],
                //   //   row:function(obj ){
                //   //     return "<span style='float:right;'>Total:"+webix.i18n.numberFormat(obj.sum)+"</span>";
                //   //   }
                //   // }
                //   map: {
                //     'category_id' : ['category_id']
                //   }
                // }
              }


            }
          ]
        },

      ]
    };
  }

  init(view){
    let table = this.$$("balance-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/category/balance", {"dateFrom": dateFromValue, "dateTo": dateToValue});
    let scope =this;
    scope.changeColumns(dateFrom, dateTo);
    //scope.resetColumns();
    table.clearAll();
    table.load(tableUrl);

    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);


      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/category/balance", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl);
    });
    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/category/balance", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl);
    });
    table.attachEvent("onBeforeEditStop", function(state, editor, ignoreUpdate){
      let record = {};
      //if(editor.column === "value"){

        record = table.getItem(editor.row);

        let recordEdit = {'value': eval(state.value.replace('=',''))};
        let id = record.ids[editor.column];
        //table.refresh(editor.row);
        if (id) {
          tableUrl = scope.app.config.apiRest.getUrl('get', "accounting/report-balances/" + id);
          webix.ajax().put(tableUrl, recordEdit).then(function (data) {
            webix.message('Данные сохранены!');
          });
        } else {
          recordEdit = {'value': eval(state.value.replace('=','')), 'date_balance' :editor.column, 'category_id' : editor.row,  'type' : 'parent_balance_id'  };
          tableUrl = scope.app.config.apiRest.getUrl('get', "accounting/report-balances");
          webix.ajax().post(tableUrl, recordEdit).then(function (data) {
            webix.message('Данные сохранены!');
          });
        }
      //}

    });
  }

  addColumn(id, header) {
    var columns = this.$$("balance-table").config.columns;
    columns.splice(1,0,{ id:id, header:header,	width:100 , css: {"text-align": "right"},format: webix.Number.format, editor: 'text'});
    this.$$("balance-table").refreshColumns();
  };

  resetColumns(){
    this.$$("balance-table").config.columns = [
      { id:"name", header:"Наиименование", width: 380, sort: "string", "open":true, template:"{common.treetable()} #name#" },
      { id:"transaction_category_type", header:"type", width: 380, sort: "string"},
      // { id:"value", header:"Sum",	width:100, css: {"text-align": "right", "font-weight": "500", "color":"#222"}, format: webix.Number.format,
      //   footer: {content: "summColumn", css: {"text-align": "right"}},  'editor' : 'text',
      // },
    ];
    this.$$("balance-table").refreshColumns();
  };

  changeColumns(dateFrom, dateTo) {
    let getDaysArray = function(start, end) {
      for(var arr=[],dt= webix.Date.monthStart(start); dt<=end; webix.Date.add(dt, 1, "month")){
        arr.push(new Date(dt));
      }
      return arr;
    };

    let dates = getDaysArray(dateFrom.getValue(), dateTo.getValue());
    dates.reverse();
    let formatColumn = webix.Date.dateToStr("%M %y");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    this.resetColumns();
    for (let key in dates) {
      this.addColumn( format(dates[key]), formatColumn(dates[key]));
    }
  }



}