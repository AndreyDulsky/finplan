import {JetView} from "webix-jet";
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

let formatDateGant = webix.Date.dateToStr("%d-%m-%Y %H:%i");
let formatDateGantDay = webix.Date.dateToStr("%d-%m-%Y");

let formatDateAEGant = webix.Date.dateToStr("%d-%m-%Y");
let parserDateAEGant = webix.Date.strToDate("%d.%m.%y");

let formatDate = webix.Date.dateToStr("%d.%m.%y");
let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
let formatDateTimeDb = webix.Date.dateToStr("%Y-%m-%d %H:%i");
let parserDate = webix.Date.strToDate("%Y-%m-%d");
let parserDateTime = webix.Date.strToDate("%Y-%m-%d %H:%i");
let parserDateHour = webix.Date.strToDate("%Y-%m-%d %H");

let parserDateTimeDayStart = webix.Date.strToDate("%d-%m-%Y %H:%i");

let formatDateHour =  webix.Date.dateToStr("%d.%m.%y %H");
let formaHour = webix.Date.dateToStr("%H:%i");

export default class OrderGantView extends JetView{



  config(){
    let scope = this;
    this.apiRest = this.app.config.apiRest;

    return {

      rows:[
        {
          cols:[
            {"view": "label", width: 200, height:30, template: "Диаграмма Ганта", css: { 'font-size':'17px', 'padding': '10px 0px 10px 15px', 'font-weight': 600}},
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
              icon: 'mdi mdi-eye',
              autowidth:true,
              value :true,
              click: function() {
                gantt.config.show_grid = (gantt.config.show_grid) ? false : true;
                gantt.render();
              }

            },
            {
              view:"icon",
              //type:"icon",
              icon: 'mdi mdi-minus',
              autowidth:true,
              value :true,
              click: function() { gantt.ext.zoom.zoomIn(); }

            },
            {
              view:"icon",
              //type:"icon",
              icon: 'mdi mdi-plus',
              autowidth:true,
              value :true,
              click: function() { gantt.ext.zoom.zoomOut(); }

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
            { view:"combo-close",
              localId: "batch-plan",
              hidden: true,
              labelWidth:100, options:[
              { id:1, value:"Швейка" },
              { id:8, value:"Крой" },
              { id:4, value:"Обивка" },
              { id:10, value:"Столярка" },
              //{ id:6, value:"Распил." },
            ],
              width: 150,
              on:{
                onChange:function(newv){
                  scope.showBatch(newv);
                }
              }
            },
            {
              view:"checkbox", label:"Обивка", value:1,
              localId: 'check-upholstery',
              "labelPosition": "top",
            },
            {
              view:"checkbox", label:"Швейка", value:1,
              localId: 'check-sewing',
              "labelPosition": "top",
            },
            {
              view:"checkbox", label:"Крой", value:1,
              localId: 'check-cut',
              "labelPosition": "top",
            },
            {
              view:"checkbox", label:"Столярка", value:1,
              localId: 'check-carpenter',
              "labelPosition": "top",
            },
            {
              view: "combo-close",
              localId: "employee",
              //labelWidth: 100,
              width: 150,

              options: {data : scope.apiRest.getCollection('accounting/employees')}
            },


            { view:"select",
              localId: "toggle-plan",
              hidden: false,
              value:4, labelWidth:100, options:[
                { id:1, value:"По дате шв.факт" },
                { id:2, value:"По дате шв.план" },
                //{ id:3, value:"По дате окончания шв.план" },
                { id:4, value:"По дате обивки факт" },
                { id:5, value:"По дате обивки план" },
                //{ id:6, value:"По дате распил.факт/Дата обивки" },
                //{ id:7, value:"По дате распил.план" },
                { id:8, value:"По дате крой факт" },
                { id:9, value:"По дате крой план" },
                { id:10, value:"По дате столярка факт" },
                { id:11, value:"По дате столярка план" },
              ],
              width: 150,
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
          leftSplit:2,
          //rightSplit:2,
          select: "row",
          resizeColumn: { headerOnly:true },
          localId: 'gant-table',
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


            { id:"I", header:[ "Изделие", { content:"textFilter" }, "" ], width:200, editor:"text" },
            {
              id:"date", header:[ "# заказа", { content:"textFilter" },"" ], width: 250,
              batch:10,
              template:function(obj, common){

                if (obj.$level == 1) return  common.folder(obj, common)+'<div style="font-weight:700;" >'+formaHour(obj.value)+'</div>';
                return obj.A+'- '+obj.I;
              },
              //format:formatDateHour,
              "css": {"color": "black", "text-align": "left"},
              //"sort" : "date"
            },
            //print
            //{ id:"plan", header:"План", width:60 , batch:10, editor:"text"},
            { id:"fact", header:"Факт н.", width:120 , batch:10, editor:"text"},
            { id:"fact1", header:"Факт к.", width:120 , batch:10, editor:"text"},
            { id:"comment", header:"Коментарий", width:350, batch:10, editor:"text"},

            // { id:"B", header:[ "Статус", { content:"selectFilter" },"" ], width:70, batch:2, editor:"select",
            //   options:[{"id": 1, "value": "1"}, {"id": 3, "value": "3"}, {"id": 4, "value": "4"},
            //     {"id": 5, "value": "5"}, {"id": 6, "value": "6"}
            //   ] },
            { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 ,  editor:"text"},
            { id:"H", header:[ "Дата кл.", { content:"textFilter" }, "" ], width:70,  editor:"text" },
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, editor:"text", batch:2  },
            { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:150, editor:"text", batch:2 },


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
            { id:"W", header:[ "Об.", { content:"selectFilter" }, "" ], width:40, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 500},
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
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BW == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BW === null) ? "" : obj.BW;
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
              "css": {"text-align": "center"},
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_upholstery_plan));
              }
            },
            {
              id:"time_upholstery_start",
              header:[ "Дата об.факт старт", { content:"selectFilter" }, "" ],
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
            {
              id:"date_sewing_plan",
              header:[ "Дата Шв.план старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
              "css": {"text-align": "center"},
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
              batch:1,
              hidden: false,
              "css": {"text-align": "center"},
              template: function(obj) {
                if (obj.$group) return '';
                return formatDateTime(parserDateTime(obj.date_sewing_plan_end));
              }
            },

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
              id:"date_sewing",
              header:[ "Дата Шв.факт оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
              "css": {"color": "green","text-align": "center",  "font-weight": 500},
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_sewing));
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

            {
              id:"date_cut_plan",
              header:[ "Дата кр.план старт", { content:"selectFilter" }, "" ],
              width:140,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:8,
              hidden: false,
              "css": {"text-align": "center"},
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_cut_plan));
              }
            },

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
              id:"date_cut",
              header:[ "Дата кр.факт оконч.", { content:"selectFilter" }, "" ],
              width:145,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:8,
              "css": {"text-align": "center", "color":"green", "font-weight": 500},
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_cut));
              }
            },
            { id:"BV", header:[ "ФИО крой.", { content:"selectFilter" },{ content:"mySummColumn" }], width:115 , batch:8, editor:"text"},

            { id:"desc_cut", header:[ "Причина", { content:"selectFilter" },""], width:150,  editor:"popup" , batch:8},
            //{ id:"W", header:"Статус", width:100, batch:3 },
            //{ id:"AH", header:"Дата", width:100, batch:3 },
            { id:"loss_cut", header:[ "Классификация потерь", { content:"selectFilter" },""], width:110, batch:8, editor:"text" },
            { id:"time_loss_cut", header:[ "Время потерь, мин", { content:"selectFilter" },""], width:110, batch:8, editor:"text" },





            // additional
            { id:"M", header:[ "Статус ткани", { content:"selectFilter" } , ""], width:100, editor:"text" },
            { id:"K", header:[ "Дата ткани", { content:"textFilter" }, "" ], width:90,   editor:"text" },

            { id:"J", header:[ "Размер", { content:"selectFilter" }, "" ], width:70, batch:2, editor:"text" },

            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, editor:"text"},

            { id:"T", header:[ "Описание", { content:"textFilter" }, ""], width:100, disable: true, batch:2,
              editor:"popup",
              template:function(obj, common){
                if (obj.$group) return "";
                return obj.N+" "+obj.O+" "+obj.P+" "+obj.Q+" "+obj.R+" "+obj.T;
              }
            },
            //{ id:"O", header:"O", width:100 },
            //{ id:"P", header:"P", width:100 },
            //{ id:"Q", header:"Q", width:100 },
            //{ id:"R", header:"R", width:100 },
            { id:"S", header:[ "# клиента", { content:"textFilter" }, ""], width:70, batch:2, editor:"text" },
            //{ id:"T", header:"T", width:100 },
            // { id:"U", header:"U", width:100 },


            { id:"CA", header:[ "Время Крой", { content:"selectFilter" }, "" ], width:110,  editor:"date",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.CA));
              }

            },


            { id:"BA", header:[ "Ст.", { content:"selectFilter" }, "" ], width:50,  editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 500},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BA == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BA === null) ? "" : obj.BA;
              }
            },


            //{ id:"BV", header:[ "Фио Крой", { content:"selectFilter" }, { content:"mySummColumn" } ], width:115 , batch:1, editor:"text"},

            { id:"desc_sewing", header:[ "Причина", { content:"selectFilter" },""], width:150,  editor:"popup" , batch:1},
            //{ id:"W", header:"Статус", width:100, batch:3 },
            //{ id:"AH", header:"Дата", width:100, batch:3 },
            { id:"loss_sewing", header:[ "Классификация потерь", { content:"selectFilter" },""], width:110, batch:1, editor:"text" },
            { id:"time_loss_sewing", header:[ "Время потерь, мин", { content:"selectFilter" },""], width:110, batch:1, editor:"text" },

            { id:"V", header:[ "Сумма", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500},
              batch:2
            },
            { id:"AO", header:[ "Коэф. ден.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}, batch:2,

            },
            { id:"AB", header:[ "Коэф. вр.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:2,
            },
            { id:"Z", header:[ "Обивщик", { content:"selectFilter" }, "" ], width:100, editor:"text" },
            { id:"AG", header:[ "Коэф. ст.", { content:"textFilter" }, "" ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:2,
            },


            // Sawcut
            { id:"date_carpenter",header:[ "Дата стол.", { content:"selectFilter" },""], width:120, batch:6, editor:"date",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_carpenter));
              }
            },
            { id:"date_carpenter_plan",header:[ "Дата стол.план", { content:"selectFilter" },""], width:120, batch:6, editor:"date",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_carpenter_plan));
              }
            },
            { id:"date_sawcut",header:[ "Дата расп.факт", { content:"selectFilter" },""], width:120, batch:6, editor:"date",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_sawcut));
              }
            },
            { id:"date_sawcut_plan",header:[ "Дата расп.план", { content:"selectFilter" },""], width:120, batch:6, editor:"date",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_sawcut_plan));
              }
            },
            { id:"status_sawcut", header:[ "Расп.", { content:"selectFilter" },""], width:60, batch:6, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 600},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.status_sawcut == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.status_sawcut === null) ? "" : obj.status_sawcut;
              }
            },

            { id:"time_sawcut_start", header:[ "Время нач.", { content:"selectFilter" },""], width:120, batch:6, editor:"text",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.time_sawcut_start));
              }
            },
            { id:"time_sawcut_end", header:[ "Время оконч.", { content:"selectFilter" },""], width:120, batch:6 , editor:"text",
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.time_sawcut_end));
              }
            },
            { id:"desc_sawcut", header:[ "Причина", { content:"selectFilter" },""], width:150,  editor:"popup" , batch:6},
            { id:"loss_sawcut", header:[ "Классификация потерь", { content:"selectFilter" },""], width:110, batch:6, editor:"text" },
            { id:"time_loss_sawcut", header:[ "Время потерь, мин", { content:"selectFilter" },""], width:110, batch:6, editor:"text" },

            { id:"AU", header:"Паралон царги", width:115 , batch:3, editor:"text"},
            { id:"AV", header:"Статус", width:60, batch:3 , editor:"text"},
            { id:"AW", header:"Дата", width:90, batch:3 , editor:"text"},
            { id:"AZ", header:"Столярка", width:115 , batch:3, editor:"text"},
            //{ id:"BA", header:"Статус", width:60, batch:3 },
            { id:"BB", header:"Дата", width:90, batch:3 , editor:"text"},

            //{ id:"BP", header:"Статус", width:60, batch:3 },
            //{ id:"BQ", header:"Дата", width:90, batch:1, editor:"text" },

            //{ id:"BW", header:"Статус", width:60, batch:1, editor:"text" },
            //{ id:"BX", header:"Дата", width:90, batch:1, editor:"text" },
            { id:"CD", header:"Упаковка", width:80, batch:3, editor:"text" },
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
              if (item.B == 4)
                item.$css = "highlight";
              if (item.B == 3)
                item.$css = "highlight-blue";
              if (item.B == 2)
                item.$css = "highlight-green";
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
              this.adjustRowHeight("T", true);
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

        },

        {
           //hidden: true,
          type:"space", rows:[
            {
              id: 'dhx-gantt',
              template: function() {
                return '<div id="dhx-gantt" style="height:100%;"></div>';
              }
              //view:"layout",
            }
          ]
        },


      ]
    }
  }

  addGanttChart( tasks) {


    // let gantObj = {
    //   localId: 'gant-dhx',
    //   type: 'space',
    //   rows: [{
    //     //id: "dhx-gantt",
    //     view: "dhx-gantt",
    //     cdn: "https://cdn.dhtmlx.com/gantt/6.0",
    //     //height: 500,
    //
    //     ready: function (gantt_obj) {
    //
    //       gantt_obj.clearAll();
    //       gantt_obj.config.scale_unit = "hour";
    //       gantt_obj.config.date_scale = "%H";
    //       gantt_obj.config.duration_unit = 'minute';
    //       gantt_obj.config.round_dnd_dates = false;
    //       gantt_obj.config.duration_step = 1;
    //       gantt_obj.config.scale_height = 27;
    //       gantt_obj.parse(tasks);
    //     }
    //
    //   }]
    // };
    var hourToStr = gantt.date.date_to_str("%H");
    var hourRangeFormat = function(step) {
      return function(date){
        var intervalEnd = new Date(gantt.date.add(date, step, "hour") - 1)
        return hourToStr(date) + "-" + hourToStr(intervalEnd);
      };
    };

    // gantt.config.scale_unit = "hour";
    // gantt.config.date_scale = "%H";

    // gantt.config.duration_step = 1;
    // gantt.config.scale_height = 27;

    var zoomConfig = {
      levels: [
        // [
        //   { unit: "month", format: "%M %Y", step: 1},
        // ],
        // [
        //   { unit: "month", format: "%M %Y", step: 1},
        //   { unit: "day", format: "%d %M", step: 1}
        // ],
        // [
        //   { unit: "day", format: "%d %M", step: 1},
        //   { unit: "hour", format: hourRangeFormat(12), step: 12}
        // ],
        // [
        //   { unit: "day", format: "%d %M", step: 1},
        //   { unit: "hour", format: hourRangeFormat(6), step: 6}
        // ],
        [
          {unit: "day", format: "%d %M",step: 1},
          {unit: "hour",format: hourRangeFormat(3),step: 3}
        ],

        [
          { unit: "day", format: "%d %M", step: 1 },
          { unit: "hour", format: "%H", step: 1}
        ]
      ]
    }
    gantt.config.duration_unit = 'minute';
    gantt.config.round_dnd_dates = true;
    gantt.setWorkTime({hours : ["8:00-12:00", "13:00-17:00"]});
    gantt.config.start_date = new Date();
    gantt.config.work_time = true;
    gantt.config.skip_off_time = true;
    //gantt.config.min_column_width = 50;
    gantt.config.row_height =  30;

    //gantt.config.fit_tasks = true;

    gantt.ignore_time = function(date){
      if(!gantt.isWorkTime(date))
        return true;
    };



    // gantt.config.columns = [
    //   {name:"text",       label:"Модель",  width:"250", tree:true },
    //   {name:"start_date", label:"Старт", align:"center", width:"120", },
    //   {name:"duration",   label:"Длительность, мин",   align:"center",  width:44 },
    //   // {name:"add",        label:"",           width:44 }
    // ];
    gantt.templates.scale_cell_class = function(date){
      if(date.getDay()==0||date.getDay()==6){
        return "weekend";
      }
      if(!gantt.isWorkTime(date)){
        return "weekend";
      }
    };
    gantt.templates.timeline_cell_class = function(task,date){
      if(date.getDay()==0||date.getDay()==6){
        return "weekend" ;
      }
      if(!gantt.isWorkTime(date)){
        return "weekend";
      }
    };
    //gantt.config.fit_tasks = true;
    //gantt.config.duration_unit = "hour";
    var formatter = gantt.ext.formatters.durationFormatter({
      enter: "day",
      store: "minute", // duration_unit
      format: "day",
      hoursPerDay: 8,
      hoursPerWeek: 40,
      daysPerMonth: 30
    });
    var durationEditor = {
      type: "duration",
      map_to: "duration",
      formatter: formatter,
      min:0, max:1000
    };
    gantt.config.columns = [
      {name: "text", tree: true, width: 320, resize: true},
      {name: "start_date", width: 100, align: "center", resize: true,
        template: function(task) {
          return formatDateTime(task.start_date);
        },
      },
      {name: "duration", label:"Duration", resize: true, align: "center",
        template: function(task) {
          return formatter.format(task.duration);
        }, width: 70},
      //{name:"progress",   label:"Progress",   align:"center" },
      //{name: "add", width: 44}
    ];
    // gantt.config.lightbox.sections = [
    //   {name:"description", height:38, map_to:"text", type:"textarea",focus:true},
    //   {name:"priority", height:22, map_to:"priority",type:"select"},
    //   {name:"time", height:72, type:"duration", map_to:"auto"}
    // ];

    gantt.config.lightbox.sections = [
      {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
     // {name:"details",     height:38, map_to:"text", type:"textarea"},
      {name:"time",type:"duration", map_to:"auto",time_format:["%d","%m","%Y","%H:%i"]},

    ];



    gantt.templates.time_picker = function(date){
      return gantt.date.date_to_str(gantt.config.time_picker)(date);
    };



    gantt.clearAll();
    gantt.ext.zoom.init(zoomConfig);

    gantt.init("dhx-gantt");

    gantt.parse(tasks);
    //view.addView(gantObj);



  }

  getDataGantt(data) {
    let checkUpholstery = this.$$('check-upholstery').getValue();
    let checkSewing = this.$$('check-sewing').getValue();
    let checkCut = this.$$('check-cut').getValue();
    let checkCarpenter = this.$$('check-carpenter').getValue();
    let tasks = {
      data:[
      ],
      links:[
        //{ id:1, source:1, target:2, type:"1"},
      ]
    };
    let field = this.getSortFieldByTypeGroup();

    let scope = this;


    let group = '';
    let groupSub = '';
    let parent = 0;
    let fieldGroup = '';
    let fieldSubGroup = '';
    let fieldTimeStart = '';


    let times = this.getFieldsTime(field);

    data.forEach(function callback(item, index, array) {

      if (item[field] == null) return;
      //if (index > 3) return;


      let changeParams = {
        'fieldGroupTimeStart' : formatDateGantDay(item[field])+' 08:00',
        'fieldGroup' : item['BO'],
        //'durationModel' : '',
        //'filterByDateFact' : 'date_sewing' // 'AE' in getFilterFieldByTypeGroup
      }

      // taskItem[item[field]].push({id:item.id, text:item.A+' '+item.I, start_date:item[fieldsCut.start], duration:item[fieldsCut.time]*60,order:index,
      //   progress:0});
      fieldGroup = formatDate(item[field]);
      //4_edit
      let fieldGroupTimeStart = formatDateGantDay(item[field])+' 08:00';
      fieldTimeStart = formatDateGant(item[field]);
      //fieldTimeStart = formatDateGant(parserDateAEGant(item.C));
      if (field == 'AE') {
        fieldGroup = formatDate(parserDateAEGant(item[field]));
        fieldTimeStart = formatDateAEGant(parserDateAEGant(item[field]))+' 8:00';
        fieldGroupTimeStart = formatDateAEGant(parserDateAEGant(item[field]))+' 08:00';

      }
      fieldSubGroup = item.A;

      fieldGroup = times.fio+'_'+item[times['fio']];//item['BO']; //2_edit



        group = fieldGroup;
        tasks.data.push(scope.getItemGroup(field, item, fieldGroupTimeStart, 480, index, 0, '#625E93'));

          groupSub = fieldSubGroup;
          // if (scope.batchIndex == 4) {
          //   tasks.data.push(scope.getItem('AE', item, index, 0, '#65c16f'));
          //   return;
          // }
          // if (scope.batchIndex == 1) {
          //   tasks.data.push(scope.getItem('date_sewing', item, index, 0, '#65c16f'));
          //   return;
          // }
          // if (scope.batchIndex == 8) {
          //   tasks.data.push(scope.getItem('date_cut', item, index, 0, '#65c16f'));
          //   return;
          // }
          // if (scope.batchIndex == 10) {
          //   tasks.data.push(scope.getItem('date_carpenter', item, index, 0, '#65c16f'));
          //   return;
          // }

          tasks.data.push(scope.getItemModel(field, item, fieldTimeStart, 480, index, fieldGroup, '#625E93'));
          //tasks.data.push(scope.getItemCloth('date_cloth', item, index, groupSub, '#3498db'));
          //
          // tasks.data.push(scope.getItem('date_cut_plan', item, index, groupSub,'#3db9d3'));
          // tasks.data.push(scope.getItem('date_sewing_plan', item, index, groupSub, '#3db9d3'));
          // tasks.data.push(scope.getItem('date_carpenter_plan', item, index, groupSub, '#3db9d3'));
          // tasks.data.push(scope.getItem('date_upholstery_plan', item, index, groupSub, '#3db9d3'));


          // tasks.data.push(scope.getItem('date_cut', item, index, groupSub, '#65c16f'));
          // tasks.data.push(scope.getItem('date_sewing', item, index, groupSub, '#65c16f'));
          // tasks.data.push(scope.getItem('date_carpenter', item, index, groupSub, '#65c16f'));
          // tasks.data.push(scope.getItem('AE', item, index, groupSub, '#65c16f'));
          // tasks.data.push(scope.getItem('date_obivka', item, index, groupSub, '#d33daf'));

          // tasks.data.push(scope.getItem('date_cut_plan', item, index, groupSub, '#3db9d3'));
          // tasks.data.push(scope.getItem('date_sewing_plan', item, index, groupSub, '#65c16f'));
          // //tasks.data.push(scope.getItem('date_carpenter_plan', item, index, 0, '#3498db'));
          // tasks.data.push(scope.getItem('date_upholstery_plan', item, index, groupSub, '#d33daf'));
          // tasks.data.push(scope.getItem('date_carpenter', item, index, 0, '#3498db'));
          //tasks.data.push(scope.getItem('date_carpenter', item, index, groupSub, '#3498db'));
          //tasks.data.push(scope.getItem('date_cut', item, index, groupSub, '#3db9d3'));
          //tasks.data.push(scope.getItem('BU', item, index, groupSub, '#65c16f'));

          //tasks.data.push(scope.getItem(field, item, index, groupSub, '#d33daf'));
          if (field == 'date_upholstery_plan' || field == 'date_sewing_plan' || field == 'date_carpenter_plan' || field == 'date_cut_plan') {
            if (checkUpholstery) tasks.data.push(scope.getItem('date_upholstery_plan', item, index, groupSub, '#d33daf'));
            if (checkSewing) tasks.data.push(scope.getItem('date_sewing_plan', item, index, groupSub, '#65c16f'));
            if (checkCut) tasks.data.push(scope.getItem('date_cut_plan', item, index, groupSub, '#3db9d3'));
            if (checkCarpenter) tasks.data.push(scope.getItem('date_carpenter_plan', item, index, groupSub, 'yellow'));
          }
          if (field == 'AE' || field == 'date_sewing' || field == 'date_carpenter' || field == 'date_cut') {
            if (checkUpholstery) tasks.data.push(scope.getItem('AE', item, index, groupSub, '#d33daf'));
            if (checkSewing) tasks.data.push(scope.getItem('date_sewing', item, index, groupSub, '#65c16f'));
            if (checkCut) tasks.data.push(scope.getItem('date_cut', item, index, groupSub, '#3db9d3'));
            if (checkCarpenter) tasks.data.push(scope.getItem('date_carpenter', item, index, groupSub, 'yellow'));
          }

          //tasks.data.push(scope.getItem(field, item, index, groupSub, '#d33daf'));





      // tasks.links.push({ "id":scope.getId(item)+'date_cut_plan', "source":scope.getId(item)+'date_cut_plan', "target":scope.getId(item)+'date_sewing_plan', "type":"1"});
      // tasks.links.push({ "id":scope.getId(item)+'date_sewing_plan', "source":scope.getId(item)+'date_sewing_plan', "target":scope.getId(item)+'date_upholstery_plan', "type":"1"});
      // //tasks.links.push({ "id":scope.getId(item)+'date_carpenter_plan', "source":scope.getId(item)+'date_carpenter_plan', "target":scope.getId(item)+'date_upholstery_plan', "type":"1"});
      // tasks.links.push({ "id":scope.getId(item)+'date_upholstery_plan', "source":scope.getId(item)+'date_upholstery_plan', "target":scope.getId(item)+'date_upholstery_plan', "type":"2"});


      // tasks.links.push({ "id":scope.getId(item)+'date_cut', "source":scope.getId(item)+'date_cut', "target":scope.getId(item)+'date_sewing', "type":"1"});
      // tasks.links.push({ "id":scope.getId(item)+'date_sewing', "source":scope.getId(item)+'date_sewing', "target":scope.getId(item)+'AE', "type":"1"});
      // tasks.links.push({ "id":scope.getId(item)+'date_carpenter', "source":scope.getId(item)+'date_carpenter', "target":scope.getId(item)+'AE', "type":"1"});
      // tasks.links.push({ "id":scope.getId(item)+'AE', "source":scope.getId(item)+'AE', "target":scope.getId(item)+'AE', "type":"2"});


      //your iterator
     });
    /*
    "links":[
        { "id":1, "source":1, "target":2, "type":"1"},
        { "id":2, "source":2, "target":3, "type":"0"},
        { "id":3, "source":3, "target":4, "type":"0"},
        { "id":4, "source":2, "target":5, "type":"2"}
    ]
     */

    return tasks;
  }

  getId(item) {
    return item.A+'-'+item.id+'-';
  }

  getFieldsTime(fieldGroup) {
    let fields;
    fields  = {
      'date_carpenter' : {'start' : 'BC', 'end' : 'BD', 'time' : 'time_carpenter_fact', 'name' : 'Столярка факт', 'fio' : 'AZ',
        'plan' : 'date_carpenter_plan', 'status' : 'BA'
      },
      'date_carpenter_plan' :  {'start' : 'date_carpenter_plan', 'end' : 'date_carpenter_plan_end', 'time' : 'time_carpenter_plan', 'name' : 'Столярка план', 'fio' : 'AZ',
        'fact' : 'date_carpenter', 'status' : 'BA'
      },
      'date_sewing' : {'start' : 'BT', 'end' : 'BU', 'time' : 'time_sewing_fact', 'name' : 'Швека факт', 'fio' : 'BO',
        'plan' : 'date_sewing_plan',  'status' : 'BP'},
      'date_sewing_plan' :  {'start' : 'date_sewing_plan', 'end' : 'date_sewing_plan_end', 'time' : 'time_sewing', 'name' : 'Швека план', 'fio' : 'BO',
        'fact' : 'date_sewing',  'status' : 'BP'},
      'date_cut' : {'start' : 'BZ', 'end' : 'CA', 'time' : 'time_cut_fact', 'name' : 'Крой факт', 'fio' : 'BV',
        'plan' : 'date_cut_plan', 'status' : 'BW' },
      'date_cut_plan' : {'start' : 'date_cut_plan', 'end' : 'date_cut_plan_end', 'time' : 'time_cut_plan', 'name' : 'Крой план', 'fio' : 'BV',
        'fact' : 'date_cut', 'status' : 'BW' },
      'date_upholstery_plan' : {'start' : 'date_upholstery_plan', 'end' : 'date_upholstery_plan_end', 'time' : 'time_upholstery_plan', 'name' : 'Обивка план',
        'fio' : 'Z', 'fact' : 'AE', 'status' : 'W'},
      'AE' : {'start' : 'time_upholstery_start', 'end' : 'time_upholstery_end', 'time' : 'time_upholstery_fact', 'name' : 'Обивка факт', 'fio' : 'Z',
        'plan' : 'date_upholstery_plan', 'status' : 'W' },
      'date_obivka' : {'start' : 'date_obivka', 'end' : 'date_upholstery_plan_end', 'time' : 'time_upholstery_plan', 'name' : 'Обивка Excel', 'fio' : 'Z',
        'plan' : 'date_upholstery_plan', 'status' : 'W' },
      'date_cloth' : {'start' : 'C', 'end' : 'K', 'time' : '', 'name' : 'Заказ ткани', 'fio' : ''}
    };
    return fields[fieldGroup];
  }

  getItemDay(fieldGroup, timeStart, duration, index) {

    return {id:fieldGroup, text:fieldGroup, start_date:timeStart, duration: duration,order:10,
      progress:0, open: true};
  }
  getItemGroup(field, item, timeStart, duration, index, parent, color) {
    let times = this.getFieldsTime(field);
    //let timeStart = formatDateGant(item[times.start]);
    //duration = parseFloat(item['time_upholstery_plan'].replace(',','.'))*60;
    return {id:times.fio+'_'+item[times.fio], text:item[times.fio], start_date: timeStart,order:10, duration: duration,
      progress:0,  open: true, color: color};
    //type: "project", render:"split"
  }

  getItemModel(field, item, timeStart, duration, index, parent, color) {
    let times = this.getFieldsTime(field);
    timeStart = formatDateGant(item[times.start]);
    let timeEnds = formatDateGant(item[times.end]);
    //duration = parseFloat(item['time_upholstery_plan'].replace(',','.'))*60;
    //3_edit
    return {id:item.A, text:item.A+' '+item.I +'('+item[times.status]+')', start_date: timeStart, end_date: timeEnds,order:10,
      progress:0,  open: true, color: color,  parent: parent,
      render:"split",
    };
    //type: "project", render:"split"
  }
  getItem(field, item, index, parent, color) {

    let times = this.getFieldsTime(field);
    let duration = null;//Math.round(parseFloat(item[times.time].replace(',','.'))*60);
    let timeStart = formatDateGant(item[times.start]);
    let timeEnd = formatDateGant(item[times.end]);
    let progress = 0;
    let name = times.name;
    if (item.A == 16136) {
      //debugger;
    }
    if (typeof(times.plan) != "undefined" && times.plan !== null) {
      let timesPlan = this.getFieldsTime(times.plan);
      if (!timeStart) {
        //debugger;
        timeStart = formatDateGant(item[field]);
        if (field == 'AE') {
          timeStart = formatDateAEGant(parserDateAEGant(item[field]))+' 8:00';
        }

      } else {
        progress = 0.3;
      }
      if (!timeEnd) {
        duration = Math.round(parseFloat(item[timesPlan.time].replace(',', '.')) * 60);

      }
    }
    if (item[times.status] == 1) progress = 1;



    if (typeof(times.fact) != "undefined" && times.fact !== null) {

      let timesFact = this.getFieldsTime(times.fact);
      let start = formatDateGant(item[timesFact.start]);
      let end = formatDateGant(item[timesFact.end]);
      name = timesFact.name;

      if (start) {
        timeStart = start;
        if (end) {
          timeEnd = end;
          progress = 1;
        } else {
          duration = Math.round(parseFloat(item[times.time].replace(',','.'))*60);
          progress = 0.3;
        }

      }

    }

    let result = {id:this.getId(item)+field, text:name+'('+item[times.status]+')'+' ('+item[times.fio]+')', start_date: timeStart,  order:10,
      progress:progress,  parent: parent, color: color, db_id: item.id};
    if (duration) {
      result['duration'] = duration;
    } else {
      result['end_date'] = timeEnd;
    }
    return result;
  }
  getItemCloth(field, item, index, parent, color) {
    if (field == 'date_cloth') {

    }
    let times = this.getFieldsTime(field);
    let duration = 8*3*60;
    if (item.M == 'есть на складе') {
      duration = 8*60;
    }
    let timeStart = formatDateGant(parserDateAEGant(item.C));

    return {id:this.getId(item)+field, text:item.M+': Дата:'+times.K, start_date: timeStart, duration: duration, order:10,
      progress:0,  parent: parent, color: color};
  }


  init(view) {

    let table = this.$$("gant-table");
    let batchPlanCombo = this.$$("batch-plan");
    let employeeCombo = this.$$("employee");
    this.batchIndex = 0;
    // let timeline = this.$$("timeline");
    // let timelinePlan = this.$$("timeline-plan");
    //let gant = this.$$("gant");
    table.hide();

    //gantt.ext.zoom.init(zoomConfig);



    gantt.attachEvent("onLightboxSave", function(id,item){
      //any custom logic here

      let ids = id.split('-');
      let data = {};

      if (ids[2] == 'date_sewing' || ids[2] == 'date_cut' || ids[2] == 'AE' || ids[2] == 'date_obivka' || ids[2] == 'date_carpenter') return;

      data[ids[2]] = formatDateTimeDb(item.start_date);

      let tableUrl = scope.app.config.apiRest.getUrl('put',"accounting/orders", {}, item.db_id);
      webix.ajax().put(tableUrl, data).then(function(data){
        webix.message('Данные сохранены!');
      });
      return true;
    });

    gantt.attachEvent("onAfterTaskDrag", function(id, mode, e){
      var modes = gantt.config.drag_mode;
      let data = {};
      if(mode == modes.move ){
        let item = gantt.getTask(id);
        let ids = id.split('-');

        if (ids[2] == 'date_sewing' || ids[2] == 'date_cut' || ids[2] == 'AE' || ids[2] == 'date_obivka' || ids[2] == 'date_carpenter') return;

        data[ids[2]] = formatDateTimeDb(item.start_date);


        let tableUrl = scope.app.config.apiRest.getUrl('put',"accounting/orders", {}, item.db_id);
        webix.ajax().put(tableUrl, data).then(function(data){
          webix.message('Данные сохранены!');
        });
      }
    });



    let format = webix.Date.dateToStr("%d.%m.%y");
    let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    let employeeComboValue = employeeCombo.getText();


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
      let tasks = scope.getDataGantt(data.json().items);
      scope.addGanttChart( tasks);
    });
    // table.load(tableUrl,function(text, data, http_request){
    //   return  data.json().items;
    // });

    batchPlanCombo.attachEvent("onChange", function(value,item){
      webix.ajax().get(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
        scope.doTableGroup();
        scope.batchIndex = value;
        let tasks = scope.getDataGantt(data.json().items);
        scope.addGanttChart( tasks);
      });
    });

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
      if(editor.column === "date_sewing_plan"){
        record = table.getItem(editor.row);
        record['date_sewing'] = state.value;
        table.refresh(editor.row);
      }
      if(editor.column === "date_sawcut_plan"){
        record = table.getItem(editor.row);
        record['date_sawcut'] = state.value;
        table.refresh(editor.row);
      }

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
        let tasks = scope.getDataGantt(data.json().items);
        scope.addGanttChart( tasks);
        // timeline.clearAll();
        // timeline.parse(data.json().items);
        // timelinePlan.clearAll();
        // timelinePlan.parse(data.json().items);


      });
    });

    employeeCombo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = formatDate(dateTo.getValue());//+' 23:59';
      employeeComboValue = employeeCombo.getText();
      let employeeComboValueArray = employeeComboValue.split(' ');
      employeeComboValue = employeeComboValueArray[0];



      let filedFilter = scope.getFilterFieldByTypeGroup();
      let filedSort = scope.getSortFieldByTypeGroup();

      let filter = {
        filter: {}
      };

      filter['filter'][filedFilter] = {
        ">=": dateFromValue,
        "<=": dateToValue
      };
      let fieldEmployee = 'Z';
      if (employeeComboValue != '') {
        let record = employeeCombo.getPopup().getList().getItem(employeeCombo.getValue());
        if (record.department_id == 1) {
          fieldEmployee = 'Z';
        }
        if (record.department_id == 2) {
          fieldEmployee = 'AZ';
        }
        if (record.department_id == 3) {
          fieldEmployee = 'BO';
        }


        filter['filter'][fieldEmployee] = employeeComboValue;
      }


      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders",{
        "per-page": "500",
        sort: '[{"property":"'+filedSort+'","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        //filter: '{"'+filedFilter+'":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"},"Z":"'+employeeComboValue+'"}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });


      webix.ajax().get(tableUrl, filter).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
        scope.doTableGroup();
        let tasks = scope.getDataGantt(data.json().items);
        scope.addGanttChart( tasks);
        // timeline.clearAll();
        // timeline.parse(data.json().items);
        // timelinePlan.clearAll();
        // timelinePlan.parse(data.json().items);


      });
    });
  }

  doClickOpenAll() {
    let table = this.$$("gant-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  showBatch(newv){
    this.$$("gant-table").showColumnBatch(newv);
  }

  beforeDropChangeData(record, date) {
    //debugger;
    let table = this.$$("gant-table");
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
    let table = this.$$("gant-table");
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
      //table.parse(data.json().items);
      scope.doTableGroup();
      let tasks = scope.getDataGantt(data.json().items);
      scope.addGanttChart( tasks);
      table.enable();

    });


  }


  doPlanToggle(type)  {
    let table = this.$$("gant-table");
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
      let tasks = scope.getDataGantt(data.json().items);
      scope.addGanttChart(tasks);

      table.enable();
    });
  }

  getFilterFieldByTypeGroup() {

    let toggle = this.$$("toggle-plan");
    let field = 'AE';
    if (toggle.getValue() == 1) {
      field = 'date_sewing'; //1_edit
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
    return field;
  }

  doTableGroup()  {
    let toggle = this.$$("toggle-plan");
    let table = this.$$("gant-table");

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


      coef_sewing:["coef_sewing", "median" ],
      time_sewing:["time_sewing", "median" ],
      date_sewing_plan_end:["date_sewing_plan_end", "median"],
      time_sewing_fact:["time_sewing_fact", "median"],
      BO:["BO", "countSame" ],
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
      this.showBatch(8);
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
      this.showBatch(8);
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

  }

  doClickPrint() {
    let table = this.$$("gant-table");
    let scope = this;
    //table.css = 'my_style';
    table.showColumnBatch(10);
    table.hideColumn('A');
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
  }


  toggleColumn(table,column) {

    //if(table.isColumnVisible(column))
    table.hideColumn(column);
    // else
    //table.showColumn(column, {spans:spans});
  };

  doClickToExcel() {
    let table = this.$$("gant-table");
    table.showColumnBatch(10);
    table.hideColumn('A');
    webix.toExcel(table);
    table.showColumnBatch(1);
    table.showColumn('A');
  }
}