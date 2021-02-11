import {JetView} from "webix-jet";
import {cloths} from "models/transaction/cloths";
import {productBed} from "models/transaction/product-bed";

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

let formatDate = webix.Date.dateToStr("%d.%m.%y");
var parserDate = webix.Date.strToDate("%Y-%m-%d");

function mark_old(value){
  if (value == 0)
    return "highlight";
}

export default class OrderResultView extends JetView{



  config(){
    let scope = this;
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
              id:"A", header:[ "# заказа", { content:"textFilter" },"" ],	width:130, "sort": "date",

              tooltip:"#F# <br>#C#-#D# Дата клиента: #H# <br>#E#<br> #I#<br> #L# - Статус ткани: #M# Дата ткани: #K#<br>#N# #O# #P# #Q# #R# #T#",
              template:function(obj, common){

                if (obj.$level==1) return common.treetable(obj, common) + formatDate(obj.value);
                //if (obj.$level == 2) return common.treetable(obj, common) + obj.A;
                //if (obj.$group) return common.treetable(obj,common) + (obj.value || obj.item);
                return obj.A;
              },
              "css": {"color": "black", "text-align": "right", "font-weight": 500}
            },
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, editor:"text", hidden: false  },
            { id:"I", header:[ "Изделие", { content:"textFilter" }, "" ], width:180, editor:"text", hidden: false },
            // { id:"product_id", header:[ "Изделие", { content:"textFilter" }, "" ], width:200,
            //   editor: 'combo', options: productBed
            // },
            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, editor:"text", "sort": "string", hidden: true},

            { id:"size", header:[ "Размер", { content:"selectFilter" }, { content:"totalColumnCount" } ],
              width:70,
              "css": {"text-align": "center"},
              editor:"text" },

            { id:"V", header:[ "Сумма факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}
            },

            { id:"coef_sewing", header:[ "Коэф. Пош. гот.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:3
            },
            { id:"cost_ot", header:[ "Раб. отстр.", { content:"selectFilter" }, { content:"totalColumn" } ], width:100,
              "css": {"color": "green", "text-align": "right"}, batch:3
              // "template" : function(data) {
              //   return  (data.productWorkSalary) ? data.productWorkSalary.cost_sewing : '';
              // }
            },
            { id:"coef_cut", header:[ "Коэф. Крой. гот.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:4
            },


            { id:"cost_work", header:[ "Стоим. работ", { content:"selectFilter" }, { content:"totalColumn" } ], width:110,
              "css": {"color": "green", "text-align": "right",  "font-weight": 600},
            },

            { id:"cost_cut", header:[ "Раб. крой", { content:"selectFilter" }, { content:"totalColumn" } ], width:100, batch:4,
              "css": {"color": "green", "text-align": "right"},
              // "template" : function(data) {
              //     return  (data.productWorkSalary) ? data.productWorkSalary.cost_cut : '';
              // }
            },
            { id:"BY", header:[ "Настил", { content:"selectFilter" }, { content:"totalColumn" } ], width:100, batch:4,
              "css": {"color": "green", "text-align": "right"},
              // "template" : function(data) {
              //     return  (data.productWorkSalary) ? data.productWorkSalary.cost_cut : '';
              // }
            },
            { id:"cost_sewing", header:[ "Раб. пошив", { content:"selectFilter" }, { content:"totalColumn" } ], width:100, batch:3,
              "css": {"color": "green", "text-align": "right"},
              // "template" : function(data) {
              //   return  (data.productWorkSalary) ? data.productWorkSalary.cost_sewing : '';
              // }
            },
            { id:"cost_work_carpenter", header:[ "Раб. столярка", { content:"selectFilter" },  { content:"totalColumn" } ], width:110,  batch:2,
              "css": {"color": "green", "text-align": "right"}
            },
            { id:"cost_carcass", header:[ "Раб. ст. цар.", { content:"selectFilter" }, "" ], width:100,  batch:2,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_carcass != null) ? data.productWorkSalary.cost_carcass : '';
              }
            },
            { id:"cost_headboard", header:[ "Раб. ст. изг.", { content:"selectFilter" }, "" ], width:100, batch:2,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_headboard != null) ? data.productWorkSalary.cost_headboard : '';
              }
            },
            { id:"cost_grinding", header:[ "Раб. ст. шлиф.", { content:"selectFilter" }, "" ], width:110, batch:2,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_grinding != null) ? data.productWorkSalary.cost_grinding : '';
              }
            },
            { id:"cost_work_upholstery", header:[ "Раб. обивка", { content:"selectFilter" },  { content:"totalColumn" } ], width:110,  batch:1,
              "css": {"color": "green", "text-align": "right"}
            },
            { id:"cost_rubber_carcass", header:[ "Раб. пор. цар.", { content:"selectFilter" }, "" ], width:110,  batch:1,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_rubber_carcass != null) ? data.productWorkSalary.cost_rubber_carcass : '';
              }
            },
            { id:"cost_rubber_headboard", header:[ "Раб. пор. изг.", { content:"selectFilter" }, "" ], width:110,  batch:1,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_rubber_headboard != null) ? data.productWorkSalary.cost_rubber_headboard : '';
              }
            },
            { id:"cost_upholstery_carcass", header:[ "Раб. об. цар.", { content:"selectFilter" }, "" ], width:100,  batch:1,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_upholstery_carcass != null) ? data.productWorkSalary.cost_upholstery_carcass : '';
              }
            },
            { id:"cost_upholstery_headboard", header:[ "Раб. об. изг.", { content:"selectFilter" }, "" ], width:100,  batch:1,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_upholstery_headboard != null) ? data.productWorkSalary.cost_upholstery_headboard : '';
              }
            },
            { id:"cost_buttons", header:[ "Раб. об. пуг.", { content:"selectFilter" }, "" ], width:100,  batch:1,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_buttons != null) ? data.productWorkSalary.cost_buttons :'';
              }
            },
            { id:"cost_matras", header:[ "Раб. об. мат.", { content:"selectFilter" }, "" ], width:100,  batch:1,
              "css": {"color": "green", "text-align": "right"},
              "template" : function(data) {
                return  (data.productWorkSalary && data.productWorkSalary.cost_matras != null) ? data.productWorkSalary.cost_matras : '';
              }
            },

            { id:"Z", header:[ "Обивщик", { content:"selectFilter" }, "" ], width:100, editor:"text" , batch:1},
            { id:"AZ", header:[ "Столярка ФИО", { content:"selectFilter" }, "" ],  width:115 , editor:"text", batch:2},
            { id:"BO", header:[ "Пошив ФИО", { content:"selectFilter" }, "" ],  width:115 , batch:1, editor:"text", batch:3},
            { id:"BV", header:[ "Крой ФИО", { content:"selectFilter" }, "" ], width:115 ,  editor:"text", batch:4},

            { id:"BQ", header:[ "Дата пош.", { content:"selectFilter" }, "" ], width:90, batch:3, editor:"text" },
            { id:"BX", header:[ "Дата крой.", { content:"selectFilter" }, "" ], width:90, batch:4, editor:"text" },

            { id:"AE", header:[ "Дата обив.", { content:"selectFilter" }, "" ], width:60,  editor:"text", batch:1 },

            { id:"BB", header:[ "Дата ст.", { content:"selectFilter" }, "" ], width:90 , editor:"text", batch:2},





          ],
          showColumnBatch:function(batch, mode){
            debugger;
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
              if (item.B == 4)
                item.$css = "highlight";
              if (item.B == 3)
                item.$css = "highlight-blue";
              if (item.B == 2)
                item.$css = "highlight-green";
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
              let record = this.getItem(context.start);
              let recordSource = this.getItem(context.parent);
              scope.beforeDropChangeData(record, recordSource.value);

            }
          }

        }
      ]
    }
  }

  init(view) {

    let table = this.$$("report-salary-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    let typeSelect = this.$$("select-type");
    let type = this.$$("select-type").getValue();
    let selectDate = 'AE';
    if (type == 2) {
      selectDate = 'date_carpenter';
    }
    if (type == 3) {
      selectDate = 'date_sewing';
    }
    if (type == 4) {
      selectDate = 'date_cut';
    }

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", {
      "expand" : 'productWorkSalary, cloth, product',
      "per-page": "1000",
      sort: '[{"property":"'+selectDate+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"'+selectDate+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });


    let scope =this;
    webix.ajax().get(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      table.sort([{by:selectDate, dir:"asc"}]);
      table.group({
        by: function(obj){  return obj[selectDate]},
        map:{
          G:["G","median"],
          V:["V","median"],
          AO:["AO","median"],
          AA:["AA","median"],
          AB:["AB","median"],
          AG:["AG","median"],
          AJ:["AJ","median"],
          J:["J","countValue"],
          coef_sewing:["coef_sewing", "median" ],
          value:[selectDate],
          date_sewing:["date_sewing"],
          profit:["profit", "sum"],
          expense:["expense", "sum"],
          net_cost:["net_cost", "sum"],
          cost_work:["cost_work", "sum"],
          cloth_sum:["cloth_sum", "sum"],
          expense_cloth:["expense_cloth", "sum"],
          coef_mat:["coef_mat", "middleCoefMat"],
          cost_cut:["cost_cut", "sum"],
          cost_sewing:["cost_sewing", "sum"],
          cost_work_upholstery:["cost_work_upholstery", "sum"],

        }
      });
    });

    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      let type = scope.$$("select-type").getValue();
      let selectDate = 'AE';
      if (type == 2) {
        selectDate = 'date_carpenter';
      }
      if (type == 3) {
        selectDate = 'date_sewing';
      }
      if (type == 4) {
        selectDate = 'date_cut';
      }

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "expand" : 'productWorkSalary, cloth, product',
        "per-page": "1000",
        sort: '[{"property":"'+selectDate+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"'+selectDate+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
        //filter: '{"AE":{">=":"'+dateToValue+'"}}'
      });



      webix.ajax().get(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
        table.group({
          by: function(obj){  return obj[selectDate]},
          map:{
            G:["G","median"],
            V:["V","median"],
            AO:["AO","median"],
            AA:["AA","median"],
            AB:["AB","median"],
            AG:["AG","median"],
            AJ:["AJ","median"],
            J:["J","countValue"],
            coef_sewing:["coef_sewing", "median" ],
            value:[selectDate],
            date_sewing:["date_sewing"],
            profit:["profit", "sum"],
            expense:["expense", "sum"],
            net_cost:["net_cost", "sum"],
            cost_work:["cost_work", "sum"],
            cloth_sum:["cloth_sum", "sum"],
            expense_cloth:["expense_cloth", "sum"],
            coef_mat:["coef_mat", "middleCoefMat"],
            cost_cut:["cost_cut", "sum"],
            cost_sewing:["cost_sewing", "sum"],
            cost_work_upholstery:["cost_work_upholstery", "sum"],
          }
        });
      });

    });

    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());

      let type = scope.$$("select-type").getValue();
      let selectDate = 'AE';
      if (type == 2) {
        selectDate = 'date_carpenter';
      }
      if (type == 3) {
        selectDate = 'date_sewing';
      }
      if (type == 4) {
        selectDate = 'date_cut';
      }

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "expand" : 'productWorkSalary, cloth, product',
        "per-page": "1000",
        sort: '[{"property":"'+selectDate+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"'+selectDate+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
        //filter: '{"AE":{">=":"'+dateToValue+'"}}'
      });



      webix.ajax().get(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
        table.group({
          by: function(obj){  return obj[selectDate]},
          map:{
            G:["G","median"],
            V:["V","median"],
            AO:["AO","median"],
            AA:["AA","median"],
            AB:["AB","median"],
            AG:["AG","median"],
            AJ:["AJ","median"],
            J:["J","countValue"],
            coef_sewing:["coef_sewing", "median" ],
            value:[selectDate],
            date_sewing:["date_sewing"],
            profit:["profit", "sum"],
            expense:["expense", "sum"],
            net_cost:["net_cost", "sum"],
            cost_work:["cost_work", "sum"],
            cloth_sum:["cloth_sum", "sum"],
            expense_cloth:["expense_cloth", "sum"],
            coef_mat:["coef_mat", "middleCoefMat"],
            cost_cut:["cost_cut", "sum"],
            cost_sewing:["cost_sewing", "sum"],
            cost_work_upholstery:["cost_work_upholstery", "sum"],
          }
        });
      });
    });
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
    let table = this.$$("report-salary-table");
    this.$$("report-salary-table").showColumnBatch(newv);
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());


    let type = this.$$("select-type").getValue();
    let selectDate = 'AE';
    if (type == 2) {
      selectDate = 'date_carpenter';
    }
    if (type == 3) {
      selectDate = 'date_sewing';
    }
    if (type == 4) {
      selectDate = 'date_cut';
    }

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", {
      "expand" : 'productWorkSalary, cloth, product',
      "per-page": "1000",
      sort: '[{"property":"'+selectDate+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"'+selectDate+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });

    let scope =this;
    webix.ajax().get(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      table.group({
        by: function(obj){  return obj[selectDate]},
        map:{
          G:["G","median"],
          V:["V","median"],
          AO:["AO","median"],
          AA:["AA","median"],
          AB:["AB","median"],
          AG:["AG","median"],
          AJ:["AJ","median"],
          J:["J","countValue"],
          coef_sewing:["coef_sewing", "median" ],
          value:[selectDate],
          date_sewing:["date_sewing"],
          profit:["profit", "sum"],
          expense:["expense", "sum"],
          net_cost:["net_cost", "sum"],
          cost_work:["cost_work", "sum"],
          cloth_sum:["cloth_sum", "sum"],
          expense_cloth:["expense_cloth", "sum"],
          coef_mat:["coef_mat", "middleCoefMat"],
          cost_cut:["cost_cut", "sum"],
          cost_sewing:["cost_sewing", "sum"],
          cost_work_upholstery:["cost_work_upholstery", "sum"],
        }
      });
    });

  }

  beforeDropChangeData(record, dateObivka) {

    let data = {'AE':dateObivka};
    let tableUrl = this.app.config.apiRest.getUrl('put',"accounting/orders", {}, record.id);
    record.date_obivka = dateObivka;
    record.AE = formatDate(dateObivka);

    webix.ajax().put(tableUrl, data).then(function(data){
      webix.message('Данные сохранены!');
    });

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