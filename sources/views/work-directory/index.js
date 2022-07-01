import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
//import {departments} from "models/department/departments";
//import {typeSalary} from "models/department/type-salary";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class WorkDirectoryView extends JetView{
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
                  "label": "Работы",
                  "width": 150
                },

                {},
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
                {}

              ]
            },
            {
              view: "treetable",
              localId: "work-directory-table",
              urlEdit: 'work',
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
                //{ id:"id", header:"ID", width: 40 },
                { id:"name", header:"Наименование", width: 250,
                  template: function(obj, common) {
                    if (obj.$group) return common.treetable(obj, common) + obj.department.name;
                    return common.icon(obj)+obj.name;
                  }
                },
                { id:"department_id", header:"Подразделение", width: 250,
                  collection: scope.app.config.apiRest.getCollection('accounting/departments',{'per-page': -1})
                },

                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/works", {'sort':'[{"property":"name", "direction" : "ASC"}]', 'expand' : 'department'}),
              save: "api->accounting/works",
              scheme: {
                // $sort:{ by:"department_id", dir:"asc", as:"int" },
                $group:{
                  by:"department_id",
                  map:{
                    value:["department_id"],
                    department:["department"]
                  },
                },
                $init:function(obj){ obj.index = this.count()+1; }
              },
              ready:function(){
                this.openAll();
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
    let table = this.$$("work-directory-table");
    //table.markSorting("name", "asc");
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

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/works', {'sort':'name'}), objFilter).then(function(data) {
        table.clearAll(true);
        table.parse(data);
      });

    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  doAddClick() {
    this.$$('work-directory-table').unselect();
    this.cashEdit.showForm(this.$$('work-directory-table'));
  }

}