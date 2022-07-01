import {JetView, plugins} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class StoreProductVariantSpeedView extends JetView{
  config(){

    let scope = this;
    this.use(plugins.UrlParam, ["id"]);

    let id = this.getParam('id');
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
                  "label": "Товар: Экспорт в Битрикс",
                  "width": 350
                },

                {},
                { view:"icon", icon: 'mdi mdi-microsoft-excel', autowidth:true, click: () =>  this.doClickToExcel()},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },

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
              localId: "product-variant-speed-table",
              urlEdit: 'products/product-variant-speed',
              urlEditFull: true,
              css:"webix_header_border webix_data_border",
              select: true,
              resizeColumn: { headerOnly:true },
              rowHeight:60,
              columns:[
                //{ id:"id", header:[ "#", { content:"selectFilter" }, "" ],	width:80 },
                // { id:"picture_anons_img", header:[ "", "", "" ], width: 140, sort: "string",
                //   template: function(obj) {
                //     return '<img src="'+obj.offer_picture_anons+'" style="cursor:pointer; width:120px;" />';
                //
                //   }
                // },

                { id:"url", header:[ "Символьный код", { content:"selectFilter" }, "" ], width: 180, sort: "string" },
                { id:"url_category", header:[ "Символьный код (категории)", { content:"selectFilter" }, "" ], width: 100, sort: "string" },
                { id:"name", header:[ "Наименование", { content:"selectFilter" }, "" ], width: 220, sort: "string" },
                { id:"offer_name", header:[ "Наименование (ТП)", { content:"selectFilter" }, "" ], width: 280, sort: "string" },
                { id:"offer_code", header:[ "Код элемента (ТП)", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"offer_property_1", header:[ "Спальное место", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"offer_property_2", header:[ "Цвет", { content:"selectFilter" }, "" ], width: 50, sort: "string" },
                { id:"offer_property_3", header:[ "Ткань", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"offer_price_opt", header:[ "Закупочная цена", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"offer_price", header:[ "Розничная цена", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"offer_price_discount", header:[ "Цена со скидкой", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"offer_discount", header:[ "Cкидка", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"offer_picture_anons", header:[ "ТП картинка для анонса", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"offer_picture_details", header:[ "ТП картинка детальная", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"offer_pictures", header:[ "ТП картинки", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"is_active", header:[ "Активность", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"picture_anons", header:[ "Картинка для анонса", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"picture_details", header:[ "Картинка детальная", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"pictures", header:[ "Картинки", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"id_model", header:[ "Код", { content:"selectFilter" }, "" ], width: 50, sort: "string" },
                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"products/product-variant-speed/export-bitrix", {'expand': 'data,categories', 'per-page': -1, 'id':id}),
              //save: "api->products/product-variant-speeds",
              scheme: {
                //$sort:{ by:"name", dir:"asc" },
              },
              on: {
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
    let table = this.$$("product-variant-speed-table");
    //table.markSorting("name", "asc");
    let scope = this;
    // table.attachEvent("onDataRequest", function (start, count) {
    //   webix.ajax().get(scope.app.config.apiRest.getUrl('get', 'accounting/contragents', {
    //     "expand": "contragent,product-variant-speed,project,account,data",
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

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','product-variant-speeds'), objFilter).then(function(data) {
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
    this.$$('product-variant-speed-table').unselect();
    this.cashEdit.showForm(this.$$('product-variant-speed-table'));
  }

  doClickToExcel() {
    let table = this.$$("product-variant-speed-table");
    webix.toExcel(table);
  }

}