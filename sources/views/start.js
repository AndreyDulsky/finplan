import {JetView} from "webix-jet";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";
import CheckFormView from "views/order/check-work";

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

webix.GroupMethods.countValue = function(prop, data){
  if (!data.length) return 0;
  var count = 0;
  for (var i = data.length - 1; i >= 0; i--) {

    if (data[i].$level == 1 ) {
      let per = prop(data[i]);
      if (per != '') count = count+1;
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

      _val = /*implement your logic*/ obj[value.columnId];// / obj.OTHER_COL;
      if (_val!='') result = result+1;
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



webix.Date.monthEnd = function(obj){
  obj = webix.Date.monthStart(obj);
  obj = webix.Date.add(obj, 1, "month");
  obj = webix.Date.monthStart(obj);
  obj = webix.Date.add(obj, -1, "minute");
  return obj;
}


let formatDate = webix.Date.dateToStr("%d.%m.%y");
let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
var parserDate = webix.Date.strToDate("%Y-%m-%d");
var parserDateTime = webix.Date.strToDate("%Y-%m-%d %H:%i");

let parserDateCloth = webix.Date.strToDate("%d.%m.%y");

export default class StartView extends JetView{



	config(){

    let scope = this;
    let configColumns = [];
    let url = this.app.config.apiRest.getUrl('get',"accounting/orders",
      {
        "per-page": "1000",
        sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"AE":{">=":"01.12.20"}}'
        //filter: '{"AE":{">=":"01.02.20"}}'

      });

		return {
			rows:[
        {
          cols:[
            {"view": "label", width: 200, height:30, template: "План (общий)", css: { 'font-size':'17px', 'padding': '10px 0px 10px 15px', 'font-weight': 600}},
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
                  value: webix.Date.weekStart(new Date())
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
              icon: 'mdi mdi-calendar',
              localId: "toggleTime",
              autowidth:true,
              value :true,
              click: function() { scope.doTimeToggle() }

            },
            {
              view:"icon",
              //type:"icon",
              icon: 'mdi mdi-update',
              autowidth:true,
              value :true,
              click: function() { location.reload(true); }

            },

            {
              view:"toggle",
              type:"icon",
              icon: 'mdi mdi-file-tree',
              autowidth:true,
              value :true,
              click: function() { scope.doClickOpenAll() }

            },
            { view:"select",  value:1, labelWidth:100, options:[
              { id:1, value:"Производство" },
              { id:2, value:"Продажи" },
              { id:3, value:"Выработка" }
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
          urlEdit: 'order',
          css:"webix_header_border webix_data_border",
          leftSplit:3,
          //rightSplit:2,
          select: "cell",
          resizeColumn: { headerOnly:true },
          localId: 'start-table',
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
          clipboard:"selection",
          columns:[

            // {
            //   id:"id", header:"#", hidden: true
            // },

            {
              id:"A", header:[ "# заказа", { content:"textFilter" },"" ],	width:180,

              tooltip:"#F# #C#-#D# Дата клиента: #H# <br>#E# #I# #L# - Статус ткани: #M# Дата ткани: #K#<br>#N# #O# #P# #Q# #R# #T#",
              template:function(obj, common){

                if (obj.$level==1) return common.treetable(obj, common) + obj.value;
                //if (obj.$level == 2) return common.treetable(obj, common) + obj.A;
                //if (obj.$group) return common.treetable(obj,common) + (obj.value || obj.item);
                return obj.A;
              },
              "css": {"color": "black", "text-align": "right", "font-weight": 500}
            },
            {"id": "action-view", "header": "", "width": 50,
              template: function(obj,common) {
                return (obj.$group) ? '' : common.editIcon();
              }
            },
            {
              id:"AE", header:"Дата Гот.", width:120, editor: 'date',
              template:function(obj, common) {
                return formatDate(obj.date_obivka);
              }

            },
            { id:"I", header:[ "Изделие", { content:"textFilter" }, "" ], width:200, editor:"text" },
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, editor:"text"  },
            { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:150, editor:"text" },
            { id:"G",
              width:100,
              header:[ "Сумма план", { content:"textFilter" }, { content:"totalColumn" }],
              "css": {"color": "black", "text-align": "right",  "font-weight": 500}, editor:"text"
              //footer: {content: "summColumn", css: {"text-align": "right"}}

            },
            { id:"V", header:[ "Сумма факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}
            },


            { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:70,  editor:"text" },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 ,  editor:"text"},
            { id:"H", header:[ "Дата кл.", { content:"textFilter" }, "" ], width:70,  editor:"text" },


            { id:"AA", header:[ "К.об.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:80,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1

            },
            { id:"AB", header:[ "К.об.факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:80,
              "css": {"color": "green","text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"W", header:[ "Об.", { content:"selectFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.W == 1) {
                  return '<i class="mdi mdi-marker-check"></i><span style="display:none;">1</span>';
                }
                return  (obj.W === null) ? "" : obj.W;
              }
            },
            { id:"CH", header:[ "К.шв.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:80,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },

            { id:"coef_sewing", header:[ "К.шв.факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:80,
              "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:1
            },
            { id:"BP", header:[ "Шв.", { content:"selectFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BP == 1) {
                  return '<i class="mdi mdi-check-circle"></i><span style="display:none;">1</span>';
                }
                return  (obj.BP === null) ? "" : obj.BP;
              }
            },

            { id:"M", header:[ "Ст.ткани", { content:"selectFilter" } , ""], width:70, editor:"text" },
            { id:"K", header:[ "Дата ткани", { content:"textFilter" }, "" ], width:90,  editor:"text" },
            { id:"CI", header:[ "К.кр.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:85,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"coef_cut", header:[ "К.кр.факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:90,
              "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:1
            },
            { id:"BW", header:[ "Крой", { content:"selectFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BW == 1) {
                  return '<i class="mdi mdi-check-circle"></i><span style="display:none;">1</span>';
                }
                return  (obj.BW === null) ? "" : obj.BW;
              }
            },
            { id:"AG", header:[ "К.ст.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"coef_carpenter", header:[ "К.ст.факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"BA", header:[ "Ст.", { content:"selectFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BA == 1) {
                  return '<i class="mdi mdi-check-circle"></i><span style="display:none;">1</span>';
                }
                return  (obj.BA === null) ? "" : obj.BA;
              }
            },

            { id:"CF", header:[ "Уп.", { content:"numberFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.CF == 1) {
                  return '<i class="mdi mdi-check-circle"></i><span style="display:none;">1</span>';
                }
                return  (obj.CF === null) ? "" : obj.CF;
              }
            },
            {
              id:"date_shipment",
              header:[ "Дата отгр.", { content:"selectFilter" }, "" ],
              width:100,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              hidden: false,
              template: function(obj) {
                return formatDate(parserDate(obj.date_shipment));
              }
            },

            { id:"B", header:[ "Отгр.", { content:"selectFilter" }, "" ], width:70,  editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.B == 4) {
                  return '<i class="mdi mdi-check-circle"></i><span style="display:none;">отг.</span>';
                }
                return  (obj.B === null) ? "" : obj.B;
              }
            },





            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, editor:"text"},
            { id:"J", header:[ "Размер", { content:"selectFilter" }, { content:"totalColumnCount" } ],
              width:70,
              "css": {"text-align": "center"},
              batch:1, editor:"text" },




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
            {
              id:"date_obivka",
              header:[ "Дата Об.", { content:"selectFilter" }, "" ],
              width:80,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              template: function(obj) {
                return formatDate(parserDate(obj.date_obivka));
              }

            },

            {
              id:"date_sewing",
              header:[ "Дата Шв.", { content:"selectFilter" }, "" ],
              width:80,
              editor:"date",
              format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1
            },
            {
              id:"date_cut",
              header:[ "Дата Крой", { content:"selectFilter" }, "" ],
              width:100,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
              template: function(obj) {
                return formatDate(parserDate(obj.date_cut));
              }
            },

            { id:"date_carpenter", header:[ "Дата Ст.", { content:"selectFilter" }, "" ], width:90, batch:1 , editor:"date",
              format:webix.Date.dateToStr("%d.%m.%y"),},

            {
              id:"CG",
              header:[ "Дата Уп", { content:"selectFilter" }, "" ],
              width:100,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
            },






            { id:"coefMoney", header:[ "К.ден.план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
              template: function(obj) {
                let per =  parseFloat(obj.G.replace(",",""));
                if (obj.$group) return webix.Number.format(per/7860,{
                  decimalDelimiter:".",
                  decimalSize:2
                });
                return webix.Number.format(parseFloat(per/7860), {
                  decimalDelimiter:",",
                  decimalSize:2
                });
              }
            },
            { id:"AO", header:[ "К.ден.факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}, batch:1,


            },



            // { id:"AJ", header:[ "Коэф. шв+крой", { content:"textFilter" }, { content:"totalColumn" } ],
            //   width:120,
            //   "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            // },



            //{ id:"Z", header:"Обивка изг.", width:100, batch:3 },
            //{ id:"W", header:"Статус", width:100, batch:3 },
            //{ id:"AH", header:"Дата", width:100, batch:3 },
            // { id:"AK", header:"Обивка царги", width:110, batch:3, editor:"text" },
            // { id:"AL", header:"Статус царги", width:60, batch:3, editor:"text" },
            // { id:"AM", header:"Дата царги", width:90, batch:3, editor:"text" },
            // { id:"AP", header:"Поралон изг.", width:110, batch:3, editor:"text" },
            // { id:"AQ", header:"Статус пар. изг.", width:60, batch:3, editor:"text" },
            // { id:"AR", header:"Дата пор. изг.", width:90, batch:3 , editor:"text"},
            // { id:"AU", header:"Поралон царги", width:115 , batch:3, editor:"text"},
            // { id:"AV", header:"Статус пор. цар.", width:60, batch:3 , editor:"text"},
            // { id:"AW", header:"Дата пор. цар.", width:90, batch:3 , editor:"text"},
            { id:"Z", header:[ "Обивщик ФИО", { content:"selectFilter" }, "" ], width:100, editor:"text" },
            { id:"BO", header:[ "Пошив ФИО", { content:"selectFilter" }, "" ],  width:115 , batch:1, editor:"text"},
            { id:"BV", header:[ "Крой ФИО", { content:"selectFilter" }, "" ], width:115 ,  editor:"text"},
            { id:"AZ", header:[ "Столярка ФИО", { content:"selectFilter" }, "" ],  width:115 , editor:"text"},
            //{ id:"BA", header:"Статус", width:60, batch:3 },
            //{ id:"BB", header:[ "Дата ст.", { content:"selectFilter" }, "" ], width:90 , editor:"text"},

            //{ id:"BP", header:"Статус", width:60, batch:3 },

            //{ id:"BQ", header:[ "Дата пош.", { content:"selectFilter" }, "" ], width:90, batch:1, editor:"text" },

            //{ id:"BW", header:"Статус крой", width:60,  editor:"text" },
            //{ id:"BX", header:[ "Дата крой", { content:"selectFilter" }, "" ], width:90,  editor:"text" },




          ],
          save: "api->accounting/orders",
          scheme:{
            $group:{
              by:function(obj){ return formatDate(obj.date_obivka); }, // 'company' is the name of a data property
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
                coef_cut:["coef_cut", "median" ],
                coef_carpenter:["coef_carpenter", "median" ],
                CH:["CH", "median" ],
                CI:["CI", "median" ],

                value:[function(obj) {
                  return formatDate(obj.date_obivka);
                }],
                A:["A"],


                //state:["grouped","string"],
                //missing:false
              },
               // footer:{
               //   W:["W", "sum"],
               //   //V:["V"],
               //   row:function(obj ){ return "<span style='float:right;'>Всего: "+webix.i18n.numberFormat(obj.V)+"</span>"; }
               // },

              //row:"A"
            },


            $sort:{ by:"AE", dir:"asc", as: "date" },


            $init:function(item) {
              if (item.M == 'заказано') {
                item.$css = "highlight";

                if (item.K) {
                  let formatYear = webix.Date.dateToStr("%y");
                  let parseAE = webix.Date.strToDate("%d.%m.%y");
                  let year = formatYear(new Date());
                  let dateCloth = parserDateCloth(item.K + '.' + year);
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

            }
          },
          ready:function(){
            scope.configColumns = JSON.parse(JSON.stringify(this.config.columns));
            let state = webix.storage.local.get("start-table");
            if (state)
              this.setState(state);
            //this.openAll();
          },
          scroll: true,

          on: {
            "onColumnResize" : function() {

              webix.storage.local.put("start-table", this.getState());
            },
            "onAfterColumnDrop" : function() {
              webix.storage.local.put("start-table", this.getState());

            },
            "onAfterColumnShow" : function() {
              //webix.storage.local.put("start-table", this.getState());
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

            },
            onItemClick:function(id, e, trg) {

              if (id.column == 'action-view') {
                this.$scope.formEdit.showWindow({},this);

              }
            },
          }

        }
			]
		}
	}

	init(view) {

    let table = this.$$("start-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    this.restApi = this.app.config.apiRest;
    webix.extend(table, webix.ProgressBar);

    let tableUrl = this.restApi.getUrl('get',"accounting/orders", {
      "per-page": "1000",
      sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"AE":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });
    let scope =this;
    this.restApi.getLoad(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
    });


    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());

      let tableUrl = scope.restApi.getUrl('get',"accounting/orders", {
        "per-page": "1000",
        sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"AE":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });
      scope.restApi.getLoad(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
      });

    });

    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());

      let tableUrl = scope.restApi.getUrl('get',"accounting/orders",{
        "per-page": "1000",
        sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"AE":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      });

      scope.restApi.getLoad(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
      });
    });
    this.formEdit = this.ui(CheckFormView);

  }

  doTimeToggle()  {
    let toggle = this.$$("toggleTime");

    let table = this.$$("start-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    this.restApi = this.app.config.apiRest;
    webix.extend(table, webix.ProgressBar);

    let tableUrl = this.restApi.getUrl('get',"accounting/orders", {
      "per-page": "1000",
      sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"AE":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });
    let scope =this;

    this.restApi.getLoad(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      if (!toggle.getValue()) {
        table.group({
          by: function (obj) {
            return formatDateTime(obj.date_obivka)
          },
          map: {
            G: ["G", "median"],
            V: ["V", "median"],
            AO: ["AO", "median"],
            AA: ["AA", "median"],
            AB: ["AB", "median"],
            AG: ["AG", "median"],
            AJ: ["AJ", "median"],
            J: ["J", "countValue"],
            coef_sewing: ["coef_sewing", "median"],
            coef_cut: ["coef_cut", "median"],
            coef_carpenter: ["coef_carpenter", "median"],
            CH: ["CH", "median"],
            CI: ["CI", "median"],

            value: [function (obj) {
              return formatDateTime(obj.date_obivka);
            }],
            A: ["A"],
          }
        });
      } else {
        table.group({
          by: function (obj) {
            return formatDate(obj.date_obivka)
          },
          map: {
            G: ["G", "median"],
            V: ["V", "median"],
            AO: ["AO", "median"],
            AA: ["AA", "median"],
            AB: ["AB", "median"],
            AG: ["AG", "median"],
            AJ: ["AJ", "median"],
            J: ["J", "countValue"],
            coef_sewing: ["coef_sewing", "median"],
            coef_cut: ["coef_cut", "median"],
            coef_carpenter: ["coef_carpenter", "median"],
            CH: ["CH", "median"],
            CI: ["CI", "median"],

            value: [function (obj) {
              return formatDate(obj.date_obivka);
            }],
            A: ["A"],
          }
        });
      }

    });

  }

  doRefresh() {
    let table = this.$$("start-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let tableUrl = this.restApi.getUrl('get',"accounting/orders", {
      "per-page": "1000",
      sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"AE":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
    });
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.restApi.getLoad(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      table.enable();
    });
  }

  doClickOpenAll() {
    let table = this.$$("start-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  showBatch(newv){
    this.$$("start-table").showColumnBatch(newv);
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
      if(this.$$("start-table").isColumnVisible(element.id)) {
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

    let grid = this.$$("start-table");
    if(grid.isColumnVisible(id))
      grid.hideColumn(id, {spans:false});
    else
      grid.showColumn(id, {spans:false});

    if(scope.getItem(id).icon == iconEye) {
      icon = iconEyeSlash;
    }
    scope.getItem(id).icon = icon;
    scope.updateItem(id);
    webix.storage.local.put("start-table", grid.getState());
  }

  doClickPrint() {
    let table = this.$$("start-table");
    //table.showColumnBatch(2);
    webix.print(table, { fit:"data"});
    //table.showColumnBatch(1);
  }

  doClickToExcel() {
    let table = this.$$("start-table");
    webix.toExcel(table);
  }


}