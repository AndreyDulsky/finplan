import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";
import localViews from  "helpers/localviews";

export default class StoreProductView extends JetView{
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
                  "label": "Магазин: Товары",
                  "width": 150
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("store-product-table");
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

              ]
            },
            {
              view: "treetable",
              localId: "store-product-table",
              urlEdit: 'products/default/',
              urlEditFull: true,
              css:"webix_header_border webix_data_border",
              select: true,
              resizeColumn: { headerOnly:true },

              columns:[
                { id:"id", header:[ "#", { content:"selectFilter" }, "" ],	width:80 },
                { id:"name", header:[ "Наименование", { content:"selectFilter" }, "" ], width: 180, sort: "string" },
                { id:"sku", header:[ "Артикул", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"categories", header:[ "Категории", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"price", header:[ "Цена.розн", { content:"selectFilter" }, "" ], width: 120, sort: "string" },
                { id:"is_price_coef", header:[ "Розн.по.коэф", { content:"selectFilter" }, "" ], width: 100, sort: "string" },
                { id:"price_coef", header:[ "Розн.коэф", { content:"selectFilter" }, "" ], width: 90, sort: "string" },

                { id:"price_opt", header:[ "Цена.опт", { content:"selectFilter" }, "" ], width: 120, sort: "string" },
                { id:"is_active", header:[ "Активен", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"type_id", header:[ "Тип", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"manufacturer_id", header:[ "Производитель", { content:"selectFilter" }, "" ], width: 120, sort: "string" },
                { id:"site_id", header:[ "Сайт", { content:"selectFilter" }, "" ], width: 120, sort: "string" },


                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"products", {'expand': 'data,categories', 'per-page': -1}),
              save: "api->products",
              scheme: {
                //$sort:{ by:"name", dir:"asc" },

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
                    //this.$scope.cashEdit.showForm(this);
                    let item = this.getItem(id.row);

                     let url = scope.app.config.apiRest.getUrl('get',"products/product-variant-speed/form-variant",
                       {'expand': 'data,categories', 'per-page': -1, 'typeId':item.type_id});
                    //var widgets = import(/* webpackChunkName: "widgets" */ url);
                    // widgets.then(function(data,data1) {
                    //   debugger;
                    //   localViews['customWidgetA'] = class some123 extends JetView {
                    //     config(){
                    //       return {view: 'customWidgetA'};
                    //     }
                    //   };
                    //   scope.show("customWidgetA");
                    // });

                    webix.ajax(url, function(text){
                      let text1 =eval(text);

                      //scope.ui(webix.DataDriver.json.toObject(text), scope);
                      // localViews['customWidgetA'] = class some123 extends JetView {
                      //   config(){
                      //     return {
                      //       view: 'window',
                      //       body: {view: 'customWidgetA'}
                      //     };
                      //   }
                      // };
                      //scope.show("customWidgetA");
                      let win = scope.ui({view: 'customWidgetA'},scope.$$('layout'));
                      win.show();
                      //localViews['customWidgetA'].show();
                      //scope.ui({view:'customWidgetA'}, scope.$$('layout'), scope.$$('store-product-table'));
                      //scope.$$('layout').refresh();

                    });
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
    let table = this.$$("store-product-table");
    //table.markSorting("name", "asc");
    let scope = this;
    // table.attachEvent("onDataRequest", function (start, count) {
    //   webix.ajax().get(scope.app.config.apiRest.getUrl('get', 'accounting/contragents', {
    //     "expand": "contragent,store-product,project,account,data",
    //     "per-page": count, "start" : start
    //   })).then(function (data) {
    //     //table.parse(data);
    //     // table.parse({
    //     //   pos: your_pos_value,
    //     //   total_count: your_total_count,
    //     //   data: data
    //     // });
    //   });
    //
    //   return false;
    // });


    form.attachEvent("onChange", function(obj){

      let filter = {'search':form.getValue()};
      let objFilter = { filter: filter };

      webix.extend(table, webix.ProgressBar);

      table.clearAll(true);
      table.showProgress({
        delay:2000,
        hide:false
      });

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','products'), objFilter).then(function(data) {
        table.parse(data);
      });


      // table.loadNext(0, 0, 0, 0, 1).then(function (data) {
      //     table.clearAll(true);
      //     table.parse(data);
      // });

    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  doAddClick() {
    this.$$('store-product-table').unselect();
    this.cashEdit.showForm(this.$$('store-product-table'));
  }

}