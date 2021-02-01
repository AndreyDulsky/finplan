import DocumentJetView from "core/DocumentJetView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class DocumentSalaryAccrualView extends DocumentJetView{
  constructor(app, name, record){
    let css = {"color": "green", "text-align": "right", "font-weight": 100};
    let cssNumber = {"text-align": "right"};
    let id = (record) ? +record.id : 0;
    super(app, name, {
      url: app.config.apiRest.getUrl('get',"accounting/document-salary-accruals", {'filter':'{"list_id":'+id+'}'}),
      //save: "api->accounting/document-salary-accruals",
      columns:[
        { id:"index", header:"#", sort:"int", width:50},
        { id:"employee_id", header:"ID", width: 30, sort: "string", hidden: true },
        { id:"employee_name", header:"Сотрудник", width: 180, sort: "string" },
        { id:"is_piecework", header:"Тип", width: 70, sort: "string", type:'select', collection: [{id:'0',value:'Вр. 22'}, {id:'1', value:'Сд.'}, {id:'2', value:'Вр. полн.'}] },
        { id:"rate", header:"Ставка", width: 80, sort: "string", editor:"text", format: webix.Number.format, "css": css },
        { id:"rate_day", header:"Ставка за день", width: 120, sort: "string",  format: webix.Number.format, "css": cssNumber

        },
        { id:"all_time_days", header:"Рабочих дней", width: 110, sort: "string",  format: webix.Number.format, "css": cssNumber },
        { id:"work_time_days", header:"Дни посещения", width: 120, sort: "string",  format: webix.Number.format, "css": cssNumber },
        { id:"work_time_hours", header:"Дни по часам", width: 110, sort: "string",  format: webix.Number.format, "css": cssNumber },
        { id:"salary_rate", header:"ЗП по ставке", width: 100, sort: "string",   math:"[$r,work_time_hours]*[$r,rate_day]", format: webix.Number.format, "css": cssNumber },
        { id:"salary_piecework", header:"ЗП по сдельно", width: 110, sort: "string", editor:"text", format: webix.Number.format,"css": css },
        { id:"award", header:"Премия", width: 100, sort: "string", editor:"text", format: webix.Number.format,"css": css },
        { id:"surcharges", header:"Доп./Выч.", width: 120, sort: "string",  editor:"text", format: webix.Number.format, "css": css },
        { "fillspace": true},
        { id:"salary", header:"К выплате", width: 100, sort: "string", math:"[$r,salary_rate] + [$r,award]+ [$r,surcharges]" , format: webix.Number.format, "css": cssNumber},
        {
          "id": "action-delete",
          "header": "",
          "width": 50,
          "template": "{common.trashIcon()}"
        },
        {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
      ],
    });
  }

}