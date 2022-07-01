import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class StoreProductVariantSpeedView extends JetView{
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
                  "label": "Товар: Спецификация параметров",
                  "width": 350
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("product-variant-speed-table");
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
              localId: "product-variant-speed-table",
              urlEdit: 'products/product-variant-speed',
              urlEditFull: true,
              css:"webix_header_border webix_data_border",
              select: true,
              resizeColumn: { headerOnly:true },

              columns:[
                { id:"id", header:[ "#", { content:"selectFilter" }, "" ],	width:80 },
                { id:"A", header:[ "Атрибут", { content:"selectFilter" }, "" ], width: 180, sort: "string" },
                { id:"B", header:[ "Вид.", { content:"selectFilter" }, "" ], width: 100, sort: "string" },
                { id:"C", header:[ "Вариант", { content:"selectFilter" }, "" ], width: 100, sort: "string" },
                { id:"E", header:[ "Вид добавления", { content:"selectFilter" }, "" ], width: 50, sort: "string" },
                { id:"D", header:[ "Значение добавления.", { content:"selectFilter" }, "" ], width: 70, sort: "string" },

                { id:"F", header:[ "Артикул", { content:"selectFilter" }, "" ], width: 180, sort: "string" },

                { id:"G", header:[ "Группа", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"product_id", header:[ "product_id", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"type_id", header:[ "Тип", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"is_active", header:[ "Активен", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"index", header:[ "index", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"site_id", header:[ "Сайт", { content:"selectFilter" }, "" ], width: 70, sort: "string" },


                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"products/product-variant-speeds", {'expand': 'data,categories', 'per-page': -1}),
              save: "api->products/product-variant-speeds",
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

}