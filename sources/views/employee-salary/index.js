import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
//import {departments} from "models/department/departments";
//import {typeSalary} from "models/department/type-salary";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


webix.ui.datafilter.totalColumn = webix.extend({
  refresh: function (master, node, value) {
    var result = 0, _val;
    master.data.each(function (obj) {
      if (obj.$group) return;

      _val = obj[value.columnId];
      if (value.columnId == 'coefMoney') {
        _val = obj.G/7860;
      }
      if (_val !== null) {
        if (_val!= 0) {
          _val = _val.toString().replace(".",",");
        }
        _val = webix.Number.parse(_val, {
          decimalSize: 2, groupSize: 3,
          decimalDelimiter: ",", groupDelimiter: ""
        });
      }
      _val =  parseFloat(_val);
      if (!isNaN(_val)) result = result+_val;
    });
    result = webix.i18n.numberFormat(result,{
      groupDelimiter:"`",
      groupSize:3,
      decimalDelimiter:",",
      decimalSize:0
    })
    if (value.format)
      result = value.format(result);
    if (value.template)
      result = value.template({ value: result });
    node.style.textAlign = "right";
    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);

let numberFormat = webix.Number.numToStr({
  groupDelimiter:"",
  groupSize:3,
  decimalDelimiter:".",
  decimalSize:0
});

let cssFormat = {'text-align' : 'right'};
let cssFormatGreen = {'text-align' : 'right', 'color': 'green'};
let cssFormatRed = {'text-align' : 'right', 'color': 'red'};

webix.Date.monthEnd = function(obj){
  //obj = webix.Date.weekStart(obj);
  obj = webix.Date.add(obj, 1, "month");
  //obj = webix.Date.weekStart(obj);
  obj = webix.Date.add(obj, -1, "minute");
  return obj;
}

export default class EmployeeSalaryView extends JetView{
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
                  "label": "Зарплата по сотрудникам",
                  "width": 190
                },
                {
                  view:"datepicker",
                  localId: 'dateFrom',
                  inputWidth:150,
                  label: 'с',
                  labelWidth:30,
                  width:160,
                  value: webix.Date.monthStart(new Date())
                },
                {
                  view:"datepicker",
                  localId: 'dateTo',
                  inputWidth:150,
                  label: 'по',
                  labelWidth:30,
                  width:160,
                  value: webix.Date.monthEnd(webix.Date.monthStart(new Date()))
                },
                {
                  view:"icon",
                  //type:"icon",
                  icon: 'mdi mdi-refresh',
                  autowidth:true,
                  value :true,
                  click: function() { scope.doRefresh() }

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

                {},
                {
                  view:"toggle",
                  type:"icon",
                  icon: 'mdi mdi-file-tree',
                  autowidth:true,
                  value :true,
                  click: function() { scope.doClickOpenAll() }

                },

              ]
            },
            {
              view: "treetable",
              localId: "employee-table",
              urlEdit: 'employee',
              //autoConfig: true,
              css:"webix_header_border webix_data_border",
              leftSplit:1,
              //rightSplit:2,
              select: true,
              resizeColumn: { headerOnly:true },
              math: true,
              editable:true,
              editaction: "dblclick",
              columns:[
                { id:"department_name", header:"Сотрудник", width: 240,
                  template:function(obj, common) {
                    if (obj.$group) return common.treetable(obj, common) + obj.department_name;
                    return common.treetable(obj, common)+obj.employee_name;
                  },
                },
                { id:"status", header:"Статус", width: 70, sort: "string", collection: [{'id':'0',"value":'Уволен'},{'id':'1',"value":'Работает'}] },
                //{ id:"name", header:"Наиименование", width: 280, sort: "string" },
                //{ id:"name", header:"Наиименование", width: 280, sort: "string" },
                //{ id:"rate", header:"Ставка", width: 180, sort: "string" },
                //{ id:"is_piecework", header:"Тип зарплаты", width: 180, sort: "string", type:'select',collection: typeSalary },
                //{ id:"bitrix_id", header:"ID битрикс", width: 120, sort: "string", edit: 'text' },
                //{ id:"category_id", header:"ID статьи выплат", width: 120, sort: "string", edit: 'text' },

                {"id": "action-view", "header": "", "width": 50, "template": "<i class='mdi mdi-eye'></i>"},
                { id:"dept_start_month", header:["Долг",{ content:"totalColumn" }], width: 75, sort: "string",
                  css: cssFormat
                },

                { id:"rate", header:["Ставка",""], width: 70, sort: "string",
                  css: cssFormat,
                },
                { id:"rate_day",header:["За день",""], width: 70, sort: "string",
                  css: cssFormat,
                  numberFormat:"1111.00"
                },
                { id:"all_time_days",header:["Дней.раб.",{ content:"totalColumn" }], width: 70, sort: "string",
                  css: cssFormat,
                },
                { id:"work_time_days", header:["Дни",{ content:"totalColumn" }], width: 70, sort: "string",
                  css: cssFormat,
                },
                { id:"work_time_hours", header:["Дни.по.ч.",{ content:"totalColumn" }], width: 70, sort: "string",
                  css: cssFormat,
                  numberFormat:"1111.00"
                },
                { id:"salary_rate", header:["ЗП.врем.",{ content:"totalColumn" }], width: 70, sort: "string",
                  css: cssFormat,
                },
                { id:"salary_piecework", header:["ЗП.Выраб.",{ content:"totalColumn" }], width: 70, sort: "string",
                  css: cssFormat,
                },

                { id:"award", header:["Премия",{ content:"totalColumn" }], width: 70, sort: "string",
                  css: cssFormat,
                },
                { id:"surcharges",header:["Доп/Выч.",{ content:"totalColumn" }], width: 70, sort: "string",
                  css: cssFormat,
                },
                { id:"salary",header:["Итого",{ content:"totalColumn" }], width: 75, sort: "string",
                  css: cssFormatGreen,
                },
                { id:"transaction_sum",  header:["Оплаты",{ content:"totalColumn" }], width: 75, sort: "string",
                  css: cssFormatRed,
                },
                { id:"remainder", header:["Остаток",{ content:"totalColumn" }], width: 75, sort: "string",
                  css: cssFormat,
                },
                { id:"pay_plan_1", header:["План 1",{ content:"totalColumn" }], width: 75, sort: "string",
                  css: cssFormat, editor: 'text'
                },
                { id:"pay_plan_2", header:["План 2",{ content:"totalColumn" }], width: 75, sort: "string",
                  css: cssFormat, editor: 'text'
                },
                { id:"pay_plan_3", header:["План 3",{ content:"totalColumn" }], width: 75, sort: "string",
                  css: cssFormat, editor: 'text'
                },
                { id:"pay_plan_4", header:["План карта",{ content:"totalColumn" }], width: 75, sort: "string",
                  css: cssFormat, editor: 'text'
                },

              ],
              // url: this.app.config.apiRest.getUrl('get',"accounting/employee-salaries", {
              //   'sort':'employee_name',
              //   'per-page': -1,
              //   'expand' : 'employee,documentSalaryAccrual,transactionPart',
              //   'filter' : '{"date_salary":{">=":"2021-03-01","<":"2021-04-01"}}'
              //
              // }),
              save: "api->accounting/employee-salaries",

              scheme: {
                $group: {
                  by: 'department_name',
                  map: {
                    'department_name' : ['department_name'],
                    'employee_name' : ['employee_name'],
                    'department_id' : ['department_id'],
                    'remainder' : ['remainder','sum'],
                    'pay_plan_1' : ['pay_plan_1','sum'],
                    'pay_plan_2' : ['pay_plan_2','sum'],
                    'pay_plan_3' : ['pay_plan_3','sum'],
                    'pay_plan_4' : ['pay_plan_4','sum'],


                    'salary' : ['salary','sum'],
                    'transaction_sum' : ['transaction_sum','sum'],
                    'dept_start_month' : ['dept_start_month','sum'],
                    'surcharges' : ['surcharges','sum'],
                    'award' : ['award','sum'],
                    'salary_piecework' : ['salary_piecework','sum'],
                    'salary_rate' : ['salary_rate','sum'],
                    'work_time_hours' : ['work_time_hours','sum'],
                    'work_time_days' : ['work_time_days','sum'],
                    'all_time_days' : ['all_time_days','sum'],


                  }
                },

                $sort:{ by:"department_id", dir:"asc", as:"int" },
              },
              ready:function(){
                //this.openAll();
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
                  if (id.column == 'action-view') {
                    //this.$scope.cashEdit.showForm(this);
                    let item = this.getItem(id.row);
                    scope.app.show("/top/employee-details?id="+item.employee_id+'&name='+item.employee_name);
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
    webix.extend(table, webix.ProgressBar);

    scope.doRefresh();

    form.attachEvent("onChange", function(obj){
      let filter = {'search':form.getValue()};
      let objFilter = { filter: filter };



      table.clearAll(true);
      table.showProgress({
        delay:2000,
        hide:false
      });
      scope.doRefresh();
    });

    this.$$("dateFrom").attachEvent("onChange", function(obj){
      table.showProgress({
        delay:2000,
        hide:false
      });
      scope.doRefresh();
    });

    this.$$("dateTo").attachEvent("onChange", function(obj){
      table.showProgress({
        delay:2000,
        hide:false
      });
      scope.doRefresh();
    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  doRefresh() {

    let table = this.$$("employee-table");
    let form = this.$$("form-search");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    this.restApi = this.app.config.apiRest;

    let objFilter = {};

    objFilter = {
      'sort':'employee_name',
      'per-page': -1,
      'expand' : 'employee,documentSalaryAccrual,transactionPart',
      'filter' : {'date_salary' : {'>=' : dateFromValue, '<=':dateToValue}}
    };

    if (form.getValue() != "") {
      objFilter['filter']['employee_name'] =form.getValue();
    }



    let tableUrl = this.restApi.getUrl('get',"accounting/employee-salaries");
    let scope =this;
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.restApi.getLoad(tableUrl,objFilter).then(function(data){
      table.clearAll();
      table.parse(data.json());
      table.enable();
    });


  }



  doAddClick() {
    this.$$('employee-table').unselect();
    this.cashEdit.showForm(this.$$('employee-table'));
  }

  doClickOpenAll() {
    let table = this.$$("employee-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }
  doClickToExcel() {
    let table = this.$$("employee-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    webix.toExcel(table, {
      filename: "salary_"+dateFromValue,
      styles: false,

    });

  }

}