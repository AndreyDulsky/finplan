import {JetView} from "webix-jet";
import "components/searchClose";

webix.GroupMethods.median = function(prop, data){
  if (!data.length) return 0;
  var summ = 0;
  for (var i = data.length - 1; i >= 0; i--) {

    if (data[i].$level == 1 ) {
      if (!isNaN(prop(data[i]))) summ += prop(data[i]) * 1;
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

webix.Date.monthEnd = function(obj){
  obj = webix.Date.monthStart(obj);
  obj = webix.Date.add(obj, 1, "month");
  obj = webix.Date.monthStart(obj);
  obj = webix.Date.add(obj, -1, "minute");
  return obj;
}

let formatDate = webix.Date.dateToStr("%d.%m.%y");

export default class OrdersView extends JetView{



  config(){
    let scope = this;

    return {
      rows:[
        {
          cols:[
            {"view": "label", width: 200, height:30, template: "Заказы", css: { 'font-size':'17px', 'padding': '10px 0px 10px 15px', 'font-weight': 600}},
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
            { view:"select",  value:3, labelWidth:100, options:[

                { id:3, value:"На складе" },
                { id:4, value:"Отгруженные" },
                { id:1, value:"В заказах" },
                { id:6, value:"В обработке" }
              ],
              width: 200,
              localId: "select-type"
            },
            { view:"select",  value:2, labelWidth:100, options:[
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
            { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
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
          localId: 'order-table',
          multiselect:true,
          drag:true,
          //fixedRowHeight:false, //rowLineHeight:25, rowHeight:25,
          editable:true,
          visibleBatch:2,
          scroll: true,
          save: "api->accounting/orders",
          editaction: "dblclick",
          clipboard:"selection",
          select:"cell",
          columns:[

            {
              id:"A", header:[ "# заказа", { content:"textFilter" },"" ], hidden: false,
              "css": {"color": "black", "text-align": "right", "font-weight": 500}, sort: "int"
            },
            // {
            //   id:"AE", header:"Дата", width:120,
            //   template:function(obj, common){
            //     if (obj.$group) return common.treetable(obj, common) + obj.AE;
            //     return "";
            //   }
            //
            // },
            {
              id:"date_obivka", header:[ "Дата произ.", { content:"dateFilter" },"" ],	width:100,
              "css": {"color": "black", "text-align": "right", "font-weight": 500},
              sort: "date"
            },
            {
              id:"date_shipment", header:[ "Дата отгр.", { content:"dateFilter" },"" ],	width:100,
              "css": {"color": "black", "text-align": "right", "font-weight": 500}, sort: "date",
              format:webix.Date.dateToStr("%d.%m.%y")
            },

            { id:"B", header:[ "Статус", { content:"selectFilter" },"" ], width:80, batch:2, sort: "int", editor:"text" },
            { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:70, batch:2,  sort: "date" },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 , batch:2, sort: "date"},
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, sort: "string" },
            { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:200, batch:2, sort: "string", editor:"text" },
            { id:"G",
              width:90,
              header:[ "Сумма", { content:"textFilter" }, { content:"totalColumn" }],
              "css": {"color": "black", "text-align": "right",  "font-weight": 500}, sort: "int",
              editor:"text"
              //footer: {content: "summColumn", css: {"text-align": "right"}}

            },
            { id:"I", header:[ "Изделие", { content:"textFilter" }, "" ], width:200 },
            { id:"J", header:[ "Размер", { content:"selectFilter" }, "" ], width:70, batch:2 },
            { id:"K", header:[ "Дата кл.", { content:"textFilter" }, "" ], width:90, batch:2 },
            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150 },
            { id:"M", header:[ "Статус ткани", { content:"selectFilter" } , ""], width:100, batch:2 },
            { id:"T", header:[ "Описание", { content:"textFilter" }, ""], width:100, disable: true, batch:2,
              editor:"popup",
              template:function(obj, common){
                if (obj.$group) return "";
                return obj.N+" "+obj.O+" "+obj.P+" "+obj.Q+" "+obj.R+" "+obj.T;
              }
            },
            { id:"S", header:[ "# клиента", { content:"textFilter" }, ""], width:70, batch:2 },
          ],
          scheme:{
            $sort:{ by:"B", dir:"desc", as: "int" },
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

            }
          }

        }
      ]
    }
  }

  init(view) {

    let table = this.$$("order-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let selectType = this.$$("select-type");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    let selectTypeValue = selectType.getValue();
    let form = this.$$("form-search");
    let filter =  {filter:{"B": {"in":[selectTypeValue]}}};
    if (selectTypeValue == 4) {
      filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
    }

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", {
      "per-page": "500",
      sort: '[{"property":"B","direction":"DESC"}, {"property":"index","direction":"ASC"}]',
      //filter: '{"B":"'+selectTypeValue+'"}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });
    let scope =this;
    webix.ajax().get(tableUrl, filter).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
    });


    dateFrom.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      selectTypeValue = selectType.getValue();
      let filter =  {filter:{"B": {"in":[selectTypeValue]}}};

      if (selectTypeValue == 4) {
        filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
      }
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "500",
        sort: '[{"property":"date_shipment","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        //filter: '{"B":'+selectTypeValue+'}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });
      webix.ajax().get(tableUrl, filter).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
      });

    });

    dateTo.attachEvent("onChange", function(id) {

      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      selectTypeValue = selectType.getValue();

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders",{
        "per-page": "500",
        sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"B":'+selectTypeValue+'}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });

      webix.ajax().get(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
      });
    });

    selectType.attachEvent("onChange", function(id) {
      dateFromValue = format(dateFrom.getValue());
      dateToValue = format(dateTo.getValue());
      selectTypeValue = selectType.getValue();

      let filter =  {filter:{"B": {"in":[selectTypeValue]}}};

      if (selectTypeValue == 4) {
        //filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
        filter = {
          filter: {
            "or":[
              {"B": {"in":[3,1]}},
              {"date_shipment":{">=":dateFromValue}, "B":4}
            ]
          }
        };
      }
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "1000",
        sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        //filter: '{"B":'+selectTypeValue+'}',
        //filter: '{"AE":{">=":"01.02.20"}}'
      });
      webix.ajax().get(tableUrl, filter).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
      });

    });

    form.attachEvent("onChange", function(obj){

      //let filter = {'A':form.getValue()};

      let filter = {'B':selectTypeValue};

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "500",
        sort: '[{"property":"AE","direction":"ASC"}, {"property":"index","direction":"ASC"}]'
      });
      if (form.getValue() != "") {
        filter = {'A':form.getValue()};
      }
      let objFilter = { filter: filter };
      webix.extend(table, webix.ProgressBar);

      table.clearAll(true);
      table.showProgress({
        delay:2000,
        hide:false
      });

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/orders'), objFilter).then(function(data) {
        table.parse(data.json().items);
      });

    });
  }



  doClickOpenAll() {
    let table = this.$$("order-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  showBatch(newv){
    this.$$("order-table").showColumnBatch(newv);
  }
}