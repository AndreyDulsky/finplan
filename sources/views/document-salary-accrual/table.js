import {ApiRest} from "models/restModel";
let restObj = new ApiRest();
const documentSalaryAccrualTable = {
  view: "datatable",
  localId: "document-salary-accrual-table",
  //urlEdit: 'time-work',
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
    { id:"employee_id", header:"ID", width: 30, sort: "string" },
    { id:"employee_name", header:"Сотрудник", width: 180, sort: "string" },
    { id:"is_piecework", header:"Тип", width: 40, sort: "string" },
    //{ id:"sum_start_month", header:"Долг на начало", width: 100, sort: "string" },
    { id:"rate", header:"Ставка", width: 80, sort: "string" },
    { id:"rate_day", header:"Ставка за день", width: 100, sort: "string" },
    { id:"work_time_days", header:"Дни посещения", width: 100, sort: "string" },
    { id:"work_time_hours", header:"Дни по часам", width: 100, sort: "string" },
    { id:"salary_rate", header:"ЗП по ставке", width: 100, sort: "string" },
    { id:"salary_piecework", header:"ЗП по сдельно", width: 100, sort: "string" },
    { id:"award", header:"Премия", width: 100, sort: "string" },
    { id:"surcharges", header:"Доп./Выч.", width: 100, sort: "string" },
    { id:"salary", header:"К выплате", width: 100, sort: "string" },
    //{ id:"paid_out", header:"Выплачено", width: 100, sort: "string" },
    //{ id:"paid_out_month", header:"Выпл-но за месяц", width: 100, sort: "string" },
    //{ id:"debt_prev_month", header:"Долг с прош. месяца", width: 100, sort: "string" },
    //{ id:"remainder", header:"Остаток", width: 80, sort: "string" }
  ],
  url: restObj.getUrl('get',"accounting/employee-time-work/visits", {'sort':'name'}),//"api->accounting/contragents",
  //save: "api->accounting/employee-time-works",
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
};  // { "someview" : SomeViewClass }
export default documentSalaryAccrualTable;