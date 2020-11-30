import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class ContragentsDirectoryView extends JetView{
  config(){
    return {
      id: "layout",
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
                  "label": "Контрагенты",
                  "width": 150
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("table-register");
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
                  "icon":"mdi wxi-plus",
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
              id: "contragent",
              autoConfig: true,
              css:"webix_header_border webix_data_border",
              //leftSplit:1,
              //rightSplit:2,
              select: true,
              resizeColumn: { headerOnly:true },
              columns:[
                { id:"id", header:"#",	width:50 },
                { id:"name", header:"Наиименование", width: 380, sort: "string" },
                { id:"account", header:"Счет",	width:100 },
                { id:"external_id", header:"Экспорт ID" },
                { id:"category_in_id", header:"Родитель" },
                { id:"bank", header:"Банк" },
                { id:"mfo", header:"МФО" },
                { id:"okpo", header:"ОКПО" },
                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: "api->accounting/contragents",//this.app.config.apiRest.getUrl('get',"accounting/contragents", {"per-page": "-1"}),
              save: "api->accounting/contragents",
              scheme: {
                $sort:{ by:"name", dir:"asc" },

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
              }
            }
          ]
        },

      ]
    };
  }

  init(view){
    let form = this.$$("form-search");
    let table = this.$$("contragent");
    table.markSorting("name", "asc");
    let scope = this;

    form.attachEvent("onChange", function(obj){

      let filter = {'search':form.getValue()};
      let objFilter = { filter: filter };

      webix.extend(table, webix.ProgressBar);

      table.clearAll(true);
      table.showProgress({
        delay:2000,
        hide:false
      });
      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/contragents', {"expand":"contragent,category,project,account,data", "per-page":"-1"}), objFilter).then(function(data) {
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
    $$('contragent').unselect();
    this.cashEdit.showForm($$('contragent'));
  }

}