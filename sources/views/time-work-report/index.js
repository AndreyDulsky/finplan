import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import {employees} from "models/employee/employees";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
webix.editors.$popup = {
  date:{
    view:"popup",
    body:{
      view:"calendar",
      timepicker:true,
      icons:true
      //weekNumber:true,
      //width: 220,
      //height:200
    }
  },
  text : {
    view:"popup",
    body:{
      view:"textarea",
      width:250,
      height:100
    }
  }
};
export default class TimeWorkReportView extends JetView{
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
                  "label": "Заявления на отсутствие",
                  "width": 150
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("employee-work-time-report-table");
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
              localId: "employee-work-time-report-table",
              urlEdit: 'employee-work-time-report',
              css:"webix_header_border webix_data_border",
              select: 'cell',
              editable:true,
              editaction: "dblclick",
              resizeColumn: { headerOnly:true },
              columns:[

                { id:"date_created", header:"Дата", width: 100, sort: "string", format: formatDateTime, editor:"date" },
                { id:"employee_id", header:"Сотрудник", width: 180, sort: "string",collection: employees },
                { id:"date_absence_start", header:"Время отстутствия с", width: 180, sort: "string", editor:"date", format: formatDateTime },
                { id:"date_absence_end", header:"Время отстутствия по", width: 180, sort: "string", edit: 'text', editor:"date", format: formatDateTime},
                { id:"description", header:"Примечание", width: 180, sort: "string", editor: 'text' },

                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/employee-work-time-reports", {'sort':'-date_created'}),//"api->accounting/contragents",
              save: "api->accounting/employee-work-time-reports",
              // scheme: {
              //    $sort:{ by:"name", dir:"asc" },
              //  },

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
                onBeforeLoad:function() {
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
    let table = this.$$("employee-work-time-report-table");
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

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/employee-work-time-reports'), objFilter).then(function(data) {
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
    this.$$('employee-work-time-report-table').unselect();
    this.cashEdit.showForm(this.$$('employee-work-time-report-table'));
  }

}