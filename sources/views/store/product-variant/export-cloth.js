import {JetView, plugins} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class StoreExportClothView extends JetView{
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
              localId: "export-cloth-table",
              urlEdit: 'products/export-cloth',
              urlEditFull: true,
              css:"webix_header_border webix_data_border",
              select: true,
              resizeColumn: { headerOnly:true },
              rowHeight:60,
              columns:[

                { id:"full_name", header:[ "Наименование", { content:"selectFilter" }, "" ], width: 280, sort: "string" },
                { id:"name", header:[ "Коллекция", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"color_real", header:[ "Цвет", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                //{ id:"provider", header:[ "Производитель", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"order_sort", header:[ "Сорт.", { content:"selectFilter" }, "" ], width: 50, sort: "string" },
                { id:"id", header:[ "Внешний Код", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"link", header:[ "Ссылка", { content:"selectFilter" }, "" ], width: 90, sort: "string" },
                { id:"description", header:[ "Описание", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"full_description", header:[ "Полное описание", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"category", header:[ "Категория", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"pictures", header:[ "Картинка", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"provider", header:[ "Производитель", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"param_type", header:[ "Тип ткани", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"param_structure", header:[ "Состав", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"param_test", header:[ "Тест", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"param_weight", header:[ "Вес", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"param_permeation", header:[ "Проникновение", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"param_link", header:[ "Ссылка", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id:"param_description", header:[ "Описание", { content:"selectFilter" }, "" ], width: 70, sort: "string" },
                { id: "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"products/product-variant-speed/export-cloth-bitrix", {'expand': 'data,categories', 'per-page': -1, 'id':id}),
              //save: "api->products/export-cloths",
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
    let table = this.$$("export-cloth-table");
    //table.markSorting("name", "asc");
    let scope = this;
    // table.attachEvent("onDataRequest", function (start, count) {
    //   webix.ajax().get(scope.app.config.apiRest.getUrl('get', 'accounting/contragents', {
    //     "expand": "contragent,export-cloth,project,account,data",
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

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','products/product-variant-speed/export-cloth-bitrix'), objFilter).then(function(data) {
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
    this.$$('export-cloth-table').unselect();
    this.cashEdit.showForm(this.$$('export-cloth-table'));
  }

  doClickToExcel() {
    let table = this.$$("export-cloth-table");
    webix.toExcel(table);
  }

}