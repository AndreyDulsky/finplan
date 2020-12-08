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

webix.ui.datafilter.totalColumn = webix.extend({
  refresh: function (master, node, value) {
    var result = 0, _val;
    master.data.each(function (obj) {
      if (obj.$group) return;
      _val = /*implement your logic*/ parseFloat(obj[value.columnId]);// / obj.OTHER_COL;
      if (!isNaN(_val)) result = result+_val;
    });
    result = webix.i18n.numberFormat(result,{
      groupDelimiter:",",
      groupSize:3,
      decimalDelimiter:".",
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
var parserDate = webix.Date.strToDate("%Y-%m-%d")

export default class StartView extends JetView{



	config(){
    let scope = this;
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
          columns:[

            // {
            //   id:"id", header:"#", hidden: true
            // },

            {
              id:"A", header:[ "# заказа", { content:"textFilter" },"" ],	width:130,
              template:function(obj, common){

                if (obj.$level == 1) return common.treetable(obj, common) + formatDate(obj.date_obivka);
                return obj.A;
              },
              "css": {"color": "black", "text-align": "right", "font-weight": 500}
            },

            { id:"B", header:[ "Статус", { content:"selectFilter" },"" ], width:70, batch:2, editor:"select",
              options:[{"id": 1, "value": "1"}, {"id": 3, "value": "3"}, {"id": 4, "value": "4"},
                {"id": 5, "value": "5"}, {"id": 6, "value": "6"}
              ] },
            { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 , batch:2, editor:"text"},
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, editor:"text"  },
            { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:150, editor:"text" },
            { id:"G",
              width:90,
              header:[ "Сумма", { content:"textFilter" }, { content:"totalColumn" }],
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
                return webix.Number.format(parseFloat(obj.G/7860));
              }
            },

            { id:"AA", header:[ "Коэф. вр. план", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1

            },
            { id:"I", header:[ "Изделие", { content:"textFilter" }, "" ], width:200, editor:"text" },
            { id:"J", header:[ "Размер", { content:"selectFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"K", header:[ "Дата клиента", { content:"textFilter" }, "" ], width:70, batch:2, editor:"text" },
            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, editor:"text"},
            { id:"M", header:[ "Статус ткани", { content:"selectFilter" } , ""], width:100, editor:"text" },
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
              "css": {"color": "green", "text-align": "center",  "font-weight": 500},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.W == 1) {
                  return '<i class="mdi mdi-check"></i>';
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
              "css": {"color": "black", "text-align": "center",  "font-weight": 500},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BP == 1) {
                  return '<i class="mdi mdi-check"></i>';
                }
                return  (obj.BP === null) ? "" : obj.BP;
              }
            },
            { id:"BA", header:[ "Ст.", { content:"selectFilter" }, "" ], width:50, batch:1, editor:"text",
              "css": {"color": "black", "text-align": "center",  "font-weight": 500},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.BA == 1) {
                  return '<i class="mdi mdi-check"></i>';
                }
                return  (obj.BA === null) ? "" : obj.BA;
              }
            },
            { id:"V", header:[ "Сумма", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}
            },
            { id:"AO", header:[ "Коэф. ден.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"color": "green", "text-align": "right",  "font-weight": 500}, batch:1,

            },
            { id:"AB", header:[ "Коэф. вр.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"Z", header:[ "Обивщик", { content:"selectFilter" }, "" ], width:100, editor:"text" },
            { id:"AG", header:[ "Коэф. ст.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            { id:"AJ", header:[ "Коэф. шв.", { content:"textFilter" }, { content:"totalColumn" } ],
              width:100,
              "css": {"text-align": "right",  "font-weight": 500}, batch:1,
            },
            //{ id:"Z", header:"Обивка изг.", width:100, batch:3 },
            //{ id:"W", header:"Статус", width:100, batch:3 },
            //{ id:"AH", header:"Дата", width:100, batch:3 },
            { id:"AK", header:"Обивка царги", width:110, batch:3, editor:"text" },
            { id:"AL", header:"Статус", width:60, batch:3, editor:"text" },
            { id:"AM", header:"Дата", width:90, batch:3, editor:"text" },
            { id:"AP", header:"Паралон изг.", width:110, batch:3, editor:"text" },
            { id:"AQ", header:"Статус", width:60, batch:3, editor:"text" },
            { id:"AR", header:"Дата", width:90, batch:3 , editor:"text"},
            { id:"AU", header:"Паралон царги", width:115 , batch:3, editor:"text"},
            { id:"AV", header:"Статус", width:60, batch:3 , editor:"text"},
            { id:"AW", header:"Дата", width:90, batch:3 , editor:"text"},
            { id:"AZ", header:"Столярка", width:115 , batch:3, editor:"text"},
            //{ id:"BA", header:"Статус", width:60, batch:3 },
            { id:"BB", header:"Дата", width:90, batch:3 , editor:"text"},
            { id:"BO", header:"Пошив", width:115 , batch:3, editor:"text"},
            //{ id:"BP", header:"Статус", width:60, batch:3 },
            { id:"BQ", header:"Дата", width:90, batch:3, editor:"text" },
            { id:"BV", header:"Крой", width:115 , batch:3, editor:"text"},
            { id:"BW", header:"Статус", width:60, batch:3, editor:"text" },
            { id:"BX", header:"Дата", width:90, batch:3, editor:"text" },
            { id:"CD", header:"Упаковка", width:80, batch:3, editor:"text" },
            { id:"CE", header:"Дата", width:90, batch:3, editor:"text" },



          ],
          save: "api->accounting/orders",
          scheme:{
            $group:{
              by:"date_obivka", // 'company' is the name of a data property
              map:{
                G:["G","median"],
                V:["V","median"],
                AO:["AO","median"],
                AA:["AA","median"],
                AB:["AB","median"],
                AG:["AG","median"],
                AJ:["AJ","median"],


                //state:["grouped","string"],
                missing:false
              },
               // footer:{
               //   W:["W", "sum"],
               //   //V:["V"],
               //   row:function(obj ){ return "<span style='float:right;'>Всего: "+webix.i18n.numberFormat(obj.V)+"</span>"; }
               // },

              //row:"A"
            },
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
            // var state = webix.storage.local.get("treetable_state");
            // if (state)
            //   this.setState(state);
            this.openAll();
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
              //debugger;
              //this.getItem(context.start).$css = ' highlight-blue';
              // for(let i=0;i< context.source.length; i++) {
              //   this.select(context.source[i]);
              // }
              //this.select(context.source.join(","));
              //this.refresh(context.start);
              //return false; //block the default behavior of event (cancels dropping)
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
}