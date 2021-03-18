import DocumentJetView from "core/DocumentJetView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";
import {typeSalary} from "models/department/type-salary";

webix.ui.datafilter.countColumn = webix.extend({
  refresh: function (master, node, value) {
    var result = 0;
    master.data.each(function (obj) {
      if (obj.$group) return;
      result++;
    });
    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);

export default class DocumentSalaryAccrualView extends DocumentJetView{
  constructor(app, name, record){
    let css = {"color": "green", "text-align": "right", "font-weight": 100};
    let cssNumber = {"text-align": "right"};
    let id = (record) ? +record.id : 0;
    super(app, name, {
      url: app.config.apiRest.getUrl('get',"accounting/document-salary-accruals", {'filter':'{"list_id":'+id+'}', 'per-page':'-1'}),
      //save: "api->accounting/document-salary-accruals",
      columns:[
        { id:"employee_name", header:[ "Сотрудник",  { content:"countColumn" } ], width: 240, sort: "string", template: function(obj, common) {
            if (obj.$group) return common.treetable(obj, common) + obj.department_name;
            return common.treetable(obj, common)+obj.employee_name;
        } },

        { id:"employee_id", header:[ "ID",  "" ], width: 30, sort: "string", hidden: true },

        { id:"is_piecework", header:[ "Тип",  "" ], width: 70, sort: "string", type:'select', collection: typeSalary },
        { id:"rate", header:[ "Ставка",  "" ], width: 80, sort: "string", editor:"text", format: webix.Number.format, "css": css },
        { id:"rate_day", header:[ "Ставка за день",  "" ], width: 120, sort: "string",  format: webix.Number.format, "css": cssNumber,editor:"text"

        },
        { id:"all_time_days", header:[ "Рабочих дней",  { content:"summColumn" } ],  width: 110, sort: "string",  format: webix.Number.format, "css": cssNumber, editor:"text" },
        { id:"work_time_days", header:[ "Дни посещения",  { content:"summColumn" } ],  width: 120, sort: "string",  format: webix.Number.format, "css": cssNumber },
        { id:"work_time_hours", header:[ "Дни по часам",  { content:"summColumn" } ],  width: 110, sort: "string",  format: webix.Number.format, "css": cssNumber, editor:"text" },
        { id:"salary_rate", header:[ "ЗП по ставке",  { content:"summColumn" } ], width: 100, sort: "string",   math:"[$r,work_time_hours]*[$r,rate_day]", format: webix.Number.format, "css": cssNumber },
        { id:"salary_piecework", header:[ "ЗП по сдельно",  { content:"summColumn" } ], width: 110, sort: "string", editor:"text", format: webix.Number.format,"css": css },
        { id:"award", header:[ "Премия",  { content:"summColumn" } ],  width: 100, sort: "string", editor:"text", format: webix.Number.format,"css": css },
        { id:"surcharges", header:[ "Доп./Выч.",  { content:"summColumn" } ], width: 120, sort: "string",  editor:"text", format: webix.Number.format, "css": css },
        { "fillspace": true},
        { id:"salary",  width: 100, sort: "string", math:"[$r,salary_rate] + [$r,award]+ [$r,surcharges] +[$r,salary_piecework]" ,
          format: webix.Number.format, "css": cssNumber, header:[ "К выплате",  { content:"summColumn" } ]},
        {
          "id": "action-delete",
          "header": "",
          "width": 50,
          "template": function(obj, common) {
            if (obj.$group) return '';
            return common.trashIcon()
          }
        },
        {"id": "action-refresh", "header": "", "width": 50, "template": function(obj) {
          if (obj.$group) return '';
          return "<i class='mdi mdi-refresh' style='font-size: 18px'></i>";
        }}
      ],
      scheme:{
        $group:{
          by:function(obj){ return obj.department_name}, // 'company' is the name of a data property
          map:{
            department_name:["department_name"],
            employee_name:["employee_name"],
            index : ["index"],
            salary: ["salary", "sum"]
          }
        },
        $sort:[{ by:"department_name", dir:"asc", as: "string" }, { by:"employee_name", dir:"asc", as: "string" }],
        //$init:function(obj){ obj.index = this.count(); }
      },


    });
  }

  clickActionRefresh(id, item) {
    let employee = this.getRoot().getItem(id.row);
    this.getParentView().getParentView().doClickFillAll(employee.employee_id);
  }

}