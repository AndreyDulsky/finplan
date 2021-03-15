import {JetView} from "webix-jet";
import UpdateFormModelView from "core/updateFormView";
import ProductWorkSalaryView from "views/product-work-salary/index";
import PowerFormView from "views/order-sewing/power-form";


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

webix.GroupMethods.countSame = function(prop, data){
  if (!data.length) return 0;
  var summ = 0;
  let array = {};
  for (var i = data.length - 1; i >= 0; i--) {

    if (data[i].$level == 1 ) {
      let per =prop(data[i]);

      if (per!="") {
        //debugger;

        if (per != null)  array[per] = per;

      }

    }
  }

  return webix.i18n.numberFormat(Object.keys(array).length,{
    groupDelimiter:",",
    groupSize:3,
    decimalDelimiter:".",
    decimalSize:2
  });
};

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
    node.style.textAlign = "right";
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
    node.style.textAlign = "right";
    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);



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

webix.Date.oneDayEnd = function(obj){
  //obj = webix.Date.weekStart(obj);
  obj = webix.Date.add(obj, 1, "day");
  //obj = webix.Date.weekStart(obj);
  obj = webix.Date.add(obj, -1, "minute");
  return obj;
}

webix.ui.datafilter.mySummColumn = webix.extend({
  refresh:function(master, node, value){
    var result = 0;
    master.data.each(function(obj){
      if (obj.rank)
        result += obj.fee;
    });

    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);

let formatDateGant = webix.Date.dateToStr("%d-%m-%Y");

let formatDate = webix.Date.dateToStr("%d.%m.%y");
let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
let formatDateTimeDb = webix.Date.dateToStr("%Y-%m-%d %H:%i");
let parserDate = webix.Date.strToDate("%Y-%m-%d");
let parserDateTime = webix.Date.strToDate("%Y-%m-%d %H:%i");
let parserDateHour = webix.Date.strToDate("%Y-%m-%d %H");
let parserDateCloth = webix.Date.strToDate("%d.%m.%y");

let parserDateTimeDayStart = webix.Date.strToDate("%d-%m-%Y %H:%i");

let formatDateHour =  webix.Date.dateToStr("%d.%m.%y %H");
let formaHour = webix.Date.dateToStr("%H:%i");

webix.editors.buttonEditor = webix.extend({
  render:function(obj,obj1,obj2){
    return webix.html.create("div", {
      "class":"webix_dt_editor"
    }, "<input type='text'><button class='editor-button' style='position: absolute;margin: 1px; right:0; height:25px;'>...</button>");
  }}, webix.editors.text);

export default class OrderSewingView extends JetView{



  config(){
    let scope = this;


    return {

      rows:[
        {
          cols:[
            {"view": "label", width: 200, height:30, template: "План производства", css: { 'font-size':'17px', 'padding': '10px 0px 10px 15px', 'font-weight': 600}},
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
                  value: new Date()
                },
                {
                  view:"datepicker",
                  localId: 'dateTo',
                  inputWidth:150,
                  label: 'по',
                  labelWidth:30,
                  width:160,
                  value: webix.Date.oneDayEnd(new Date())
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
            { view:"icon", icon: 'mdi mdi-power-plug', autowidth:true, click: () =>  this.doClickGetPower()},
            { view:"icon", icon: 'mdi mdi-account-reactivate', autowidth:true, click: () =>  this.doClickSetSewingPlan()},
            { view:"icon", icon: 'mdi mdi-account-supervisor-circle-outline', autowidth:true, click: () =>  this.doClickSetUpholsteryPlan()},
            { view:"icon", icon: 'mdi mdi-calculator', autowidth:true, click: () =>  this.doClickCalculator()},
            { view:"icon", icon: 'mdi mdi-printer', autowidth:true, click: () =>  this.doClickPrint()},
            { view:"icon", icon: 'mdi mdi-microsoft-excel', autowidth:true, click: () =>  this.doClickToExcel()},
            // {
            //   view:"toggle",
            //   type:"icon",
            //   icon: 'mdi mdi-calendar',
            //   localId: "toggleTime",
            //   autowidth:true,
            //   value :true,
            //   click: function() { scope.doPlanToggle() }
            //
            // },
            {
              view:"toggle",
              type:"icon",
              icon: 'mdi mdi-file-tree',
              autowidth:true,
              value :true,
              click: function() { scope.doClickOpenAll() }

            },
            { view:"select",
              localId: "batch-plan",
              value:1, labelWidth:100, options:[
              { id:8, value:"Крой" },
              { id:1, value:"Швейка" },
              { id:4, value:"Обивка" },
              { id:6, value:"Распил." },
              { id:'10', value:"Столярка" },
              { id:12, value:"Упаковка" },

            ],
              width: 250,
              on:{
                onChange:function(newv){
                  scope.showBatch(newv);
                }
              }
            },
            { view:"select",
              localId: "toggle-plan",
                value:1, labelWidth:100, options:[
                { id:4, value:"По дням обивки план" },
                { id:9, value:"По часам крой план" },
                //{ id:1, value:"По дате шв.факт(групировка)/Дата обивки (фильтер)" },
                { id:2, value:"По часам шв.план" },
                //{ id:3, value:"По дате окончания шв.план" },

                { id:5, value:"По часам обивки план" },
                //{ id:6, value:"По дате распил.факт/Дата обивки" },
                { id:7, value:"По часам распил.план" },
                //{ id:8, value:"По дате крой факт/Дата обивки" },

                //{ id:'10', value:"По дате столярка факт/Дата обивки" },
                { id:11, value:"По часам столярка план" },
                { id:12, value:"По часам упаковка план" },




              ],
              width: 250,
              on:{
                onChange:function(newv){
                  let batchSelect = scope.$$('batch-plan');
                  if (newv == 1 || newv == 2 || newv == 3) {
                    batchSelect.setValue(1);
                  }
                  if (newv == 4 || newv == 5) {
                    batchSelect.setValue(4);
                  }
                  if (newv == 6 || newv == 7) {
                    batchSelect.setValue(6);
                  }
                  if (newv == 8 || newv == 9) {
                    batchSelect.setValue(8);
                  }
                  if (newv == '10' || newv == 11) {
                    batchSelect.setValue(10);
                  }
                  if (newv == 12) {
                    batchSelect.setValue(12);
                  }
                  scope.doPlanToggle(newv);
                }
              }
            },
          ]
        },
        /*wjet::Settings*/
        {
          view:"treetable",
          css:"webix_header_border webix_data_border my_style",
          urlEdit: 'product-work-salary',
          leftSplit:11,
          //rightSplit:2,
          select: "row",
          resizeColumn: { headerOnly:true },
          localId: 'sewing-table',
          //subrow:"#N#",
          multiselect:true,
          drag:true,
          fixedRowHeight:false, //rowLineHeight:25, rowHeight:25,
          editable:true,
          visibleBatch:1,
          editaction: "dblclick",
          tooltip:true,
          clipboard:"selection",
          columns:[

            // {
            //   id:"id", header:"#", hidden: true
            // },

            {
              id:"A", header:[ "# заказа", { content:"textFilter" },"" ],	width:180,
              tooltip:"#F# #C#-#D# Дата клиента: #H# <br>#E# #I# #L# - Статус ткани: #M# Дата ткани: #K#<br>#N# #O# #P# #Q# #R# #T#",
              template:function(obj, common){

                if (obj.$level == 1) return common.treetable(obj, common) + formatDateHour(obj.value)+':00';
                return obj.A;
              },
              //format:formatDateHour,
              "css": {"color": "black", "text-align": "right", "font-weight": 500},
              //"sort" : "date"
            },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 ,  editor:"text"},
            { id:"H", header:[ "Дата клиента", { content:"textFilter" }, "" ], width:70, editor:"text" },

            { id:"I", header:[ "Изделие", { content:"textFilter" }, "" ], width:200, editor:"buttonEditor" },

            //print
            //{ id:"plan", header:"План", width:60 , batch:10, editor:"text"},


            // { id:"B", header:[ "Статус", { content:"selectFilter" },"" ], width:70, batch:2, editor:"select",
            //   options:[{"id": 1, "value": "1"}, {"id": 3, "value": "3"}, {"id": 4, "value": "4"},
            //     {"id": 5, "value": "5"}, {"id": 6, "value": "6"}
            //   ] },
            // { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:70, batch:2, editor:"text" },

            // { id:"H", header:[ "Дата кл.", { content:"textFilter" }, "" ], width:70,  editor:"text" },
            // { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, editor:"text", batch:2  },
            // { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:150, editor:"text", batch:2 },


            // { id:"coefMoney", header:[ "Коэф. ден. план", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:120,
            //   hidden: true,
            //   "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            //   template: function(obj) {
            //     let per =  parseFloat(obj.G.replace(",",""));
            //     if (obj.$group) return webix.Number.format(per/7860,{
            //       decimalDelimiter:".",
            //       decimalSize:2
            //     });
            //     return webix.Number.format(parseFloat(obj.G/7860));
            //   }
            // },

            {
              id:"date_obivka",
              header:[ "Дата Об.", { content:"selectFilter" }, "" ],
              width:80,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              //batch:1,
              template: function(obj) {
                return formatDate(parserDate(obj.date_obivka));
              }

            },
            { id:"CF", header:[ "Уп.", { content:"selectFilter" }, "" ], width:40, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 500},
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 12)
                  return {"text-align": "center", "background-color": '#C4F5F9'};
              },
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.CF == 1) {
                  return '<i class="mdi mdi-gift"></i>';
                }
                return  (obj.CF === null) ? "" : obj.CF;
              }
            },
            { id:"W", header:[ "Об.", { content:"selectFilter" }, "" ], width:40, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 500},
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 4)
                  return {"text-align": "center", "background-color": '#ddFFdd'};
              },
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.W == 1) {
                  return '<i class="mdi mdi-marker-check"></i>';
                }
                return  (obj.W === null) ? "" : obj.W;
              }
            },
            { id:"BP", header:[ "Шв.", { content:"selectFilter" }, "" ], width:40,  editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, },
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 1)
                  return {"text-align": "center", "background-color": '#C4F5F9'};
              },
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BP == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BP === null) ? "" : obj.BP;
              }
            },
            { id:"BW", header:[ "Крой", { content:"selectFilter" }, "" ], width:40,  editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, },
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 8)
                  return {"text-align": "center", "background-color": '#fff5e6'};
              },
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BW == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BW === null) ? "" : obj.BW;
              }
            },
            { id:"BA", header:[ "Ст.", { content:"selectFilter" }, "" ], width:50,  editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300},
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 10)
                  return {"text-align": "center", "background-color": '#ffe4dd'};
              },
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BA == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BA === null) ? "" : obj.BA;
              }
            },
            { id:"status_sawcut", header:[ "Расп.", { content:"selectFilter" },""], width:50,  editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300},
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 6)
                  return {"text-align": "center", "background-color": '#C4F5F9'};
              },
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.status_sawcut == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.status_sawcut === null) ? "" : obj.status_sawcut;
              }
            },
            {
              id:"date", header:[ "# заказа", { content:"textFilter" },"" ], width: 180,
              batch:2,
              template:function(obj, common){

                if (obj.$level == 1) return  common.folder(obj, common)+'<div style="font-weight:700;" >'+formaHour(obj.value)+'</div>';
                return obj.A+'- '+obj.I;
              },
              //format:formatDateHour,
              "css": {"color": "black", "text-align": "left"},
              //"sort" : "date"
            },
            { id:"fact", header:"Факт н.", width:100 , batch:2, editor:"text"},
            { id:"fact1", header:"Факт к.", width:100 , batch:2, editor:"text"},
            { id:"comment", header:"Коментарий", width:250, batch:2, editor:"text"},



            { id:"AA", header:[ "К.об.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:80,
              "css": {"text-align": "right",  "font-weight": 500}

            },
            { id:"CH", header:[ "К.шв.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:80, editor:"text",
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"G",
              width:90,
              header:[ "Сумма", { content:"textFilter" }, { content:"totalColumn" }],
              "css": {"color": "black", "text-align": "right",  "font-weight": 500}, editor:"text",  batch:4
              //footer: {content: "summColumn", css: {"text-align": "right"}}

            },
            { id:"CI", header:[ "К.кр.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:80, editor:"text",
              "css": {"text-align": "right",  "font-weight": 500}, batch:8,
            },


            {
              id:"date_cut_plan",
              header:[ "Дата кр.план старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              //batch:8,
              hidden: false,
              css:{"text-align": "center" },
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 8)
                  return {"text-align": "center", "background-color": '#fff5e6'};
              },
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_cut_plan));
              }
            },
            {
              id:"date_cut_plan_end",
              header:[ "Дата кр.план оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y %H:%i"),
              //batch:8,
              hidden: false,
              "css": {"text-align": "center"},
              template: function(obj) {
                if (obj.$group) return '';
                return formatDateTime(parserDateTime(obj.date_cut_plan_end));
              }
            },
            {
              id:"date_sewing_plan",
              header:[ "Дата Шв.план старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              //batch:1,
              hidden: false,
              "css": {"text-align": "center"},
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 1)
                  return {"text-align": "center", "background-color": '#C4F5F9'};
              },
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_sewing_plan));
              }
            },
            {
              id:"date_sewing_plan_end",
              header:[ "Дата Шв.план оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y %H:%i"),
              //batch:1,
              hidden: false,
              "css": {"text-align": "center"},
              template: function(obj) {
                if (obj.$group) return '';
                return formatDateTime(parserDateTime(obj.date_sewing_plan_end));
              }
            },
            {
              id:"date_carpenter_plan",
              header:[ "Дата ст.план старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              //batch:10,
              hidden: false,
              "css": {"text-align": "center"},
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 10)
                  return {"text-align": "center", "background-color": '#ffe4dd'};
              },
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_carpenter_plan));
              }
            },
            {
              id:"date_carpenter_plan_end",
              header:[ "Дата ст.план оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y %H:%i"),
              //batch:10,
              hidden: false,
              "css": {"text-align": "center"},
              template: function(obj) {
                if (obj.$group) return '';
                return formatDateTime(parserDateTime(obj.date_carpenter_plan_end));
              }
            },

            { id:"date_sawcut_plan",header:[ "Дата расп.план старт", { content:"selectFilter" },""], width:150,  editor:"date",
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 6)
                  return {"text-align": "center", "background-color": '#C4F5F9'};
              },
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_sawcut_plan));
              }
            },
            { id:"date_sawcut_plan_end",header:[ "Дата расп.план оконч.", { content:"selectFilter" },""], width:160,  editor:"date",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_sawcut_plan_end));
              }
            },


            //upholstery ---------------------

            // { id:"AA", header:[ "К.об.план", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:80, editor:"text",
            //   "css": {"text-align": "right",  "font-weight": 500}, batch:4,
            // },
            { id:"time_upholstery_plan", header:[ "Вр.об.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:90, editor:"text",
              "css": {"text-align": "right",  "font-weight": 500}, batch:4,
            },
            { id:"time_upholstery_fact", header:[ "Вр.об.факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:90, editor:"text",
              "css": {"text-align": "right", "color":"green", "font-weight": 500}, batch:4,
            },

            {
              id:"date_upholstery_plan",
              header:[ "Дата об.план старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:4,
              hidden: false,
              css:{"text-align": "center" },
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 4)
                  return {"text-align": "center", "background-color": '#ddFFdd'};
              },
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_upholstery_plan));
              }
            },
            {
              id:"date_upholstery_plan_end",
              header:[ "Дата об.план оконч.", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:4,
              "css": {"text-align": "center",  "font-weight": 500},
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_upholstery_plan_end));
              }
            },
            {
              id:"time_upholstery_start",
              header:[ "Дата об.факт старт.", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:4,
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.time_upholstery_start));
              }
            },
            {
              id:"time_upholstery_end",
              header:[ "Дата об.факт окон.", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:4,
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.time_upholstery_end));
              }
            },


            //sewing
            { id:"time_sewing", header:[ "Вр.шв.план,ч", { content:"textFilter" }, { content:"totalColumn" } ],
              width:90, editor:"text",
              "css": {"text-align": "center",  "font-weight": 500}, batch:1,
            },
            { id:"time_sewing_fact", header:[ "Вр.шв.факт,ч", { content:"textFilter" }, { content:"totalColumn" } ],
              width:90, editor:"text",
              "css": {"color": "green","text-align": "center",  "font-weight": 500}, batch:1,
            },
            // {
            //   id:"date_sewing_plan",
            //   header:[ "Дата Шв.план старт", { content:"selectFilter" }, "" ],
            //   width:140,
            //   editor:"date",
            //   //format:webix.Date.dateToStr("%d.%m.%y"),
            //   batch:1,
            //   hidden: false,
            //   "css": {"text-align": "center"},
            //   template: function(obj) {
            //     return formatDateTime(parserDateTime(obj.date_sewing_plan));
            //   }
            // },
            // {
            //   id:"date_sewing_plan_end",
            //   header:[ "Дата Шв.план оконч.", { content:"selectFilter" }, "" ],
            //   width:145,
            //   editor:"date",
            //   //format:webix.Date.dateToStr("%d.%m.%y %H:%i"),
            //   batch:1,
            //   hidden: false,
            //   "css": {"text-align": "center"},
            //   template: function(obj) {
            //     if (obj.$group) return '';
            //     return formatDateTime(parserDateTime(obj.date_sewing_plan_end));
            //   }
            // },

            {
              id:"BT",
              header:[ "Дата Шв.факт старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
              "css": {"color": "green","text-align": "center",  "font-weight": 500},
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.BT));
              }
            },

            {
              id:"BU",
              header:[ "Дата Шв.факт оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
              "css": {"color": "green","text-align": "center",  "font-weight": 500},
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.BU));
              }
            },

            // {
            //   id:"BU",
            //   header:[ "Дата Шв.факт оконч.", { content:"selectFilter" }, "" ],
            //   width:145,
            //   editor:"date",
            //   //format:webix.Date.dateToStr("%d.%m.%y"),
            //   batch:1,
            //   hidden: false,
            //   template: function(obj) {
            //     return formatDateTime(parserDateTime(obj.BU));
            //   }
            // },

            { id:"BO", header:[ "ФИО шв.", { content:"selectFilter" },{ content:"mySummColumn" }], width:115 , batch:1, editor:"text"},

            { id:"coef_sewing", header:[ "Коэф.шв.факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:1
            },



            //cut------------------------------

            { id:"time_cut_plan", header:[ "Время.кр.план,ч", { content:"textFilter" }, { content:"totalColumn" } ],
              width:125, editor:"text",
              "css": {"text-align": "right",  "font-weight": 500}, batch:8,
            },
            { id:"time_cut_fact", header:[ "Время.кр.факт,ч", { content:"textFilter" }, { content:"totalColumn" } ],
              width:125, editor:"text",
              "css": {"text-align": "right", "color":"green", "font-weight": 500}, batch:8,
            },

            // {
            //   id:"date_cut_plan",
            //   header:[ "Дата кр.план старт", { content:"selectFilter" }, "" ],
            //   width:140,
            //   editor:"date",
            //   //format:webix.Date.dateToStr("%d.%m.%y"),
            //   batch:8,
            //   hidden: false,
            //   "css": {"text-align": "center"},
            //   template: function(obj) {
            //     return formatDateTime(parserDateTime(obj.date_cut_plan));
            //   }
            // },

            // {
            //   id:"date_cut_plan_end",
            //   header:[ "Дата кр.план оконч.", { content:"selectFilter" }, "" ],
            //   width:145,
            //   editor:"date",
            //   //format:webix.Date.dateToStr("%d.%m.%y %H:%i"),
            //   batch:8,
            //   hidden: false,
            //   "css": {"text-align": "center"},
            //   template: function(obj) {
            //     if (obj.$group) return '';
            //     return formatDateTime(parserDateTime(obj.date_cut_plan_end));
            //   }
            // },


            {
              id:"BZ",
              header:[ "Дата кр.факт старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:8,
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.BZ));
              }
            },

            {
              id:"CA",
              header:[ "Дата кр.факт оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:8,
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.CA));
              }
            },
            { id:"BV", header:[ "ФИО крой.", { content:"selectFilter" },{ content:"mySummColumn" }], width:115 , batch:8, editor:"text"},

            { id:"desc_cut", header:[ "Причина", { content:"selectFilter" },""], width:150,  editor:"popup" , batch:8},
            //{ id:"W", header:"Статус", width:100, batch:3 },
            //{ id:"AH", header:"Дата", width:100, batch:3 },
            { id:"loss_cut", header:[ "Классификация потерь", { content:"selectFilter" },""], width:110, batch:8, editor:"text" },
            { id:"time_loss_cut", header:[ "Время потерь, мин", { content:"selectFilter" },""], width:110, batch:8, editor:"text" },







            // carpenter -------------------------------------

            { id:"time_carpenter_plan", header:[ "Время.ст.план,ч", { content:"textFilter" }, { content:"totalColumn" } ],
              width:125, editor:"text",
              "css": {"text-align": "right",  "font-weight": 500}, batch:10,
            },
            { id:"time_carpenter_fact", header:[ "Время.ст.факт,ч", { content:"textFilter" }, { content:"totalColumn" } ],
              width:125, editor:"text",
              "css": {"text-align": "right", "color":"green", "font-weight": 500}, batch:10,
            },

            // {
            //   id:"date_carpenter_plan",
            //   header:[ "Дата ст.план старт", { content:"selectFilter" }, "" ],
            //   width:140,
            //   editor:"date",
            //   //format:webix.Date.dateToStr("%d.%m.%y"),
            //   batch:10,
            //   hidden: false,
            //   "css": {"text-align": "center"},
            //   template: function(obj) {
            //     return formatDateTime(parserDateTime(obj.date_carpenter_plan));
            //   }
            // },

            // {
            //   id:"date_carpenter_plan_end",
            //   header:[ "Дата ст.план оконч.", { content:"selectFilter" }, "" ],
            //   width:145,
            //   editor:"date",
            //   //format:webix.Date.dateToStr("%d.%m.%y %H:%i"),
            //   batch:10,
            //   hidden: false,
            //   "css": {"text-align": "center"},
            //   template: function(obj) {
            //     if (obj.$group) return '';
            //     return formatDateTime(parserDateTime(obj.date_carpenter_plan_end));
            //   }
            // },


            {
              id:"BC",
              header:[ "Дата ст.факт старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:10,
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.BC));
              }
            },

            {
              id:"date_carpenter",
              header:[ "Дата ст.факт оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:10,
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_carpenter));
              }
            },
            { id:"AZ", header:[ "ФИО столярка", { content:"selectFilter" },{ content:"mySummColumn" }], width:115 , batch:10, editor:"text"},

            { id:"desc_carpenter", header:[ "Причина", { content:"selectFilter" },""], width:150,  editor:"popup" , batch:10},
            //{ id:"W", header:"Статус", width:100, batch:3 },
            //{ id:"AH", header:"Дата", width:100, batch:3 },
            { id:"loss_carpenter", header:[ "Классификация потерь", { content:"selectFilter" },""], width:110, batch:10, editor:"text" },
            { id:"time_loss_carpenter", header:[ "Время потерь, мин", { content:"selectFilter" },""], width:110, batch:10, editor:"text" },


            // additional
            { id:"M", header:[ "Статус ткани", { content:"selectFilter" } , ""], width:100, editor:"text" },
            { id:"K", header:[ "Дата ткани", { content:"textFilter" }, "" ], width:90,   editor:"text" },

            { id:"J", header:[ "Размер", { content:"selectFilter" }, "" ], width:70, batch:2, editor:"text" },

            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, editor:"text"},

            // { id:"T", header:[ "Описание", { content:"textFilter" }, ""], width:100, disable: true, batch:2,
            //   editor:"popup",
            //   template:function(obj, common){
            //     if (obj.$group) return "";
            //     return obj.N+" "+obj.O+" "+obj.P+" "+obj.Q+" "+obj.R+" "+obj.T;
            //   }
            // },
            //{ id:"O", header:"O", width:100 },
            //{ id:"P", header:"P", width:100 },
            //{ id:"Q", header:"Q", width:100 },
            //{ id:"R", header:"R", width:100 },
            //{ id:"S", header:[ "# клиента", { content:"textFilter" }, ""], width:70, batch:2, editor:"text" },
            //{ id:"T", header:"T", width:100 },
            // { id:"U", header:"U", width:100 },


            { id:"CA", header:[ "Время Крой", { content:"selectFilter" }, "" ], width:110,  editor:"date",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.CA));
              }

            },




            //{ id:"BV", header:[ "Фио Крой", { content:"selectFilter" }, { content:"mySummColumn" } ], width:115 , batch:1, editor:"text"},

            { id:"desc_sewing", header:[ "Причина", { content:"selectFilter" },""], width:150,  editor:"popup" , batch:1},
            //{ id:"W", header:"Статус", width:100, batch:3 },
            //{ id:"AH", header:"Дата", width:100, batch:3 },
            { id:"loss_sewing", header:[ "Классификация потерь", { content:"selectFilter" },""], width:110, batch:1, editor:"text" },
            { id:"time_loss_sewing", header:[ "Время потерь, мин", { content:"selectFilter" },""], width:110, batch:1, editor:"text" },

            // { id:"V", header:[ "Сумма", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:100,
            //   "css": {"color": "green", "text-align": "right",  "font-weight": 500},
            //   batch:2
            // },
            // { id:"AO", header:[ "Коэф. ден.", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:100,
            //   "css": {"color": "green", "text-align": "right",  "font-weight": 500}, batch:2,
            //
            // },
            // { id:"AB", header:[ "Коэф. вр.", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:100,
            //   "css": {"text-align": "right",  "font-weight": 500}, batch:2,
            // },
            { id:"Z", header:[ "Обивщик", { content:"selectFilter" }, "" ], width:100, editor:"text" },
            // { id:"AG", header:[ "Коэф. ст.", { content:"textFilter" }, "" ],
            //   width:100,
            //   "css": {"text-align": "right",  "font-weight": 500}, batch:2,
            // },


            // Sawcut
            // { id:"date_carpenter",header:[ "Дата стол.", { content:"selectFilter" },""], width:120, batch:6, editor:"date",
            //   template: function(obj) {
            //     return formatDateTime(parserDateTime(obj.date_carpenter));
            //   }
            // },
            // { id:"date_carpenter_plan",header:[ "Дата стол.план", { content:"selectFilter" },""], width:120, batch:6, editor:"date",
            //   template: function(obj) {
            //     return formatDateTime(parserDateTime(obj.date_carpenter_plan));
            //   }
            // },
            // { id:"date_sawcut",header:[ "Дата расп.план старт", { content:"selectFilter" },""], width:150, batch:6, editor:"date",
            //   template: function(obj) {
            //     return formatDateTime(parserDateTime(obj.date_sawcut));
            //   }
            // },
            // { id:"date_sawcut_plan",header:[ "Дата расп.план оконч.", { content:"selectFilter" },""], width:160, batch:6, editor:"date",
            //   template: function(obj) {
            //     return formatDateTime(parserDateTime(obj.date_sawcut_plan));
            //   }
            // },


            { id:"time_sawcut_start", header:[ "Дата расп.факт старт", { content:"selectFilter" },""], width:150, batch:6, editor:"text",
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.time_sawcut_start));
              }
            },
            { id:"time_sawcut_end", header:[ "Дата расп.факт оконч.", { content:"selectFilter" },""], width:160, batch:6 , editor:"text",
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.time_sawcut_end));
              }
            },
            { id:"desc_sawcut", header:[ "Причина", { content:"selectFilter" },""], width:150,  editor:"popup" , batch:6},
            { id:"loss_sawcut", header:[ "Классификация потерь", { content:"selectFilter" },""], width:110, batch:6, editor:"text" },
            { id:"time_loss_sawcut", header:[ "Время потерь, мин", { content:"selectFilter" },""], width:110, batch:6, editor:"text" },


            {
              id:"date_packaging_plan",
              header:[ "Дата уп.план старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:12,
              hidden: false,
              css:{"text-align": "center" },
              cssFormat: function(value, config) {
                let comboBatch = scope.$$('batch-plan');
                let comboBathValue = comboBatch.getValue();

                if (comboBathValue == 12)
                  return {"text-align": "center", "background-color": '#C4F5F9'};
              },
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_packaging_plan));
              }
            },
            {
              id:"date_packaging_plan_end",
              header:[ "Дата уп.план оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y %H:%i"),
              batch:12,
              hidden: false,
              "css": {"text-align": "center"},
              template: function(obj) {
                if (obj.$group) return '';
                return formatDateTime(parserDateTime(obj.date_packaging_plan_end));
              }
            },

            { id:"AU", header:"Паралон царги", width:115 , batch:3, editor:"text"},
            { id:"AV", header:"Статус", width:60, batch:3 , editor:"text"},
            { id:"AW", header:"Дата", width:90, batch:3 , editor:"text"},
            //{ id:"AZ", header:"Столярка", width:115 , batch:3, editor:"text"},
            //{ id:"BA", header:"Статус", width:60, batch:3 },
            { id:"BB", header:"Дата", width:90, batch:3 , editor:"text"},

            //{ id:"BP", header:"Статус", width:60, batch:3 },
            //{ id:"BQ", header:"Дата", width:90, batch:1, editor:"text" },

            //{ id:"BW", header:"Статус", width:60, batch:1, editor:"text" },
            //{ id:"BX", header:"Дата", width:90, batch:1, editor:"text" },
            //{ id:"CD", header:"Упаковка", width:80, batch:3, editor:"text" },
            { id:"CE", header:"Дата", width:90, batch:3, editor:"text" },






          ],
          save: "api->accounting/orders",
          scheme:{
            // $group:{
            //   by:function (obj) {
            //     return formatDateHour(obj.date_sewing);
            //   }, // 'company' is the name of a data property
            //   map:{
            //     G:["G","median"],
            //     V:["V","median"],
            //     AO:["AO","median"],
            //     AA:["AA","median"],
            //     AB:["AB","median"],
            //     AG:["AG","median"],
            //     CH:["CH","median"],
            //     coef_sewing:["coef_sewing", "median" ],
            //     time_sewing:["time_sewing", "median" ],
            //     BO:["BO", "countSame" ],
            //     missing:false,
            //     value: [function (obj) {
            //       return formatDateHour(obj.date_sewing);
            //     }],
            //   },
            //   // footer:{
            //   //   W:["W", "sum"],
            //   //   //V:["V"],
            //   //   row:function(obj ){ return "<span style='float:right;'>Всего: "+webix.i18n.numberFormat(obj.V)+"</span>"; }
            //   // },
            //
            //   //row:"A"
            // },
            // $group:{
            //   by:"A", // 'company' is the name of a data property
            //   map:{
            //     A:["A","sum"],
            //     V:["V","sum"],
            //     F:["F"],
            //     state:["grouped","string"]
            //   }
            //   //row:"A"
            // },
           // $sort:{ by:"date_sewing", dir:"asc", as: "date" },


            $init:function(item) {
              //debugger;

              if (item.M == 'заказано') {
                item.$css = "highlight";

                if (item.K) {
                  let formatYear =  webix.Date.dateToStr("%y");
                  let parseAE = webix.Date.strToDate("%d.%m.%y");
                  let year =formatYear(new Date());
                  let dateCloth = parserDateCloth(item.K+'.'+year);
                  let dateAE = parseAE(item.AE);
                  if (dateCloth > dateAE) {
                    item.$css = "highlight-red";
                  }
                }


              }

              if (item.date_client) {
                let formatDay =  webix.Date.dateToStr("%d");
                let formatM =  webix.Date.dateToStr("%m");
                let parseAE = webix.Date.strToDate("%d.%m.%y");
                let dateAE = parseAE(item.AE);
                let dayClient =formatDay(item.date_client);
                let dayObiv =formatDay(dateAE);
                let monthClient =formatM(item.date_client);
                let monthObiv =formatM(dateAE);

                let between = dayClient - dayObiv;
                if (between < 3 && (monthClient == monthObiv)) {
                  item.$css = "highlight-bold";
                }
              }
              // if (item.B == 3)
              //   item.$css = "highlight-blue";
              // if (item.B == 2)
              //   item.$css = "highlight-green";
            }
          },
          ready:function(){
            // var state = webix.storage.local.get("treetable_state");
            // if (state)
            //   this.setState(state);
            //this.openAll();
          },
          scroll: true,
          // url: function(){
          //
          //   return webix.ajax(url).then(function(data) {
          //     return  data.json().items;
          //   });
          //
          //
          // },

          on: {
            "onColumnResize" : function() {
              //webix.storage.local.put("treetable_state", this.getState());
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

            },

          },
          onClick:{
            "editor-button":function(ev, id,obj){

              let itemSelect = this.getSelectedItem();
              let scope = this.$scope;
              //let table = this.$scope.$$('sewing-table');
              //let item = table.getItem(itemSelect.row);
              let tableUrl = this.$scope.app.config.apiRest.getUrl('get',"accounting/product-work-salaries",{
                "per-page": "1",
                //sort: '[{"property":"'+filedSort+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
                filter: '{"name":"'+itemSelect.I+'"}',
                //filter: '{"AE":{">=":"01.02.20"}}'
              });





              let tableWorkSalary = scope.winTable.getBody().$scope.$$('work-salary-table');

              // webix.ui(
              //   winTable
              // );

              webix.ajax().get(tableUrl).then(function(data){
                let dataRecord = data.json();
                tableWorkSalary.clearAll();
                tableWorkSalary.parse(dataRecord);
                if (dataRecord.total_count > 1) {
                  scope.winTable.show();
                } else {
                  scope.modelEdit.showForm(tableWorkSalary);
                }


              });


              return false; // blocks the default click behavior
            }
          }

        },

      ]
    }
  }

  init(view) {

    let table = this.$$("sewing-table");

    let format = webix.Date.dateToStr("%d.%m.%y");
    let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    webix.extend(table, webix.ProgressBar);

    let filedFilter = this.getFilterFieldByTypeGroup();
    let filedSort = this.getSortFieldByTypeGroup();

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders",{
      "per-page": "500",
      sort: '[{"property":"'+filedSort+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"'+filedFilter+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"01.02.20"}}'
    });
    let scope =this;
    webix.ajax().get(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      scope.doTableGroup();

    });
    // table.load(tableUrl,function(text, data, http_request){
    //   return  data.json().items;
    // });

    table.attachEvent("onPaste", function(text) {
      // define your pasting logic here
      let sel = this.getSelectedId(true);
      sel.forEach(item => {
        this.getItem(item.row)[item.column] = text;
        this.refresh(item.row);
        table.updateItem(item.row, this.getItem(item.row))
      });

    });

    table.attachEvent("onBeforeEditStop", function(state, editor, ignoreUpdate){
      let record = {};
      // if(editor.column === "date_sewing_plan"){
      //    record = table.getItem(editor.row);
      //    record['date_sewing'] = state.value;
      //    table.refresh(editor.row);
      // }
      // if(editor.column === "date_sawcut_plan"){
      //   record = table.getItem(editor.row);
      //   record['date_sawcut'] = state.value;
      //   table.refresh(editor.row);
      // }

    });

    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());

      let filedFilter = scope.getFilterFieldByTypeGroup();
      let filedSort = scope.getSortFieldByTypeGroup();

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders",{
        "per-page": "500",
        sort: '[{"property":"'+filedSort+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"'+filedFilter+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });
      webix.ajax().get(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
        scope.doTableGroup();
        table.openAll();
        // timeline.clearAll();
        // timeline.parse(data.json().items);
        // timelinePlan.clearAll();
        // timelinePlan.parse(data.json().items);
        // chart.parse(data.json().items);
      });

    });

    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = formatDate(dateTo.getValue());//+' 23:59';

      let filedFilter = scope.getFilterFieldByTypeGroup();
      let filedSort = scope.getSortFieldByTypeGroup();

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders",{
        "per-page": "500",
        sort: '[{"property":"'+filedSort+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"'+filedFilter+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });

      webix.ajax().get(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
        scope.doTableGroup();
        table.openAll();
        // timeline.clearAll();
        // timeline.parse(data.json().items);
        // timelinePlan.clearAll();
        // timelinePlan.parse(data.json().items);


      });
    });
    this.modelEdit = this.ui(UpdateFormModelView);
    let winTable = {
      localId: "winTable",
      view: "window",
      scope: this,
      head: "Список",
      close: true,
      modal: true,
      body: ProductWorkSalaryView
    };
    this.winTable =  this.ui(winTable);
    //this.productWorkSalary = this.ui(ProductWorkSalaryView);

  }

  doClickOpenAll() {
    let table = this.$$("sewing-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  showBatch(newv){
    this.$$("sewing-table").showColumnBatch(newv);
  }

  beforeDropChangeData(record, date) {
    //debugger;
    let table = this.$$("sewing-table");
    let field = this.getSortFieldByTypeGroup();

    //let data = {field: formatDateTimeDb(date)};
    //let tableUrl = this.app.config.apiRest.getUrl('put',"accounting/orders", {}, record.id);

    let sel = table.getSelectedId(true);
    sel.forEach(item => {
      table.getItem(item.row)[field] = formatDateTimeDb(date);
      table.refresh(item.row);
      webix.message('Данные сохранены!');
      table.updateItem(item.row, table.getItem(item.row))
    });


    // webix.ajax().put(tableUrl, data).then(function(data){
    //   webix.message('Данные сохранены!');
    // });

  }

  doRefresh() {
    let table = this.$$("sewing-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    this.restApi = this.app.config.apiRest;
    let filedFilter = this.getFilterFieldByTypeGroup();
    let filedSort = this.getSortFieldByTypeGroup();
    let tableUrl = this.restApi.getUrl('get',"accounting/orders", {
      "per-page": "500",
      sort: '[{"property":"'+filedSort+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"'+filedFilter+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });
    let scope =this;
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.restApi.getLoad(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      scope.doTableGroup();
      table.enable();
      table.openAll();

    });


  }


  doPlanToggle(type)  {
    let table = this.$$("sewing-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    this.restApi = this.app.config.apiRest;

    let scope =this;

    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    let filedFilter = this.getFilterFieldByTypeGroup();
    let filedSort = this.getSortFieldByTypeGroup();

    let tableUrl = this.restApi.getUrl('get',"accounting/orders", {
      "per-page": "500",
      sort: '[{"property":"'+filedSort+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"'+filedFilter+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });
    this.restApi.getLoad(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      scope.doTableGroup();
      table.enable();
      table.openAll();
    });
  }

  getFilterFieldByTypeGroup() {

    let toggle = this.$$("toggle-plan");
    let field = 'AE';
    if (toggle.getValue() == 1) {
      field = 'AE';
    }
    if (toggle.getValue() == 2) {
      field = 'date_sewing_plan';
    }
    if (toggle.getValue() == 3) {
      field = 'date_sewing_plan';
    }
    if (toggle.getValue() == 4) {
      field = 'AE';
    }
    if (toggle.getValue() == 5) {
      field = 'date_upholstery_plan';
    }
    if (toggle.getValue() == 6) {
      field = 'AE';
    }
    if (toggle.getValue() == 7) {
      field = 'date_sawcut_plan';
    }
    if (toggle.getValue() == 8) {
      field = 'AE';
    }
    if (toggle.getValue() == 9) {
      field = 'date_cut_plan';
    }
    if (toggle.getValue() == 10) {
      field = 'AE';
    }
    if (toggle.getValue() == 11) {
      field = 'date_carpenter_plan';
    }
    if (toggle.getValue() == 12) {
      field = 'date_packaging_plan';
    }
    return field;
  }

  getSortFieldByTypeGroup() {
    let toggle = this.$$("toggle-plan");
    let field = 'date_sewing';
    if (toggle.getValue() == 1) {
      field = 'date_sewing';
    }
    if (toggle.getValue() == 2) {
      field = 'date_sewing_plan';
    }
    if (toggle.getValue() == 3) {
      field = 'date_sewing_plan';
    }
    if (toggle.getValue() == 4) {
      field = 'AE';
    }
    if (toggle.getValue() == 5) {
      field = 'date_upholstery_plan';
    }
    if (toggle.getValue() == 6) {
      field = 'date_sawcut';
    }
    if (toggle.getValue() == 7) {
      field = 'date_sawcut_plan';
    }
    if (toggle.getValue() == 8) {
      field = 'date_cut';
    }
    if (toggle.getValue() == 9) {
      field = 'date_cut_plan';
    }
    if (toggle.getValue() == 10) {
      field = 'date_carpenter';
    }
    if (toggle.getValue() == 11) {
      field = 'date_carpenter_plan';
    }
    if (toggle.getValue() == 12) {
      field = 'date_packaging_plan';
    }
    return field;
  }

  doTableGroup()  {
    let toggle = this.$$("toggle-plan");
    let table = this.$$("sewing-table");

    let by = {};
    let map = {
      G:["G","median"],
      V:["V","median"],
      AO:["AO","median"],
      AA:["AA","median"],
      AB:["AB","median"],
      AG:["AG","median"],
      CH:["CH","median"],
      CI:["CI","median"],
      time_cut_plan:["time_cut_plan","median"],
      //time_carpenter_plan:["time_carpenter_plan","median"],


      coef_sewing:["coef_sewing", "median" ],
      time_sewing:["time_sewing", "median" ],
      date_sewing_plan_end:["date_sewing_plan_end", "median"],
      time_sewing_fact:["time_sewing_fact", "median"],
      //time_carpenter_fact:["time_carpenter_fact", "median"],
      time_upholstery_plan:["time_upholstery_plan", "median" ],
      time_upholstery_fact:["time_upholstery_fact", "median"],

      BO:["BO", "countSame" ],
      Z:["Z", "countSame" ],

      missing:false,
    };

    this.showBatch(1);

    if (toggle.getValue() == 1) {
      by = function (obj) {
        return parserDateHour(obj.date_sewing);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_sewing);
      }];
      table.group({
        by: by,
        map: map,
      });
    }

    if (toggle.getValue() == 2) {
      by = function (obj) {
        return parserDateHour(obj.date_sewing_plan);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_sewing_plan);
      }];
      table.group({
        by: by,
        map: map,
      });
    }
    if (toggle.getValue() == 3) {
      by = function (obj) {
        //debugger;
        let date = webix.Date.add(parserDateHour(obj.date_sewing_plan_end), 1, "hour", true);
        return date;
      };
      map['value'] = [function (obj) {
        return webix.Date.add(parserDateHour(obj.date_sewing_plan_end), 1, "hour", true);
      }];


      table.group({
        by: by,
        map: map,
      });
      table.sort("value", "asc", "date")


    }
    if (toggle.getValue() == 4) {
      this.showBatch(4);
      by = function (obj) {
        return obj.date_obivka;
      };
      map['value'] = [function (obj) {
        return obj.date_obivka;
      }];
      table.group({
        by: by,
        map: map,
      });
    }
    if (toggle.getValue() == 5) {
      this.showBatch(4);
      by = function (obj) {
        return parserDateHour(obj.date_upholstery_plan);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_upholstery_plan);
      }];
      table.group({
        by: by,
        map: map,
      });
    }
    if (toggle.getValue() == 6) {
      this.showBatch(6);
      by = function (obj) {
        return parserDateHour(obj.date_sawcut);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_sawcut);
      }];
      table.group({
        by: by,
        map: map,
      });
    }
    if (toggle.getValue() == 7) {
      this.showBatch(6);
      by = function (obj) {
        return parserDateHour(obj.date_sawcut_plan);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_sawcut_plan);
      }];
      table.group({
        by: by,
        map: map,
      });
    }
    if (toggle.getValue() == 8) {
      this.showBatch(8);
      by = function (obj) {
        return parserDateHour(obj.date_cut);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_cut);
      }];
      table.group({
        by: by,
        map: map,
      });
    }
    if (toggle.getValue() == 9) {
      this.showBatch(8);
      by = function (obj) {
        return parserDateHour(obj.date_cut_plan);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_cut_plan);
      }];
      table.group({
        by: by,
        map: map,
      });
    }

    if (toggle.getValue() == 10) {
      this.showBatch(10);
      by = function (obj) {
        return parserDateHour(obj.date_carpenter);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_carpenter);
      }];
      table.group({
        by: by,
        map: map,
      });
    }
    if (toggle.getValue() == 11) {
      this.showBatch(10);
      by = function (obj) {
        return parserDateHour(obj.date_carpenter_plan);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_carpenter_plan);
      }];
      table.group({
        by: by,
        map: map,
      });
    }
    if (toggle.getValue() == 12) {
      this.showBatch(12);
      by = function (obj) {
        return parserDateHour(obj.date_packaging_plan);
      };
      map['value'] = [function (obj) {
        return parserDateHour(obj.date_packaging_plan);
      }];
      table.group({
        by: by,
        map: map,
      });
    }

  }

  doClickPrint() {
    let table = this.$$("sewing-table");
    let scope = this;
    //table.css = 'my_style';
    table.showColumnBatch(2);
    table.hideColumn('A');
    table.hideColumn('I');
    // table.config.columns.forEach((element, index) => {
    //   console.log(element.id);
    //   scope.toggleColumn(table, element.id);
    //
    // });
    //table.showColumnBatch(10);
    //table.hideColumn(1);

    webix.print(table, { fit:"data"});
    table.showColumnBatch(1);
    table.showColumn('A');
    table.showColumn('I');
  }


  toggleColumn(table,column) {

    //if(table.isColumnVisible(column))
      table.hideColumn(column);
   // else
      //table.showColumn(column, {spans:spans});
  };

  doClickToExcel() {
    let table = this.$$("sewing-table");
    table.showColumnBatch(2);
    table.hideColumn('A');
    table.hideColumn('I');
    webix.toExcel(table);
    table.showColumnBatch(1);
    table.showColumn('A');
    table.showColumn('I');
  }

  doClickCalculator() {
    let table = this.$$("sewing-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    this.restApi = this.app.config.apiRest;
    let filedFilter = this.getFilterFieldByTypeGroup();
    let filedSort = this.getSortFieldByTypeGroup();
    let tableUrl = this.restApi.getUrl('get',"accounting/order/get-plan", {
      "per-page": "500",
      'dateFrom' : dateFromValue,
      'dateTo' : dateToValue
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });
    let scope =this;
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.restApi.getLoad(tableUrl).then(function(data){
      //table.clearAll();
      //table.parse(data.json().items);
      //scope.doTableGroup();
      table.enable();
      table.hideProgress();

    });
  }

  doClickClearPlan() {
    let table = this.$$("sewing-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    this.restApi = this.app.config.apiRest;
    let scope =this;

    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    let tableUrl = this.restApi.getUrl('get',"accounting/order/clear-plan", {
      'dateFrom' : dateFromValue,
      'dateTo' : dateToValue
    });
    this.restApi.getLoad(tableUrl).then(function(data){
      table.enable();
      table.hideProgress();

    });
  }

  doClickSetSewingPlan() {
    let table = this.$$("sewing-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    this.restApi = this.app.config.apiRest;
    let scope =this;

    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    let tableUrl = this.restApi.getUrl('get',"accounting/order/set-order-sewing-after-cut", {
      'dateFrom' : dateFromValue,
      'dateTo' : dateToValue
    });
    this.restApi.getLoad(tableUrl).then(function(data){
      scope.doRefresh();
      table.enable();
      table.hideProgress();

    });
  }

  doClickSetUpholsteryPlan() {
    let table = this.$$("sewing-table");
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    this.restApi = this.app.config.apiRest;
    let scope =this;

    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    let tableUrl = this.restApi.getUrl('get',"accounting/order/set-order-upholstery-after-sewing", {
      'dateFrom' : dateFromValue,
      'dateTo' : dateToValue
    });
    this.restApi.getLoad(tableUrl).then(function(data){
      scope.doRefresh();
      table.enable();
      table.hideProgress();


    });
  }

  doClickGetPower() {
    let format = webix.Date.dateToStr("%Y-%m-%d");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    this.dateFrom = dateFromValue;
    this.powerForm = this.ui(PowerFormView);
    this.powerForm.showWindow();
  }
}