import {JetView} from "webix-jet";
import {cloths} from "models/transaction/cloths";
import {productBed} from "models/transaction/product-bed";
import "components/comboClose";

webix.GroupMethods.median = function(prop, data){
  if (!data.length) return 0;
  var summ = 0;
  for (var i = data.length - 1; i >= 0; i--) {

    if (data[i].$level == 1 ) {
      let per =prop(data[i]);
      if (per!="") {
        //debugger;

        //per = parseFloat(per);
        if (per !== null) per = per.replace(".",",");
        per = webix.Number.parse(per, {
          decimalSize: 2, groupSize: 3,
          decimalDelimiter: ",", groupDelimiter: ""
        });
        if (!isNaN(per)) {
          summ += per * 1;
        }
      }

    }
  }
  return webix.i18n.numberFormat(summ,{
    groupDelimiter:",",
    groupSize:3,
    decimalDelimiter:".",
    decimalSize:2
  });
};

webix.GroupMethods.middleCoefMat = function(prop, data){
  if (!data.length) return 0;
  var summ = 0;
  var count = 0;
  var summCost = 0;
  var res =0;
  for (var i = data.length - 1; i >= 0; i--) {

    if (data[i].$level == 1 ) {
      //debugger;
      let per =data[i].expense_mat;
      let cost = data[i].V;
      if (per!="" ) {
        //debugger;

        //per = parseFloat(per);
        if (per !== null) per = per.replace(".",",");
        per = webix.Number.parse(per, {
          decimalSize: 2, groupSize: 3,
          decimalDelimiter: ",", groupDelimiter: ""
        });
        if (!isNaN(per) && !isNaN(cost)) {
          summ += per * 1;
          summCost += cost*1;
        }
      }
      count++;
    }
  }
  if (summCost != 0) {
    res = summ/summCost;
  }
  return webix.i18n.numberFormat(res,{
    groupDelimiter:",",
    groupSize:3,
    decimalDelimiter:".",
    decimalSize:2
  });
};



