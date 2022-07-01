import {JetView} from "webix-jet";
import ListSalaryAccrualEditView from "views/list-salary-accrual/edit";
import localViews from  "helpers/localviews";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class ListSalaryAccrualView extends JetView{
  config(){
    return {
      localId: "layout",
      id: 'list-salary-accrual-view',
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
                  "label": "Журнал начисления зарплаты",
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
              localId: "list-salary-accrual-table",
              urlEdit: 'list-salary-accrual',
              //autoConfig: true,
              css:"webix_header_border webix_data_border",
              //leftSplit:1,
              //rightSplit:2,
              select: true,
              //datafetch:100,
              //datathrottle: 500,
              //loadahead:100,
              hover: "myhover",
              resizeColumn: { headerOnly:true },

              columns:[
                { id:"index", header:"#", sort:"int", width:50},
                { id:"date_document", header:"Дата", width: 130, sort: "string", format: webix.i18n.fullDateFormatStr },
                { id:"id", header:"ID", width: 30, sort: "string" },
                { id:"date_created", header:"Время создания", width: 130, sort: "string", format: webix.i18n.fullDateFormatStr },
                { id:"type_document_name", header:"Тип", width: 180, sort: "string", template: 'Начисление зарплаты' },
                //{ id:"type_document", header:"Тип", width: 180, sort: "string" },
                { id:"sum", header:"Сумма", width: 80, sort: "string", "fillspace": true, format: webix.i18n.numberFormat },

              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/list-salary-accruals", {'sort':'name'}),//"api->accounting/contragents",
              save: "api->accounting/list-salary-accruals",
              // scheme: {
              //    $sort:{ by:"name", dir:"asc" },
              //  },

              on:{
                "data->onStoreUpdated":function(){
                  this.data.each(function(obj, i){
                    obj.index = i+1;
                  })
                },
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
    let table = this.$$("list-salary-accrual-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/list-salary-accruals", {"dateFrom": dateFromValue, "dateTo": dateToValue});
    let scope =this;
    //scope.changeColumns(dateFrom, dateTo);
    //table.clearAll();
    table.load(tableUrl);

    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);


      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/list-salary-accruals", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl);
    });
    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      scope.changeColumns(dateFrom, dateTo);
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/list-salary-accruals", {"dateFrom": dateFromValue, "dateTo": dateToValue});
      table.clearAll();
      table.load(tableUrl);
    });

    this.cashEdit = this.ui(ListSalaryAccrualEditView);
    localViews['list-salary-accrual-view'] = this;
    if ($$("top:menu").getItem('list-salary-accrual-view')) {
      $$("top:menu").remove('list-salary-accrual-view');
    }
    $$("top:menu").add({ id: 'list-salary-accrual-view', value:"Журнал начисления зарплаты", icon:"mdi mdi-view-dashboard"},null,"info");
  }

  doAddClick() {
    this.$$('list-salary-accrual-table').unselect();
    this.cashEdit.showForm(this.$$('list-salary-accrual-table'));
  }



}