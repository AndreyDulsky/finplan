import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class ProductsBedView extends JetView{
  config(){
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
                  "label": "Зарплатная ведомость",
                  "width": 250
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("time-work-table");
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

              ]
            },
            {
              view: "datatable",
              localId: "time-work-table",
              urlEdit: 'time-work',
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
                { id:"employee_id", header:"ID", width: 30, sort: "string" },
                { id:"employee_name", header:"Сотрудник", width: 180, sort: "string" },
                { id:"is_piecework", header:"Тип", width: 40, sort: "string" },
                //{ id:"sum_start_month", header:"Долг на начало", width: 100, sort: "string" },
                { id:"rate", header:"Ставка", width: 80, sort: "string" },
                { id:"rate_day", header:"Ставка за день", width: 100, sort: "string" },
                { id:"work_time_days", header:"Дни посещения", width: 100, sort: "string" },
                { id:"work_time_hours", header:"Дни по часам", width: 100, sort: "string" },
                { id:"salary_rate", header:"ЗП по ставке", width: 100, sort: "string" },
                { id:"salary_piecework", header:"ЗП по сдельно", width: 100, sort: "string" },
                { id:"award", header:"Премия", width: 100, sort: "string" },
                { id:"surcharges", header:"Доп./Выч.", width: 100, sort: "string" },
                { id:"salary", header:"К выплате", width: 100, sort: "string" },
                //{ id:"paid_out", header:"Выплачено", width: 100, sort: "string" },
                //{ id:"paid_out_month", header:"Выпл-но за месяц", width: 100, sort: "string" },
                //{ id:"debt_prev_month", header:"Долг с прош. месяца", width: 100, sort: "string" },
                //{ id:"remainder", header:"Остаток", width: 80, sort: "string" }
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits", {'sort':'name'}),//"api->accounting/contragents",
              //save: "api->accounting/employee-time-works",
              // scheme: {
              //    $sort:{ by:"name", dir:"asc" },
              //  },

              on:{
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

                  } else {
                    this.$scope.cashEdit.showForm(this);
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

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits", {"dateFrom": dateFromValue, "dateTo": dateToValue});
    let scope =this;
    //scope.changeColumns(dateFrom, dateTo);
    //table.clearAll();
    //table.load(tableUrl);

    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);


      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl);
    });
    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/employee-time-work/visits", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl);
    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  doAddClick() {
    this.$$('time-work-table').unselect();
    this.cashEdit.showForm(this.$$('time-work-table'));
  }

  resetColumns(){
    this.$$("time-work-table").config.columns = [
      { id:"employee_name", header:"Сотрудник", width: 180, sort: "string" },
    ];
    this.$$("time-work-table").refreshColumns();
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
  }

  addColumn(id, header) {
    var columns = this.$$("time-work-table").config.columns;
    console.log(id);

    columns.splice(1,0,{ id:id+'end', header:header+' к.',	width:60 , css: {"text-align": "right"}, format: webix.Number.format,
      template: function(obj) {
        return (obj[id].end == 0) ? '':obj[id].end;
      }
    });
    columns.splice(1,0,{ id:id+'start', header:header+' н.',	width:60 , css: {"text-align": "right"}, format: webix.Number.format,
      template: function(obj) {
        return (obj[id].start == 0) ? '':obj[id].start
      }
    });
    this.$$("time-work-table").refreshColumns();
  };

}