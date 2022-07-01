import {JetView} from "webix-jet";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class ReportTurnOverChartView extends JetView{
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
                  "label": "Объем производства по месяцам",
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
                  value: webix.Date.add(webix.Date.yearStart(new Date()), -2, "year")
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
              type:"line",
              value:"#value#",
              label:"#value#",

              barWidth:55,
              radius:2,
              alpha: 0.7,
              gradient:"rising",
              xAxis:{
                template:"'#period#",
                lines: false
              },
              yAxis:{
                start:0,
                step:1000000,
                end:5000000,

              },



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

    let chartUrl = this.app.config.apiRest.getUrl('get',"accounting/report/turn-over-by-month", {"dateFrom": dateFromValue, "dateTo": dateToValue});
    cashFlowChart.load(chartUrl);



    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      let chartUrl = scope.app.config.apiRest.getUrl('get',"accounting/report/turn-over-by-month", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      cashFlowChart.clearAll();
      cashFlowChart.load(chartUrl);
    });
    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      let chartUrl = scope.app.config.apiRest.getUrl('get',"accounting/report/turn-over-by-month", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      cashFlowChart.clearAll();
      cashFlowChart.load(chartUrl);

    });
  }

}