webix.ui.datafilter.totalColumnCoefMat = webix.extend({
  refresh: function (master, node, value) {
    var result = 0, _val;
    var resultCost = 0, _cost;
    var res =0;
    master.data.each(function (obj) {
      if (obj.$group) return;


      _val = obj['expense_mat'];
      _cost = obj['V'];

      //debugger;
      if (_val !== null && _cost != '0') {
        if (_val != 0) {
          _val = _val.toString().replace(".", ",");
        }
        _val = webix.Number.parse(_val, {
          decimalSize: 2, groupSize: 3,
          decimalDelimiter: ",", groupDelimiter: ""
        });

        _val = parseFloat(_val);
        if (!isNaN(_val)) result = result + _val * 1;
        resultCost = resultCost + _cost * 1;
      }
    });
    if (resultCost !=0) {
      res = result/resultCost;
    }
    result = webix.i18n.numberFormat(res,{
      groupDelimiter:"`",
      groupSize:3,
      decimalDelimiter:",",
      decimalSize:2
    })
    if (value.format)
      result = value.format(result);
    if (value.template)
      result = value.template({ value: result });
    //node.firstChild.style.textAlign = "right";
    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);

webix.GroupMethods.countValue = function(prop, data){
  if (!data.length) return 0;
  var count = 0;
  for (var i = data.length - 1; i >= 0; i--) {

    if (data[i].$level == 1 ) {
      let per =parseInt(prop(data[i]));
      if (!isNaN(per)) count = count+1;
    }
  }
  return count;
};





webix.ui.datafilter.totalColumn = webix.extend({
  refresh: function (master, node, value) {
    var result = 0, _val;
    master.data.each(function (obj) {

      if (obj.$group) return;

//debugger;
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
      decimalSize:2
    })
    if (value.format)
      result = value.format(result);
    if (value.template)
      result = value.template({ value: result });
    //node.firstChild.style.textAlign = "right";
    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);

webix.ui.datafilter.totalColumnCount = webix.extend({
  refresh: function (master, node, value) {
    var result = 0, _val;
    master.data.each(function (obj) {
      if (obj.$group) return;

      _val = /*implement your logic*/ parseFloat(obj[value.columnId]);// / obj.OTHER_COL;
      if (!isNaN(_val)) result = result+1;
    });
    result = webix.i18n.numberFormat(result,{
      groupDelimiter:",",
      groupSize:3,
      decimalDelimiter:".",
      decimalSize:0
    })
    if (value.format)
      result = value.format(result);
    if (value.template)
      result = value.template({ value: result });
    //node.firstChild.style.textAlign = "right";
    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);

webix.editors.$popup.text = {
  view:"popup",
  body:{
    view:"textarea",
    width:250,
    height:100
  }
};

// webix.editors.$popup = {
//   date:{
//     view:"popup",
//     body:{
//       view:"calendar",
//       timepicker:true,
//       weekNumber:true,
//       width: 220,
//       height:200
//     }
//   }
// };

webix.Date.monthEnd = function(obj){
  obj = webix.Date.monthStart(obj);
  obj = webix.Date.add(obj, 1, "month");
  obj = webix.Date.monthStart(obj);
  obj = webix.Date.add(obj, -1, "minute");
  return obj;
}

//let formatDate = webix.Date.dateToStr("%d.%m.%y");
//var parserDate = webix.Date.strToDate("%Y-%m-%d");

function mark_old(value){
  if (value == 0)
    return "highlight";
}
let formatDate = webix.Date.dateToStr("%d.%m.%y");
let parserDate = webix.Date.strToDate("%Y-%m-%d");

export default class OrderResultView extends JetView{



  config(){
    let scope = this;
    this.apiRest = this.app.config.apiRest;
    let configColumns = [];
    let url = this.app.config.apiRest.getUrl('get',"accounting/orders",
      {
        "per-page": "500",
        sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"AE":{">=":"01.12.20"}}'
        //filter: '{"AE":{">=":"01.02.20"}}'

      });

    return {
      rows:[
        {
          cols:[
            {"view": "label", width: 200, height:30, template: "Отчет ЗП", css: { 'font-size':'17px', 'padding': '10px 0px 10px 15px', 'font-weight': 600}},
            {

              cols: [
                {width :5},
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
                  value: webix.Date.monthEnd(new Date())
                },
                {}

              ]
            },
            {
              view:"icon",
              //type:"icon",
              icon: 'mdi mdi-refresh',
              autowidth:true,
              value :true,
              click: function() { scope.doRefresh() }

            },
            { view:"icon", icon: 'mdi mdi-printer', autowidth:true, click: () =>  this.doClickPrint()},
            { view:"icon", icon: 'mdi mdi-microsoft-excel', autowidth:true, click: () =>  this.doClickToExcel()},

            {
              view:"toggle",
              type:"icon",
              icon: 'mdi mdi-file-tree',
              autowidth:true,
              value :true,
              click: function() { scope.doClickOpenAll() }

            },
            {
              view: "combo-close",
              localId: "employees",
              //labelWidth: 100,
              width: 250,

              options: {data : scope.apiRest.getCollection('accounting/employees',{'per-page': -1})}
            },
            { view:"select",  value:1, labelWidth:100,
              localId: "select-type",
              options:[
              { id:1, value:"Обивка" },
              { id:2, value:"Столярка" },
              { id:3, value:"Пошив+крой" },
              { id:4, value:"Крой" }
              
            ],
              width: 200,
              on:{
                onChange:function(newv){
                  scope.showBatch(newv);
                }
              }
            },
            {
              view:"icon",
              //type:"icon",
              icon: 'mdi mdi-tools',
              autowidth:true,
              popup: {
                view: 'contextmenu',
                scroll: 'y',
                width: 200,
                height: 550,
                autoheight:false,
                localId: 'columns-setting',
                data: [
                  { value: 'Profile', href: '#profile' },
                  { value: 'Settings', href: '#settings' },
                  { value: 'Dummy' },
                  { id: 'logout', value: 'Logout' },
                ],
                $init: function() {
                  scope.loadColumnsSetting(this, null);
                },
                on: {

                  onMenuItemClick(id) {
                    scope.columnSettingClick(this, id);
                  }
                }
              }

            },
          ]
        },
        /*wjet::Settings*/
        {
          view:"treetable",
          css:"webix_header_border webix_data_border",
          leftSplit:1,
          //rightSplit:2,
          select: "row",
          resizeColumn: { headerOnly:true },
          localId: 'report-salary-table',
          //subrow:"#N#",
          multiselect:true,
          drag:true,
          fixedRowHeight:false, //rowLineHeight:25, rowHeight:25,
          editable:true,
          visibleBatch:1,
          editaction: "dblclick",
          dragColumn:true,
          sort:"multi",
          headermenu:true,
          //autoConfig:true,
          tooltip:true,

          columns:[

            // {
            //   id:"id", header:"#", hidden: true
            // },

            {
              id:"A", header:[ "# заказа", { content:"textFilter" },"" ],	width:70, "sort": "date",

              tooltip:"#F# <br>#C#-#D# Дата клиента: #H# <br>#E#<br> #I#<br> #L# - Статус ткани: #M# Дата ткани: #K#<br>#N# #O# #P# #Q# #R# #T#",
              template:function(obj, common){
                let type = scope.$$("select-type").getValue();
                let result;
                result = (type != 1 ) ?  formatDate(parserDate(obj.value)) : obj.value;
                if (obj.$level==1) return  result;
                //if (obj.$level == 2) return common.treetable(obj, common) + obj.A;
                //if (obj.$group) return common.treetable(obj,common) + (obj.value || obj.item);
                return obj.A;
              },
              "css": {"color": "black", "text-align": "right", "font-weight": 500}
            },
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:100, editor:"text", hidden: false  },
            { id:"I", header:[ "Изделие", { content:"textFilter" }, "" ], width:230, editor:"text", hidden: false },
            { id:"product_id", header:[ "Изделие", { content:"textFilter" }, "" ], width:200,
              editor: 'combo', options: productBed
            },
            //{ id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, editor:"text", "sort": "string", hidden: true},

            { id:"size", header:[ "Размер", { content:"selectFilter" }, { content:"totalColumnCount" } ],
              width:70,
              "css": {"text-align": "center"},
              editor:"text" },

            // { id:"V", header:[ "Сумма факт", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:100,
            //   "css": {"color": "green", "text-align": "right",  "font-weight": 500}
            // },

            // { id:"coef_sewing", header:[ "Коэф. Пош. гот.", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:120,
            //   "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:3
            // },
            { id:"cost_ot", header:[ "Раб. отстр.", { content:"selectFilter" }, { content:"totalColumn" } ], width:100,
              "css": {"color": "green", "text-align": "right"}, batch:3
              // "template" : function(data) {
              //   return  (data.productWorkSalary) ? data.productWorkSalary.cost_sewing : '';
              // }
            },
            // { id:"coef_cut", header:[ "Коэф. Крой. гот.", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:120,
            //   "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:4
            // },


            // { id:"cost_work", header:[ "Стоим. работ", { content:"selectFilter" }, { content:"totalColumn" } ], width:110,
            //   "css": {"color": "green", "text-align": "right",  "font-weight": 600},
            // },
            { id:"cost_cut_total_employee", header:[ "Итого крой", { content:"selectFilter" }, { content:"totalColumn" } ], width:100, batch:4,
              "css": {"color": "green", "text-align": "right"},
              // "template" : function(data) {
              //     return  (data.productWorkSalary) ? data.productWorkSalary.cost_cut : '';
              // }
            },
            { id:"cost_cut_employee", header:[ "Раб. крой", { content:"selectFilter" }, { content:"totalColumn" } ], width:100, batch:4,
              "css": {"color": "green", "text-align": "right"},
              // "template" : function(data) {
              //     return  (data.productWorkSalary) ? data.productWorkSalary.cost_cut : '';
              // }
            },
            { id:"cost_cut_coef_employee", header:[ "Коэф. крой", { content:"selectFilter" }, "" ], width:100, batch:4,
              "css": {"color": "green", "text-align": "right"}
            },

            { id:"BY", header:[ "Настил", { content:"selectFilter" }, { content:"totalColumn" } ], width:100, batch:4,
              "css": {"color": "green", "text-align": "right"},
              // "template" : function(data) {
              //     return  (data.productWorkSalary) ? data.productWorkSalary.cost_cut : '';
              // }
            },
            { id:"cost_cut_additionally", header:[ "Доп.крой.", { content:"numberFilter" }, "" ],  width:115 , editor:"text", batch:4},


            { id:"cost_sewing", header:[ "Раб. пошив", { content:"selectFilter" }, { content:"totalColumn" } ], width:100, batch:3,
              "css": {"color": "green", "text-align": "right"},
              // "template" : function(data) {
              //   return  (data.productWorkSalary) ? data.productWorkSalary.cost_sewing : '';
              // }
            },
            { id:"cost_sewing_additionally", header:[ "Доп.шв.", { content:"numberFilter" }, "" ],  width:115 , editor:"text", batch:3},

            { id:"cost_work_carpenter_employee", header:[ "Итого ст.", { content:"numberFilter" },  { content:"totalColumn" } ], width:110,  batch:2,
              "css": {"color": "green", "text-align": "right"},
              //math:"[$r,cost_carpenter_carcass_employee]+[$r,cost_carpenter_headboard_employee]+[$r,cost_carpenter_grinding_employee]+[$r,cost_carpenter_additionally]"
            }
            ,
            { id:"cost_carpenter_carcass_employee", header:[ "Ст.цар.", { content:"numberFilter" }, "" ], width:100,  batch:2,
              "css": {"color": "green", "text-align": "right"},

            },
            { id:"cost_carpenter_headboard_employee", header:[ "Ст.изг.", { content:"numberFilter" }, "" ], width:100, batch:2,
              "css": {"color": "green", "text-align": "right"},

            },
            { id:"cost_carpenter_grinding_employee", header:[ "Ст.шлиф.", { content:"numberFilter" }, "" ], width:110, batch:2,
              "css": {"color": "green", "text-align": "right"},
            },
            { id:"cost_carpenter_not_standard_employee", header:[ "Ст.нест.", { content:"numberFilter" }, "" ], width:110, batch:2,
              "css": {"color": "green", "text-align": "right"},
            },
            { id:"cost_carpenter_additionally", header:[ "Доп.ст.", { content:"numberFilter" }, "" ],  width:115 , editor:"text", batch:2,
              "css": { "text-align": "right"}
            },


            //status button
            { id:"O", header:[ "Пугов.", { content:"selectFilter" }, "" ], width:80,  batch:1},

            { id:"cost_work_upholstery_employee", header:[ "Итого об.", { content:"numberFilter" },  { content:"totalColumn" } ], width:100,  batch:1,
              "css": {"color": "green", "text-align": "right"}
            },

            // price upholstery

            { id:"cost_rubber_carcass_employee", header:[ "Пор.цар.", { content:"numberFilter" }, "" ], width:40,  batch:1,
              "css": {"color": "green", "text-align": "right"},

            },
            { id:"cost_rubber_headboard_employee", header:[ "Пор.изг.", { content:"numberFilter" }, "" ], width:40,  batch:1,
              "css": {"color": "green", "text-align": "right"},

            },
            { id:"cost_upholstery_carcass_employee", header:[ "Об.цар.", { content:"numberFilter" }, "" ], width:40,  batch:1,
              "css": {"color": "green", "text-align": "right"},

            },
            { id:"cost_upholstery_headboard_employee", header:[ "Об.изг.", { content:"numberFilter" }, "" ], width:40,  batch:1,
              "css": {"color": "green", "text-align": "right"},

            },
            { id:"cost_buttons_employee", header:[ "Об.пуг.", { content:"numberFilter" }, "" ], width:40,  batch:1,
              "css": {"color": "green", "text-align": "right"},

            },

            { id:"cost_upholstery_additionally", header:[ "Доп.об.", { content:"numberFilter" }, "" ],  width:115 , editor:"text", batch:1,
              "css": {"text-align": "right"}
            },
            // { id:"cost_matras_employee", header:[ "Раб. об. мат.", { content:"selectFilter" }, "" ], width:60,  batch:1,
            //   "css": {"color": "green", "text-align": "right"},
            //
            // },


            //status upholstery rubber_carcas
            { id:"AU", header:[ "ФИО пор.царг", { content:"selectFilter" }, "" ], width:110,  batch:1, editor:"text"},
            { id:"AV", header:[ "Статус пор.царг", { content:"selectFilter" }, "" ], width:50,  batch:1, editor:"text"},
            { id:"AW", header:[ "Дата пор.царг", { content:"selectFilter" }, "" ], width:100,  batch:1, editor:"text"},
            //status upholstery rubber_headboard
            { id:"AP", header:[ "ФИО пор.изг", { content:"selectFilter" }, "" ], width:110,  batch:1, editor:"text"},
            { id:"AQ", header:[ "Статус пор.изг", { content:"selectFilter" }, "" ], width:50,  batch:1, editor:"text"},
            { id:"AR", header:[ "Дата пор.изг", { content:"selectFilter" }, "" ], width:100,  batch:1, editor:"text"},

            //status upholstery upholstery_carcass
            { id:"AK", header:[ "ФИО об.царг", { content:"selectFilter" }, "" ], width:110,  batch:1, editor:"text"},
            { id:"AL", header:[ "Статус об.царг", { content:"selectFilter" }, "" ], width:50,  batch:1, editor:"text"},
            { id:"AM", header:[ "Дата об.царг", { content:"selectFilter" }, "" ], width:100,  batch:1, editor:"text"},

            //status upholstery upholstery_headboard
            //{ id:"Z", header:[ "ФИО об.изг", { content:"selectFilter" }, "" ], width:110,  batch:1
            //},
            //{ id:"W", header:[ "Статус об.изг", { content:"selectFilter" }, "" ], width:110,  batch:1
            //},
            //{ id:"AE", header:[ "Дата об.изг", { content:"selectFilter" }, "" ], width:100,  batch:1
            //},




             { id:"Z", header:[ "Обивщик", { content:"selectFilter" }, "" ], width:100, editor:"text" , batch:1},


             { id:"AZ", header:[ "Столярка ФИО", { content:"selectFilter" }, "" ],  width:115 , editor:"text", batch:2},
            // { id:"BO", header:[ "Пошив ФИО", { content:"selectFilter" }, "" ],  width:115 , batch:1, editor:"text", batch:3},
            // { id:"BV", header:[ "Крой ФИО", { content:"selectFilter" }, "" ], width:115 ,  editor:"text", batch:4},
            //
            // { id:"BQ", header:[ "Дата пош.", { content:"selectFilter" }, "" ], width:90, batch:3, editor:"text" },
            // { id:"BX", header:[ "Дата крой.", { content:"selectFilter" }, "" ], width:90, batch:4, editor:"text" },
            //
            // { id:"AE", header:[ "Дата обив.", { content:"selectFilter" }, "" ], width:60,  editor:"text", batch:1 },
            //
            // { id:"BB", header:[ "Дата ст.", { content:"selectFilter" }, "" ], width:90 , editor:"text", batch:2},





          ],
          showColumnBatch:function(batch, mode){

            var preserve = typeof mode != "undefined";
            mode = mode !== false;

            this.eachColumn(function(id, col){
              if(col.batch){
                var batches = [col.batch];
                if(col.batch instanceof Array){
                  batches = col.batch;
                }
                var hidden = this.isColumnVisible(col.id);
                if (!mode) hidden = !hidden;

                if(batches.indexOf(batch) > -1 && hidden)
                  this.hideColumn(col.id, !mode, true);
                else if(!preserve && batches.indexOf(batch) == -1 && !hidden)
                  this.hideColumn(col.id, mode, true);
              }
            }, true);

            this._refresh_columns();
          },
          save: "api->accounting/orders",
          scheme:{
            $init:function(item) {
              if (!item.product_id)
                item.$css = "highlight";

            }
          },
          ready:function(){

            scope.configColumns = this.config.columns;//JSON.parse(JSON.stringify(this.config.columns));
            let state = webix.storage.local.get("report-salary-table");
            if (state)
              this.setState(state);
            //this.openAll();
          },
          scroll: true,

          on: {
            "onColumnResize" : function() {

              webix.storage.local.put("report-salary-table", this.getState());
            },
            "onAfterColumnDrop" : function() {
              webix.storage.local.put("report-salary-table", this.getState());

            },
            "onAfterColumnShow" : function() {
              //webix.storage.local.put("report-salary-table", this.getState());
            },

            "onresize":webix.once(function(){
              //this.adjustRowHeight("T", true);
            }),
            onBeforeLoad:function(){
              this.showOverlay("Loading...");
            },
            onAfterLoad:function(){
              this.hideOverlay();
            },
            onBeforeDrop:function(context, e){


            }
          }

        }
      ]
    }
  }

  init(view) {
    let table = this.$$("report-salary-table");
    let scope =this;
    this.getDataGroup();
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let employees = this.$$("employees");

    webix.extend(table, webix.ProgressBar);
    dateFrom.attachEvent("onChange", function(id) {
      scope.getDataGroup();

    });

    dateTo.attachEvent("onChange", function(id) {

      scope.getDataGroup();
    });

    employees.attachEvent("onChange", function(value) {

      scope.getDataGroup();
    });
  }

  getDataGroup() {
    let table = this.$$("report-salary-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(dateFrom.getValue());
    let dateToValue = format(dateTo.getValue());
    let employees = this.$$("employees");

    let employee = employees.getText();
    //let typeSelect = this.$$("select-type");
    let type = this.$$("select-type").getValue();
    let selectDate = 'AE';
    let filter = {
      filter: {"AE":{">=":dateFromValue, '<=':dateToValue}}
    };
    if (type == 2) {
      selectDate = 'date_carpenter';
      filter = {
        filter: {"date_carpenter":{">=":dateFromValue, '<=':dateToValue}}
      };

    }
    if (type == 3) {
      selectDate = 'date_sewing';
      filter = {
        filter: {"date_sewing":{">=":dateFromValue, '<=':dateToValue}}
      };
    }
    if (type == 4) {
      selectDate = 'date_cut';
      filter = {
        filter: {"date_cut":{">=":dateFromValue, '<=':dateToValue}}
      };

    }


    let params = {
      //"fields" : 'I,product_id, A,G,V,AO,AA,AB,AG,J,AE,date_carpenter,date_sewing,date_cut,cost_work_upholstery_employee',
      "expand" : 'productWorkSalary, cloth, product',
      "per-page": "1000",
      sort: '[{"property":"'+selectDate+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      //filter: '{"'+selectDate+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    };
    if (employee !== '') {
      let employeeAr = employee.split(' ');
      if (type == 2) {
        filter = {
          filter: {
            "date_carpenter":{">=":dateFromValue, '<=':dateToValue},
            "AZ":employeeAr[0]
          }
        };
      }
      if (type == 1) {
        // filter = {
        //   filter: {
        //     "AE":{">=":dateFromValue, '<=':dateToValue},
        //     "Z":employeeAr[0]
        //   }
        // };
        filter = {
          filter: {
            "or":[
              {"AE":{">=":dateFromValue, '<=':dateToValue}, "AU":employeeAr[0]},
              {"AE":{">=":dateFromValue, '<=':dateToValue}, "AP":employeeAr[0]},
              {"AE":{">=":dateFromValue, '<=':dateToValue}, "AK":employeeAr[0]},
              {"AE":{">=":dateFromValue, '<=':dateToValue}, "Z":employeeAr[0]}
            ]
          }
        };
      }
      if (type == 3) {
        filter = {
          filter: {
            "date_sewing":{">=":dateFromValue, '<=':dateToValue},
            "BO":employeeAr[0]
          }
        };
      }
      if (type == 4) {
        filter = {
          filter: {
            "date_cut":{">=":dateFromValue, '<=':dateToValue},
            "BV":employeeAr[0]
          }
        };
      }
      params['employee'] = employee;
    }

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", params);


    let scope =this;
    webix.ajax().get(tableUrl, filter).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      table.sort([{by:selectDate, dir:"asc"}]);
      table.group({
        by: function(obj){
          let result;
          result = (type != 1 ) ?  formatDate(parserDate(obj[selectDate])) : obj[selectDate];
          return result},
        map:{
          value:[selectDate],
        }
      });
      table.enable();
      table.openAll();
    });
  }

  doRefresh() {
    let table = this.$$("report-salary-table");
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.getDataGroup();

  }

  doClickOpenAll() {
    let table = this.$$("report-salary-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  showBatch(newv){
    webix.storage.local.remove("report-salary-table");
    this.$$("report-salary-table").showColumnBatch(newv);
    let table = this.$$("report-salary-table");
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.getDataGroup();



  }



  loadColumnsSetting(columnsSetting, id) {
    //let columnsSetting = this.$$('columns-setting');
    //debugger;
    let menu = [];
    let iconEyeSlash = 'wxi-eye-slash';
    let iconEye = 'wxi-eye';
    let icon;

    this.configColumns.forEach((element, index) => {
      icon = iconEyeSlash;
      if(this.$$("report-salary-table").isColumnVisible(element.id)) {
        icon = iconEye;
      }

      if (element.id == id) {
        columnsSetting.data[index].icon = 'webix_icon webix_list_icon '+icon;
        //this.configColumns[index].icon = 'webix_icon webix_list_icon '+icon;
        columnsSetting.updatItem(id);
      }

      menu.push({'value' : element.header[0].text, id: element.id, 'icon':'webix_icon webix_list_icon '+icon});
    });

    columnsSetting.data = menu;

    //columnsSetting.refresh();
  }

  columnSettingClick(scope, id) {
    let iconEyeSlash = 'webix_icon webix_list_icon wxi-eye-slash';
    let iconEye = 'webix_icon webix_list_icon wxi-eye';
    let icon = iconEye;

    let grid = this.$$("report-salary-table");
    if(grid.isColumnVisible(id))
      grid.hideColumn(id, {spans:false});
    else
      grid.showColumn(id, {spans:false});

    if(scope.getItem(id).icon == iconEye) {
      icon = iconEyeSlash;
    }
    scope.getItem(id).icon = icon;
    scope.updateItem(id);
    webix.storage.local.put("report-salary-table", grid.getState());
  }

  doClickPrint() {
    let table = this.$$("report-salary-table");

    webix.print(table, { fit:"data"});
  }

  doClickToExcel() {
    let table = this.$$("report-salary-table");
    webix.toExcel(table);
  }
}