import {JetView} from "webix-jet";
import OrderCalculationRuleEditView from "views/order-calculation-rule/edit";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class OrderCalculationRuleView extends JetView{
  config(){

    let scope = this;
    this.api = this.app.config.apiRest;
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
                  "label": "Правила калькулятора стандарт",
                  "width": 250
                },

                {},
                {
                  view:"icon",
                  //type:"icon",
                  icon: 'mdi mdi-refresh',
                  autowidth:true,
                  value :true,
                  click: function() { scope.doRefresh() }

                },
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"icon",
                  icon:"mdi mdi-fullscreen",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set(this.$scope.$$("order-calculation-rule-table"));
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
              view: "datatable",
              localId: "order-calculation-rule-table",
              urlEdit: 'order-calculation-rule',
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
                { id:"process_id", header:"Процесс", width: 100, options:[{"id": "1", "value" :  "Прайс"}, {"id": "2", "value" :"Скидка клиента"}]  },
                { id:"index_order", header:"Порядок выполнения", width: 150 },
                { id:"order_field", header:"Свойство", width: 100, sort: "string" , options: scope.api.getCollection('accounting/calculation-fields',{"per-page" : -1})},
                { id:"type", header:"Тип свойства", width: 120, css:{'text-align': 'center'}, options: [{"id": "value", "value" :  "Значение"}, {"id": "dir", "value" :"Справочник"}] },
                { id:"directory_id", header:"Справочник", width: 120, css:{'text-align': 'center'}, options: scope.api.getCollection('accounting/calculation-directories',{"per-page" : -1})},

                { id:"rule", header:"Условие", width: 100, css:{'text-align': 'center'} },
                { id:"value", header:"Значение условия", width: 100, css:{'text-align': 'right'} },
                { id:"result_type", header:"Тип результата", width: 150, collection: [{"id": "value", "value" :  "Значение"}, {"id": "dir", "value" :"Справочник"}] },
                { id:"result_value_operation", header:"Операция со значением", width: 150 },
                { id:"result_value", header:"Значение", width: 150 },





                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/order-calculation-rules", {'sort':'index_order', 'per-page': -1}),//"api->accounting/contragents",
              save: "api->accounting/order-calculation-rules",

              scheme: {
                $group: {
                  by: 'department_name',
                  map: {
                    'department_name' : ['department_name'],
                    'name' : ['name'],
                    'department_id' : ['department_id']
                  }
                },

                $sort:{ by:"department_id", dir:"asc", as:"int" },
              },
              ready:function(){

              },
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
    this.cashEdit = this.ui(OrderCalculationRuleEditView);
  }

  doRefresh() {
    let table = this.$$("order-calculation-rule-table");

    this.restApi = this.app.config.apiRest;
    let tableUrl = this.restApi.getUrl('get',"accounting/order-calculation-rules", {
      "per-page": "-1",
      sort: '[{"property":"index_order","direction":"ASC"}]',
    });

    webix.extend(table, webix.ProgressBar);
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.restApi.getLoad(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().data);
      table.enable();
    });

  }

  doAddClick() {
    this.$$('order-calculation-rule-table').unselect();
    this.cashEdit.showForm(this.$$('order-calculation-rule-table'));
  }
}