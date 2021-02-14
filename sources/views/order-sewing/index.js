import {JetView} from "webix-jet";

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

webix.Date.monthEnd = function(obj){
  obj = webix.Date.monthStart(obj);
  obj = webix.Date.add(obj, 1, "month");
  obj = webix.Date.monthStart(obj);
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
let parserDate = webix.Date.strToDate("%Y-%m-%d");
let parserDateTime = webix.Date.strToDate("%Y-%m-%d %H:%i");
let parserDateHour = webix.Date.strToDate("%Y-%m-%d %H");

let formatDateHour =  webix.Date.dateToStr("%d.%m.%y %H");

export default class OrderSewingView extends JetView{



  config(){
    let scope = this;


    return {

      rows:[
        {
          cols:[
            {"view": "label", width: 200, height:30, template: "План Пошив", css: { 'font-size':'17px', 'padding': '10px 0px 10px 15px', 'font-weight': 600}},
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
                  value: webix.Date.add(new Date(), -1, "day")
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
              localId: "toggle-plan",
                value:1, labelWidth:100, options:[
                { id:1, value:"По дате шв.факт(групировка)/Дата обивки (фильтер)" },
                { id:2, value:"По дате шв.план" },
                { id:3, value:"По дате окончания шв.план" },
                { id:4, value:"По дате обивки факт" },
                { id:5, value:"По дате обивки план" },
                { id:6, value:"По дате распил.факт/Дата обивки" },
                { id:7, value:"По дате распил.план" },



              ],
              width: 250,
              on:{
                onChange:function(newv){
                  scope.doPlanToggle(newv);
                }
              }
            },
          ]
        },
        /*wjet::Settings*/
        {
          view:"treetable",
          css:"webix_header_border webix_data_border",
          leftSplit:2,
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

            // { id:"B", header:[ "Статус", { content:"selectFilter" },"" ], width:70, batch:2, editor:"select",
            //   options:[{"id": 1, "value": "1"}, {"id": 3, "value": "3"}, {"id": 4, "value": "4"},
            //     {"id": 5, "value": "5"}, {"id": 6, "value": "6"}
            //   ] },
            { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 , batch:2, editor:"text"},
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, editor:"text", batch:2  },
            { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:150, editor:"text", batch:2 },
            { id:"G",
              width:90,
              header:[ "Сумма", { content:"textFilter" }, { content:"totalColumn" }],
              "css": {"color": "black", "text-align": "right",  "font-weight": 500}, editor:"text",  batch:2
              //footer: {content: "summColumn", css: {"text-align": "right"}}

            },

            { id:"coefMoney", header:[ "Коэф. ден. план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              hidden: true,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
              template: function(obj) {
                let per =  parseFloat(obj.G.replace(",",""));
                if (obj.$group) return webix.Number.format(per/7860,{
                  decimalDelimiter:".",
                  decimalSize:2
                });
                return webix.Number.format(parseFloat(obj.G/7860));
              }
            },

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
            { id:"AA", header:[ "Коэф. об. план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1

            },
            { id:"CH", header:[ "Коэф.шв.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:125, editor:"text",
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"time_sewing", header:[ "Время.шв.план,ч", { content:"textFilter" }, { content:"totalColumn" } ],
              width:125, editor:"text",
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"time_sewing_fact", header:[ "Время.шв.факт,ч", { content:"textFilter" }, { content:"totalColumn" } ],
              width:125, editor:"text",
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            {
              id:"date_sewing",
              header:[ "Дата Шв.факт", { content:"selectFilter" }, "" ],
              width:110,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_sewing));
              }
            },
            {
              id:"date_sewing_plan",
              header:[ "Дата Шв.план", { content:"selectFilter" }, "" ],
              width:110,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
              template: function(obj) {
                return formatDateTime(parserDateTime(obj.date_sewing_plan));
              }
            },
            {
              id:"date_sewing_plan_end",
              header:[ "Дата Шв.план ок.", { content:"selectFilter" }, "" ],
              width:125,
              editor:"date",
              format:webix.Date.dateToStr("%d.%m.%y %H:%i"),
              batch:1,
              hidden: false,
              // template: function(obj) {
              //   return formatDateTime(parserDateTime(obj.date_sewing_plan_end));
              // }
            },
            { id:"BP", header:[ "Статус Пош.", { content:"selectFilter" }, "" ], width:100,  editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 500},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BP == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BP === null) ? "" : obj.BP;
              }
            },
            { id:"BO", header:[ "ФИО пош.", { content:"selectFilter" },{ content:"mySummColumn" }], width:115 , batch:1, editor:"text"},

            { id:"coef_sewing", header:[ "Коэф. Пош. гот.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:1
            },
            { id:"M", header:[ "Статус ткани", { content:"selectFilter" } , ""], width:100, batch:1,editor:"text" },
            { id:"K", header:[ "Дата ткани", { content:"textFilter" }, "" ], width:90,  batch:1, editor:"text" },

            { id:"J", header:[ "Размер", { content:"selectFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"K", header:[ "Дата клиента", { content:"textFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, batch:1,editor:"text"},

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

            { id:"W", header:[ "Статус Об.", { content:"selectFilter" }, "" ], width:90, batch:1, editor:"text",
              "css": {"color": "black", "text-align": "center",  "font-weight": 500},
              batch:2,
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.W == 1) {
                  return '<i class="mdi mdi-marker-check"></i>';
                }
                return  (obj.W === null) ? "" : obj.W;
              }
            },
            { id:"BX", header:[ "Дата Крой", { content:"selectFilter" }, "" ], width:100, batch:1, editor:"text" },
            { id:"BW", header:[ "Статус крой", { content:"selectFilter" }, "" ], width:100, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 500},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BW == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BW === null) ? "" : obj.BW;
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


            { id:"BV", header:[ "Фио Крой", { content:"selectFilter" }, { content:"mySummColumn" } ], width:115 , batch:1, editor:"text"},

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
            { id:"Z", header:[ "Обивщик", { content:"selectFilter" }, "" ], width:100, editor:"text", batch:2 },
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
        // {
        //   view:"timeline",
        //   //width:400,
        //   localId: "timeline",
        //   layout:"x",
        //   hidden: true,
        //   type:{
        //     height:60,
        //     templateDate:function(obj){
        //       return formatDateTime(obj.date);
        //     }
        //     //lineColor:color
        //   },
        //   scheme:{
        //     $init:function(obj){
        //       //obj.$css = obj.value;
        //       obj.date = obj.date_sewing;
        //       obj.value = obj.A;
        //       obj.details = obj.I;
        //     }
        //   },
        //   //data:webix.copy(time_data)
        // },
        // {
        //   view:"timeline",
        //   //width:400,
        //   localId: "timeline-plan",
        //   layout:"x",
        //   hidden: true,
        //   type:{
        //     height:60,
        //     templateDate:function(obj){
        //       return formatDateTime(obj.date);
        //     }
        //     //lineColor:color
        //   },
        //   scheme:{
        //     $init:function(obj){
        //       //obj.$css = obj.value;
        //       obj.date = obj.date_sewing_plan;
        //       obj.value = obj.A;
        //       obj.details = obj.I;
        //     }
        //   },
        //   //data:webix.copy(time_data)
        // },
        // {
        //   hidden: true,
        //   view:"dhx-scheduler",
        //   date:new Date(2010,0,5),
        //   mode:"week",
        //   //init:function(){...}, //scheduler config
        //   ready:function(){
        //     //scheduler.parse("..events data..")
        //   }
        // },
        // {
        //    //hidden: true,
        //   type:"space", rows:[
        //   {
        //     localId: 'gant',
        //     view:"dhx-gantt",
        //     cdn:"https://cdn.dhtmlx.com/gantt/5.2",
        //
        //   }
        // ]
        // },

        // {
        //   view:"chart",
        //   localId: "chart",
        //   width:900,
        //   height:250,
        //   type:"bar",
        //   barWidth:60,
        //   radius:2,
        //   gradient:"rising",
        //   xAxis:{
        //     template:"'#year#"
        //   },
        //   yAxis:{
        //     start:0,
        //     step:10,
        //     end:100
        //   },
        //   legend:{
        //     values:[{text:"Type A",color:"#58dccd"},{text:"Type B",color:"#a7ee70"},{text:"Type C",color:"#36abee"}],
        //     valign:"middle",
        //     align:"right",
        //     width:90,
        //     layout:"y"
        //   },
        //   series:[
        //     {
        //       value:"#sales#",
        //       color: "#58dccd",
        //       tooltip:{
        //         template:"#sales#"
        //       }
        //     },
        //     {
        //       value:"#sales2#",
        //       color:"#a7ee70",
        //       tooltip:{
        //         template:"#sales2#"
        //       }
        //     },
        //     {
        //       value:"#sales3#",
        //       color:"#36abee",
        //       tooltip:{
        //         template:"#sales3#"
        //       }
        //     }
        //   ],
        //   //data:multiple_dataset
        // }
      ]
    }
  }

  init(view) {

    let table = this.$$("sewing-table");
    // let timeline = this.$$("timeline");
    // let timelinePlan = this.$$("timeline-plan");
    //let gant = this.$$("gant");

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
      // timeline.clearAll();
      // timeline.parse(data.json().items);
      // timelinePlan.clearAll();
      // timelinePlan.parse(data.json().items);
      //gant.clearAll();

      // let gantData = {};
      // gantData['data'] = [];
      // data.json().items.forEach(function(obj, i) {
      //   //debugger;
      //   //let gantt_obj = {};
      //   gantt_obj.text = obj.I;
      //   gantt_obj.start_date = formatDateGant(parserDateTime(obj.date_sewing));
      //   gantt_obj.duration = 2;
      //   gantt_obj.order = 10;
      //   gantt_obj.progress = 10;
      //   gantt_obj.open = true;
      //   gantt_obj.parent = 0;
      //   //debugger;
      //   if (i==0) { gantData['data'][i] = gantt_obj };
      // });
    });
    // table.load(tableUrl,function(text, data, http_request){
    //   return  data.json().items;
    // });

    table.attachEvent("onAfterEditStop", function(state, editor, ignoreUpdate){
      let record = {};
      if(editor.column === "date_sewing_plan"){
         record = table.getItem(editor.row);
         record['date_sewing'] = state.value;
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
        // timeline.clearAll();
        // timeline.parse(data.json().items);
        // timelinePlan.clearAll();
        // timelinePlan.parse(data.json().items);


      });
    });
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

    let data = {'date_sewing':date};
    let tableUrl = this.app.config.apiRest.getUrl('put',"accounting/orders", {}, record.id);
    record.date_sewing = date;

    webix.ajax().put(tableUrl, data).then(function(data){
      webix.message('Данные сохранены!');
    });

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
      coef_sewing:["coef_sewing", "median" ],
      time_sewing:["time_sewing", "median" ],
      date_sewing_plan_end:["date_sewing_plan_end", "median"],
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

  }

  doClickPrint() {
    let table = this.$$("sewing-table");
    //table.showColumnBatch(2);
    webix.print(table, { fit:"data"});
    //table.showColumnBatch(1);
  }

  doClickToExcel() {
    let table = this.$$("sewing-table");
    webix.toExcel(table);
  }
}