import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


webix.UIManager.addHotKey("enter", function(view){
  var pos = view.getSelectedId();
  view.edit(pos);
}, $$("work-salary-table"));

export default class ProductWorkSalaryView extends JetView{
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
                  "label": "Ставки по выработке",
                  "width": 150
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("work-salary-table");
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
              view: "datatable",
              localId: "work-salary-table",
              urlEdit: 'product-work-salary',
              //autoConfig: true,
              css:"webix_header_border webix_data_border",
              leftSplit:2,
              //rightSplit:2,
              select: 'cell',
              multiselect:true,
              //datafetch:100,
              //datathrottle: 500,
              //loadahead:100,
              resizeColumn: { headerOnly:true },
              editable:true,
              editaction: "custom",
              clipboard:"selection",

              columns:[
                { id:"id", header:"#",	width:50 },
                { id:"name", header:"Наиименование", width: 380, sort: "string" },
                { id:"product_id", header:"product_id", width: 180, sort: "string", editor: 'text' },
                { id:"size", header:"Размер", width: 80, sort: "string", editor: 'text' },
                { id:"net_cost", header:"Себ-ть база", width: 120, sort: "string", editor: 'text' },
                { id:"expense_cloth", header:"Расход ткани", width: 120, sort: "string", editor: 'text' },

                { id:"coef_time_cut", header:"Коэф. крой",	width:100 , editor: 'text'},
                { id:"coef_time_sewing", header:"Коэф. пош.", editor: 'text' },
                { id:"coef_time_carpenter", header:"Коэф. стол." , editor: 'text'},
                { id:"coef_time_upholstery", header:"Коэф. обив." , editor: 'text'},
                { id:"cost_cut", header:"Цена. крой",	width:100, editor: 'text' },
                { id:"cost_sewing", header:"Цена. пош.",	width:100, editor: 'text' },
                { id:"cost_ot", header:"Цена. отст.",	width:100, editor: 'text' },


                { id:"cost_carcass", header:"Цена ст. цар.",	width:110 , editor: 'text'},
                { id:"cost_headboard", header:"Цена ст. изг.",	width:110 , editor: 'text'},
                { id:"cost_grinding", header:"Цена ст.  шлиф.",	width:115 , editor: 'text'},

                { id:"cost_rubber_carcass", header:"Цена пор. цар.",	width:111, editor: 'text' },
                { id:"cost_rubber_headboard", header:"Цена пор. изг.",	width:110, editor: 'text' },
                { id:"cost_upholstery_carcass", header:"Цена об. цар.",	width:110, editor: 'text' },
                { id:"cost_upholstery_headboard", header:"Цена об. изг.",	width:110 , editor: 'text'},
                { id:"cost_buttons", header:"Цена пуг.",	width:100 , editor: 'text'},
                { id:"cost_matras", header:"Цена мат.",	width:100, editor: 'text' },




                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/product-work-salaries"),//"api->accounting/contragents",
              save: "api->accounting/product-work-salaries",
              // scheme: {
              //   $sort:{ by:"name", dir:"asc" },
              //
              // },
              ready:function(){
                //if (!this.count()){ //if no data are available

                  //this.showOverlay("<div style='...'>There is no data</div>");
                //}
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
                onItemDblClick: function() {
                  this.$scope.cashEdit.showForm(this);
                },
                onBeforeLoad:function(){
                  //this.showOverlay("Loading...");
                  webix.extend(this, webix.ProgressBar);
                  this.disable();
                  this.showProgress({
                    delay:2000,
                    hide:false
                  });
                },
                onAfterLoad:function(){
                  if (!this.count())
                    this.showOverlay("Sorry, there is no data");
                  else
                    this.enable();
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
    let table = this.$$("work-salary-table");
    //table.markSorting("name", "asc");
    let scope = this;
    // table.attachEvent("onDataRequest", function (start, count) {
    //   webix.ajax().get(scope.app.config.apiRest.getUrl('get', 'accounting/contragents', {
    //     "expand": "contragent,category,project,account,data",
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

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/product-work-salaries'), objFilter).then(function(data) {
        table.parse(data);
      });


      // table.loadNext(0, 0, 0, 0, 1).then(function (data) {
      //     table.clearAll(true);
      //     table.parse(data);
      // });

    });

    table.attachEvent("onPaste", function(text) {
      // define your pasting logic here
      let sel = this.getSelectedId(true);
      sel.forEach(item => {
        this.getItem(item.row)[item.column] = text;
        this.refresh(item.row);
        table.updateItem(item.row, this.getItem(item.row))
      });

    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  doAddClick() {
    this.$$('work-salary-table').unselect();
    this.cashEdit.showForm(this.$$('work-salary-table'));
  }

}