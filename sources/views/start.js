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
    node.firstChild.style.textAlign = "right";
    node.firstChild.innerHTML = result;
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
    node.firstChild.style.textAlign = "right";
    node.firstChild.innerHTML = result;
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

export default class StartView extends JetView{



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
              icon: 'mdi mdi-settings',
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
          columns:[

            // {
            //   id:"id", header:"#", hidden: true
            // },

            {
              id:"A", header:[ "# заказа", { content:"textFilter" },"" ],	width:130,
              template:function(obj, common){

                if (obj.$level==1) return common.treetable(obj, common) + formatDate(obj.value);
                //if (obj.$level == 2) return common.treetable(obj, common) + obj.A;
                //if (obj.$group) return common.treetable(obj,common) + (obj.value || obj.item);
                return obj.A;
              },
              "css": {"color": "black", "text-align": "right", "font-weight": 500}
            },


            { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 , batch:2, editor:"text"},
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, editor:"text"  },
            { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:150, editor:"text" },
            { id:"G",
              width:90,
              header:[ "Сумма план", { content:"textFilter" }, { content:"totalColumn" }],
              "css": {"color": "black", "text-align": "right",  "font-weight": 500}, editor:"text"
              //footer: {content: "summColumn", css: {"text-align": "right"}}

            },
            { id:"coefMoney", header:[ "Коэф. ден. план", { content:"textFilter" }, { content:"totalColumn" } ],
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

            { id:"AA", header:[ "Коэф. вр. план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1

            },
            { id:"I", header:[ "Изделие", { content:"textFilter" }, "" ], width:200, editor:"text" },
            { id:"J", header:[ "Размер", { content:"selectFilter" }, { content:"totalColumnCount" } ],
              width:70,
              "css": {"text-align": "center"},
              batch:1, editor:"text" },
            { id:"H", header:[ "Дата клиента", { content:"textFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, editor:"text"},
            { id:"M", header:[ "Статус ткани", { content:"selectFilter" } , ""], width:100, editor:"text" },
            { id:"K", header:[ "Дата ткани", { content:"textFilter" }, "" ], width:70,  editor:"text" },

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
            { id:"W", header:[ "Об.", { content:"selectFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.W == 1) {
                  return '<i class="mdi mdi-marker-check"></i>';
                }
                return  (obj.W === null) ? "" : obj.W;
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
            { id:"BP", header:[ "Шв.", { content:"selectFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BP == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BP === null) ? "" : obj.BP;
              }
            },
            { id:"date_carpenter", header:[ "Дата Ст.", { content:"selectFilter" }, "" ], width:90, batch:1 , editor:"date",
              format:webix.Date.dateToStr("%d.%m.%y"),},
            { id:"BA", header:[ "Ст.", { content:"selectFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BA == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BA === null) ? "" : obj.BA;
              }
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

            { id:"BW", header:[ "Статус крой", { content:"selectFilter" }, "" ], width:100, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BW == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.BW === null) ? "" : obj.BW;
              }
            },
            {
              id:"date_packaging",
              header:[ "Дата Уп", { content:"selectFilter" }, "" ],
              width:100,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              batch:1,
              hidden: false,
              template: function(obj) {
                return formatDate(parserDate(obj.date_packaging));
              }
            },

            { id:"CD", header:[ "Упаковка", { content:"selectFilter" }, "" ], width:100, batch:1, editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.CD == 1) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.CD === null) ? "" : obj.CD;
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

            { id:"B", header:[ "Отгрузка", { content:"selectFilter" }, "" ], width:100,  editor:"text",
              "css": {"color": "green", "text-align": "center",  "font-weight": 300, "font-size": "14px"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.B == 4) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.B === null) ? "" : obj.B;
              }
            },

            { id:"V", header:[ "Сумма факт", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}
            },
            { id:"AO", header:[ "Коэф. ден.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}, batch:1,


            },
            { id:"AB", header:[ "Коэф. вр.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green","text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"Z", header:[ "Обивщик", { content:"selectFilter" }, "" ], width:100, editor:"text" },
            { id:"AG", header:[ "Коэф. ст.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"AJ", header:[ "Коэф. шв+крой", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"coef_sewing", header:[ "Коэф. Пош. гот.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:1
            },
            { id:"coef_cut", header:[ "Коэф. Крой. гот.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:120,
              "css": {"color":"green","text-align": "right",  "font-weight": 500}, batch:1
            },
            //{ id:"Z", header:"Обивка изг.", width:100, batch:3 },
            //{ id:"W", header:"Статус", width:100, batch:3 },
            //{ id:"AH", header:"Дата", width:100, batch:3 },
            { id:"AK", header:"Обивка царги", width:110, batch:3, editor:"text" },
            { id:"AL", header:"Статус царги", width:60, batch:3, editor:"text" },
            { id:"AM", header:"Дата царги", width:90, batch:3, editor:"text" },
            { id:"AP", header:"Поралон изг.", width:110, batch:3, editor:"text" },
            { id:"AQ", header:"Статус пар. изг.", width:60, batch:3, editor:"text" },
            { id:"AR", header:"Дата пор. изг.", width:90, batch:3 , editor:"text"},
            { id:"AU", header:"Поралон царги", width:115 , batch:3, editor:"text"},
            { id:"AV", header:"Статус пор. цар.", width:60, batch:3 , editor:"text"},
            { id:"AW", header:"Дата пор. цар.", width:90, batch:3 , editor:"text"},
            { id:"AZ", header:[ "Столярка ФИО", { content:"selectFilter" }, "" ],  width:115 , editor:"text"},
            //{ id:"BA", header:"Статус", width:60, batch:3 },
            { id:"BB", header:[ "Дата ст.", { content:"selectFilter" }, "" ], width:90 , editor:"text"},
            { id:"BO", header:[ "Пошив ФИО", { content:"selectFilter" }, "" ],  width:115 , batch:1, editor:"text"},
            //{ id:"BP", header:"Статус", width:60, batch:3 },

            { id:"BQ", header:[ "Дата пош.", { content:"selectFilter" }, "" ], width:90, batch:1, editor:"text" },
            { id:"BV", header:[ "Крой ФИО", { content:"selectFilter" }, "" ], width:115 ,  editor:"text"},
            //{ id:"BW", header:"Статус крой", width:60,  editor:"text" },
            { id:"BX", header:[ "Дата крой", { content:"selectFilter" }, "" ], width:90,  editor:"text" },
            { id:"CI", header:[ "Коэф. крой. план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:125,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            }



          ],
          save: "api->accounting/orders",
          scheme:{
            $group:{
              by:function(obj){ return obj.date_obivka}, // 'company' is the name of a data property
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
                value:["date_obivka"],
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
              if (item.B == 4)
                item.$css = "highlight";
              if (item.B == 3)
                item.$css = "highlight-blue";
              if (item.B == 2)
                item.$css = "highlight-green";
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

            }
          }

        }
			]
		}
	}

	init(view) {
    // let table = this.$$("start-table");
    // let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", {"per-page": "10", sort: '[{"property":"A","direction":"DESC"}]'});
    //
    // let scope =this;
    // webix.ajax(tableUrl).then(function(data) {
    //   let result = data.json().items;
    //   table.parse(result);
    //
    // });

    //scope.changeColumns(dateFrom, dateTo);
    //table.clearAll();
    //table.load(tableUrl);
    let table = this.$$("start-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", {
      "per-page": "500",
      sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"AE":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });
    let scope =this;
    webix.ajax().get(tableUrl).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
    });
    // table.load(tableUrl,function(text, data, http_request){
    //   return  data.json().items;
    // });

    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "500",
        sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"AE":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });
      webix.ajax().get(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
        // table.group({
        //   by:"A",
        //   map:{
        //     value:["A"],
        //     date_obivka:["date_obivka"],
        //     G:["G","median"],
        //     V:["V","median"],
        //     AO:["AO","median"],
        //     AA:["AA","median"],
        //     AB:["AB","median"],
        //     AG:["AG","median"],
        //     AJ:["AJ","median"],
        //     J:["J","countValue"],
        //     coef_sewing:["coef_sewing", "median" ],
        //     coef_cut:["coef_cut", "median" ],
        //   }
        // });
        // table.group({
        //   by:"date_obivka", // 'company' is the name of a data property
        //   map:{
        //     G:["G","median"],
        //     V:["V","median"],
        //     AO:["AO","median"],
        //     AA:["AA","median"],
        //     AB:["AB","median"],
        //     AG:["AG","median"],
        //     AJ:["AJ","median"],
        //     J:["J","countValue"],
        //     coef_sewing:["coef_sewing", "median" ],
        //     coef_cut:["coef_cut", "median" ],
        //     value:["date_obivka"],
        //     A:["A"],
        //
        //
        //     //state:["grouped","string"],
        //     //missing:false
        //   },
        // },0);


      });

    });

    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders",{
        "per-page": "500",
        sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"AE":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });

      webix.ajax().get(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
      });
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
        debugger;
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
}