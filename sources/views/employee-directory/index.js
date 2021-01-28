import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
//import {departments} from "models/department/departments";
//import {typeSalary} from "models/department/type-salary";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class EmployeeDirectoryView extends JetView{
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
                  "label": "Сотрудники",
                  "width": 150
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"icon",
                  icon:"mdi mdi-fullscreen",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set(this.$scope.$$("employee-table"));
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
              localId: "employee-table",
              urlEdit: 'employee',
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
                { id:"department_name", header:"Сотрудники", width: 280,
                  template:function(obj, common) {
                    if (obj.$group) return common.treetable(obj, common) + obj.department_name;
                    return common.treetable(obj, common)+obj.name;
                  },
                },
                { id:"status", header:"Статус", width: 150, sort: "string", collection: [{'id':'0',"value":'Уволен'},{'id':'1',"value":'Работает'}] },
                //{ id:"name", header:"Наиименование", width: 280, sort: "string" },
                //{ id:"name", header:"Наиименование", width: 280, sort: "string" },
                //{ id:"rate", header:"Ставка", width: 180, sort: "string" },
                //{ id:"is_piecework", header:"Тип зарплаты", width: 180, sort: "string", type:'select',collection: typeSalary },
                //{ id:"bitrix_id", header:"ID битрикс", width: 120, sort: "string", edit: 'text' },
                //{ id:"category_id", header:"ID статьи выплат", width: 120, sort: "string", edit: 'text' },
                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/employees", {'sort':'name', 'per-page': -1}),//"api->accounting/contragents",
              save: "api->accounting/employees",

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
    let table = this.$$("employee-table");
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

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/employees', {'sort':'name'}), objFilter).then(function(data) {
        table.parse(data);
        table.openAll();
      });


      // table.loadNext(0, 0, 0, 0, 1).then(function (data) {
      //     table.clearAll(true);
      //     table.parse(data);
      // });

    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  doAddClick() {
    this.$$('employee-table').unselect();
    this.cashEdit.showForm(this.$$('employee-table'));
  }

}