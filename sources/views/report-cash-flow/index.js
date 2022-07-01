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
                  "label": "Движение денежных средств",
                  "width":250
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("category-table");
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
                  value: webix.Date.monthStart(new Date())
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
              localId: "category-table",
              autoConfig: true,
              css:"webix_header_border webix_data_border",
              hover: "myhover",
              leftSplit:1,
              //rightSplit:1,
              expand: true,
              header: true,
              footer: false,
              select: true,
              resizeColumn: { headerOnly:true },
              columns:[
                { id:"name", header:"Наиименование", width: 380, sort: "string", "open":true, template:"{common.treetable()} #name#" },
                { id:"value", header:"Итого",	width:100, css: {"text-align": "right", "font-weight": "500", "color":"#222"}, format: webix.Number.format,
                  footer: {content: "summColumn", css: {"text-align": "right"}},
                },
              ],
              //url: this.app.config.apiRest.getUrl('get',"accounting/category/cashflow", {"expand":"data","per-page": "-1"}),

              ready:function(){

                //this.openAll();
              },

            }
          ]
        },

      ]
    };
  }

  init(view){
    let table = this.$$("category-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/category/cashflow", {"dateFrom": dateFromValue, "dateTo": dateToValue});
    let scope =this;
    scope.changeColumns(dateFrom, dateTo);
    table.clearAll();
    table.load(tableUrl);

    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);


      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/category/cashflow", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl);
    });
    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/category/cashflow", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl);
    });
  }

  addColumn(id, header) {
    var columns = this.$$("category-table").config.columns;
    columns.splice(1,0,{ id:id, header:header,	width:100 , css: {"text-align": "right"}, format: webix.Number.format});
    this.$$("category-table").refreshColumns();
  };

  resetColumns(){
    this.$$("category-table").config.columns = [
      { id:"name", header:"Наиименование", width: 380, sort: "string", "open":true, template:"{common.treetable()} #name#" },
      { id:"value", header:"Итого",	width:100, css: {"text-align": "right", "font-weight": "500", "color":"#222"}, format: webix.Number.format,
        footer: {content: "summColumn", css: {"text-align": "right"}},
      },
    ];
    this.$$("category-table").refreshColumns();
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
    let formatColumn = webix.Date.dateToStr("%d %M %y");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    this.resetColumns();
    for (let key in dates) {
      this.addColumn( format(dates[key]), formatColumn(dates[key]));
    }
  }



}