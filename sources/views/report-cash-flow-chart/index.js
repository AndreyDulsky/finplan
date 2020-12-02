import {JetView} from "webix-jet";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class ReportCashFlowChartView extends JetView{
  config(){
    return {
      id: "layout",
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
                    webix.fullscreen.set("category-chart");
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
                  value: new Date()
                },
                {}

              ]
            },


            {
              view:"chart",
              localId: 'cashflow-chart',
              //width:750,
              //height:250,
              type:"bar",
              value:"#value#",

              barWidth:20,
              radius:2,
              alpha: 0.7,
              gradient:"rising",
              xAxis:{
                template:"'#day#"
              },
              yAxis:{
                start:0,
                step:50000,
                end:500000
              },
              legend:{
                values:[{text:"Поступления",color:"#4aa397"},{text:"Выплаты",color:"#69ba00"},{text:"Остаток",color:"#de619c", markerType: "item"}],
                valign:"middle",
                align:"right",
                width:90,
                layout:"y"
              },
              series:[
                {
                  value:"#income#",
                  color: "#4aa397",
                  label:"#income#",
                  tooltip:{
                    template:"#income#"
                  }
                },
                {
                  value:"#outcome#",
                  color:"#69ba00",
                  label:"#outcome#",
                  tooltip:{
                    template:"#outcome#"
                  }
                },
                {
                  type:"spline",
                  value:"#value#",
                  color:"#36abee",
                  label:"#value#",
                  item:{
                    borderColor: "#b7286c",
                    color: "#de619c",
                    type: "s"
                  },
                  line:{
                    color:"#de619c",
                    width:2
                  },
                  tooltip:{
                    template:"#value#"
                  }
                }
              ],

            }
          ]
        },

      ]
    };
  }

  init(view){

    let cashFlowChart = this.$$("cashflow-chart");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let scope =this;

    let chartUrl = this.app.config.apiRest.getUrl('get',"accounting/account/balanceaccountbydatechart", {"dateFrom": dateFromValue, "dateTo": dateToValue});
    cashFlowChart.load(chartUrl);



    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      let chartUrl = scope.app.config.apiRest.getUrl('get',"accounting/account/balanceaccountbydatechart", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      cashFlowChart.load(chartUrl);
    });
    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      let chartUrl = scope.app.config.apiRest.getUrl('get',"accounting/account/balanceaccountbydatechart", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      cashFlowChart.load(chartUrl);

    });
  }

}