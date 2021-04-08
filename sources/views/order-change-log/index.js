import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import {productTypes} from "models/product/product-type";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

// webix.editors.$popup.text = {
//   view:"popup",
//   body:{
//     view:"textarea",
//     width:250,
//     height:100
//   }
// };
webix.editors.$popup.text = {
  view:"popup",
  body:{
    view:"property",
    width:300,
    elements:[
      { label:"Layout", type:"label"},
      { label:"Data url", type:"text", id:"url"},
      { label:"Data type", type:"select", options:["json","xml","csv"], id:"type"},
      { label:"Use JSONP", type:"checkbox", id:"jsonp"}
    ],
    scheme:{
      $init: function($item) {
        debugger;
      }
    }
  }
};


export default class OrderChangeLogView extends JetView{
  config(){
    let scope = this;
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
                  "label": "Счета",
                  "width": 150
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
                {
                  view:"toggle",
                  type:"icon",
                  icon: 'mdi mdi-file-tree',
                  autowidth:true,
                  value :true,
                  click: function() { scope.doClickOpenAll() }

                },
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  }
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
              cols:[
                {
                  view: "treetable",
                  localId: "order-change-log-table",
                  urlEdit: 'order-change-log',
                  css:"webix_header_border webix_data_border",
                  leftSplit:2,
                  select: true,
                  editable:true,
                  editaction: "dblclick",
                  resizeColumn: { headerOnly:true },

                  columns:[
                    { id:"date_created", header:[ "Дата создания" ],	width:140, sort: "date"},
                    { id:"model_id", header:[ "#Модели" ], width: 70, sort: "string"},
                    { id:"order_id", header:[ "#Заказа" ], width: 70, sort: "string", editor: 'text' },
                    { id:"user_code", header:[ "#Пользователь" ], width: 70, sort: "string"},
                    { id:"change_params", header:[ "Новые значения" ], width: 380, sort: "string", editor: 'popup',
                      template: function(obj) {
                        return JSON.stringify(obj.change_params);
                      }
                    },
                    { id:"old_change_params", header:[ "Старые значения" ], width: 380, sort: "string", editor: 'popup',
                      template: function(obj) {
                        return JSON.stringify(obj.old_change_params);
                      }
                    },
                    {
                      "id": "action-delete",
                      "header": "",
                      "width": 50,
                      "template": "{common.trashIcon()}"
                    },
                    {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
                  ],
                  url: this.app.config.apiRest.getUrl('get',"accounting/order-change-logs", {'sort':'-id', 'per-page': 100, 'fields':'id,model_id,order_id,date_created, change_params, old_change_params,user_code'}),
                  save: "api->accounting/order-change-logs",
                  // scheme: {
                  //    $sort:{ by:"name", dir:"asc" },
                  //  },
                  scheme:{
                    // $group:{
                    //   by:function(obj){ return obj.type_id}, // 'company' is the name of a data property
                    //   map:{
                    //     value:["type_id"],
                    //   },
                    // }
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

                      }
                      if (id.column == 'action-edit') {
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
                },
                {
                  view:"datatable",
                  localId:"sets",
                  width:500,
                  columns: [
                    {'id' : 'name', 'header': 'Наименование' },
                    {'id' : 'new', 'header': 'Новое', width: 150 },
                    {'id' : 'old', 'header': 'Старое', width: 150 },


                  ]
                }

              ]
            }


          ]
        },

      ]
    };
  }

  init(view){
    let table = this.$$("order-change-log-table");
    let form = this.$$("form-search");
    let sets = this.$$('sets');
    let scope = this;
    webix.extend(table, webix.ProgressBar);

    form.attachEvent("onChange", function(obj){
      scope.getData();
    });
    table.attachEvent("onAfterSelect", function(selection, preserve){
      let item = table.getItem(selection.id);
      let params = item.change_params;
      let data = [];

      for(let key in params) {
        data.push({ name:key, old:item.old_change_params[key], id:key, new:params[key]})
      }
      sets.clearAll();
      sets.parse(data);

      //sets.refresh();

    });

    //this.$$('sets').bind(table);

    this.cashEdit = this.ui(UpdateFormView);
  }

  getData() {

    let table = this.$$("order-change-log-table");
    let form = this.$$("form-search");
    let scope = this;
    let filter = {'search':form.getValue()};
    let objFilter = { filter: filter };

    webix.extend(table, webix.ProgressBar);

    table.clearAll(true);
    table.showProgress({
      delay:2000,
      hide:false
    });

    webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/order-change-logs', {'sort':'-id', 'per-page': 100, 'fields':'id,model_id,order_id,date_created, change_params,old_change_params,user_code'}), objFilter).then(function(data) {
      table.parse(data);
      table.enable();
      table.openAll();
    });
  }

  doAddClick() {
    this.$$('order-change-log-table').unselect();
    this.cashEdit.showForm(this.$$('order-change-log-table'));
  }

  doClickOpenAll() {
    let table = this.$$("order-change-log-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  doRefresh() {
    let table = this.$$("order-change-log-table");
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.getData()();

  }

}