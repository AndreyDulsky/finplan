import {JetView} from "webix-jet";
import "components/searchClose";
import UpdateFormOrderView from "core/updateFormOrderView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";
import CheckFormView from "views/order/check-work";

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
    node.style.textAlign = "right";
    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);


webix.ui.datafilter.totalColumnCountEmpty = webix.extend({
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

webix.ui.datafilter.toolsContent = webix.extend({
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
var parserDate = webix.Date.strToDate("%Y-%m-%d");
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
                  inputWidth:220,
                  label: 'Дата отгрузки',
                  labelWidth:100,
                  width:230,
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
              icon: 'mdi mdi-undo',
              autowidth:true,
              value :true,
              click: function() { scope.doUndo() }

            },
            {
              view:"icon",
              //type:"icon",
              icon: 'mdi mdi-plus',
              autowidth:true,
              value :true,
              click: function() { scope.doAdd() }

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
              hidden: true,
              click: function() { scope.doClickOpenAll() }

            },
            { view:"select",  value:4, labelWidth:100, options:[
                { id:4, value:"Отгруженные" },
                { id:3, value:"На складе" },
                { id:1, value:"В заказах" },
                { id:6, value:"В обработке" }
              ],
              width: 200,
              hidden: true,
              localId: "select-type"
            },
            { view:"select",  value:2, labelWidth:100, options:[
                { id:1, value:"Производство" },
                { id:2, value:"Продажи" },
                { id:3, value:"Выработка" }
              ],
              width: 200,
              hidden: true,
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
          urlEdit: 'order',
          css:"webix_header_border webix_data_border",
          leftSplit:3,
          //rightSplit:2,
          select: "cell",
          resizeColumn: { headerOnly:true },
          localId: 'order-table',
          multiselect:true,
          //drag:true,
          //fixedRowHeight:false, //rowLineHeight:25, rowHeight:25,
          editable:true,
          visibleBatch:2,
          scroll: true,
          save: "api->accounting/orders",
          editaction: "dblclick",
          clipboard:"selection",
          //select:"cell",
          blockselect:true,
          tooltip:true,
          headermenu:true,
          columns:[
            { id:"index", header:[{content:'toolsContent'},'',''], width: 40,
              cssFormat: function() {
                return {'background-color': '#F4F5F9'};
              }
            },

            {
              id:"A", header:[ "# заказа", { content:"textFilter" },{ content:"totalColumnCount" } ], hidden: false,
              "css": {"color": "black", "text-align": "right", "font-weight": 500}, sort: "int",
              tooltip:"#F# #C#-#D# Дата клиента: #H# <br>#E# #I# #L# - Статус ткани: #M# Дата ткани: #K#<br>#N# #O# #P# #Q# #R# #T#",
            },
            {"id": "action-view", "header": ['','',''], "width": 50,
              template: function(obj,common) {
                return (obj.$group) ? '' : common.editIcon();
              }
            },
            // {
            //   id:"AE", header:"Дата", width:120,
            //   template:function(obj, common){
            //     if (obj.$group) return  obj.AE;
            //     return "";
            //   }
            //
            // },
            {
              id:"date_obivka", header:[ "Дата гот.", { content:"selectFilter" },"" ],	width:100,
              "css": {"color": "black", "text-align": "right", "font-weight": 100},
              sort: "date",
              format:webix.Date.dateToStr("%d.%m.%y")
            },

            {
              id:"date_shipment", header:[ "Дата отгр.", { content:"selectFilter" },"" ],	width:100,
              "css": {"color": "black", "text-align": "right", "font-weight": 500}, sort: "date", editor:"date",
              format:webix.Date.dateToStr("%d.%m.%y")
            },

            { id:"B", header:[ "Статус", { content:"numberFilter" },"" ], width:80, batch:2, sort: "int", editor:"text" },
            { id:"date_shipment_plan", header:[ "Дата.план.отгр.", { content:"textFilter" }, "" ], width:110, editor:"date",
              template: function(obj) {
                return formatDate(parserDate(obj.date_shipment_plan));
              }
            },
            { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:70, batch:2,  sort: "date" },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 , batch:2, sort: "date"},
            { id:"H", header:[ "Дата кл.", { content:"textFilter" }, "" ], width:90,  editor:"text" },
            { id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, sort: "string", editor:"text"  },
            { id:"storage", header:[ "Склад", { content:"selectFilter" }, "" ], width:120, sort: "string", editor:"text"  },
            { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:200, batch:2, sort: "string", editor:"text" },
            { id:"G",
              width:90,
              header:[ "Сумма", { content:"textFilter" }, { content:"totalColumn" }],
              "css": {"color": "black", "text-align": "right",  "font-weight": 500}, sort: "int",
              editor:"text"
              //footer: {content: "summColumn", css: {"text-align": "right"}}

            },



            { id:"I", header:[ "Изделие", { content:"textFilter" }, { content:"totalColumnCount" } ], width:200,  editor:"text" },
            { id:"J", header:[ "Размер", { content:"selectFilter" }, { content:"totalColumnCountEmpty" }  ], width:70, batch:2, editor:"text" },
            { id:"K", header:[ "Дата ткани", { content:"textFilter" }, "" ], width:90, batch:2,  editor:"text" },
            { id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150,  editor:"text" },
            { id:"M", header:[ "Статус ткани", { content:"selectFilter" } , ""], width:100, batch:2,  editor:"text" },
            { id:"N", header:[ "Ножки", { content:"selectFilter" } , ""], width:100, batch:2,  editor:"text" },
            { id:"O", header:[ "Пуг.", { content:"selectFilter" } , ""], width:100, batch:2,  editor:"text" },
            { id:"P", header:[ "Отстр.", { content:"selectFilter" } , ""], width:100, batch:2,  editor:"text" },
            { id:"S", header:[ "# клиента", { content:"textFilter" }, ""], width:90, batch:2,  editor:"text" },
            { id:"T", header:[ "Описание", { content:"textFilter" }, ""], width:300, disable: true, batch:2,
              editor:"popup",
              // template:function(obj, common){
              //   if (obj.$group) return "";
              //   return obj.N+" "+obj.O+" "+obj.P+" "+obj.Q+" "+obj.R+" "+obj.T;
              // }
            },
            // { id:"Q", header:[ "Пружина.", { content:"selectFilter" } , ""], width:100, batch:2,  editor:"text" },
            // { id:"R", header:[ "Под.мех.", { content:"selectFilter" } , ""], width:100, batch:2,  editor:"text" },

            { id:"discount", header:[ "Скидка", { content:"selectFilter" }, "" ],
              "css": {"color": "black", "text-align": "right",  "font-weight": 300},
              width:70, batch:2,  editor:"text" },
            { id:"sum_full", header:[ "Сумма.прайс", { content:"numberFilter" }, { content:"totalColumn" } ],
              "css": {"color": "black", "text-align": "right",  "font-weight": 300},
              width:100, batch:2,  editor:"text" },

            { id:"deal_id", header:[ "Номер.сделки", { content:"textFilter" },""], width:100,  editor:"text" , batch:2,
              template: function(obj) {
                if (!obj.deal_id) return '';
                return "<a href='https://greensofa.bitrix24.ua/crm/deal/details/"+obj.deal_id+"/' target='_blank'>"+obj.deal_id+"</a>";

              }
            },


            { id:"AF", header:[ "Комментарий работников", { content:"textFilter" },""], width:250,  editor:"popup" , batch:4},

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
              if (item.B == 6)
                item.$css = "highlight-green";
              item.index = this.count()+1;
            }

          },
          ready:function(){
            // var state = webix.storage.local.get("treetable_state");
            // if (state)
            //   this.setState(state);
            webix.ui({
              view:"contextmenu",
              data: ["Редактировать"],
              on:{
                onItemClick:function(id){
                  var context = this.getContext();
                  scope.$$("order-table").unselect();
                  scope.$$("order-table").select(context.id.row, context.id.column,true);
                  if (id == 'Редактировать') {
                    scope.formEdit.showForm(scope.$$("order-table"));
                  }
                  if (id == 'Копировать') {

                    var grid = scope.$$("order-table");

                    // let clipboard = document.getElementsByClassName("webix_clipbuffer")[0].value;
                    // grid.callEvent("onKeyPress", [
                    //   clipboard,
                    //   {ctrlKey:true,target:grid.$view}
                    // ]);
                  }
                }
              }
            }).attachTo(this);
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

            },
            onSelectChange: function(id, e, trg){
              let table = this;
              let selected = table.getSelectedId(true);
              //var text = "Selected: " + grid.getSelectedId(true).join();

              if (!this.rowSelect && selected.length > 0 && selected[0].column == 'index') {

                let selected = table.getSelectedId(true).join().split(',');


                let first = selected[0];
                let last = selected[selected.length - 1];
                this.rowSelect = true;
                //table.unselectAll();
                table.selectRange(first,'A',last,'T');

              } else {
                this.rowSelect = false;
              }

              //debugger;


            },
            onDataUpdate: function(id, data, old) {

            },
            onItemClick:function(id, e, trg) {
              if (id.column == 'action-view') {
                this.$scope.formCheckEdit.showWindow({},this);

              }
              if (id.column == 'index') {
                let table = this;

                //table.selectRange(id.row,'index',id.row,'T');
                this.rowSelect = false;

              } else {
                //this.rowSelect = false;
              }
            },
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
      //filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
      filter = {
        filter: {
          "or":[
            {"B": {"in":[3,1,2,5,6]}},
            {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
          ]
        }
      };
    }

    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", {
      "per-page": "1200",
      sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"A","direction":"ASC"}]',
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
        //filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
        filter = {
          filter: {
            "or":[
              {"B": {"in":[3,1,2,5,6]}},
              {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
            ]
          }
        };
      }

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "1200",
        sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"A","direction":"ASC"}]',
        //filter: '{"B":"'+selectTypeValue+'"}',
        //filter: '{"AE":{">=":"'+dateToValue+'"}}'
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

      if (selectTypeValue == 4) {
        //filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
        filter = {
          filter: {
            "or":[
              {"B": {"in":[3,1,2,5,6]}},
              {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
            ]
          }
        };
      }

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "1200",
        sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"A","direction":"ASC"}]',
        //filter: '{"B":"'+selectTypeValue+'"}',
        //filter: '{"AE":{">=":"'+dateToValue+'"}}'
      });

      webix.ajax().get(tableUrl, filter).then(function(data){
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
              {"B": {"in":[3,1,2,5,6]}},
              {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
            ]
          }
        };
      }
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "1200",
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

      if (selectTypeValue == 4) {
        //filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
        filter = {
          "or":[
            {"B": {"in":[3,1,2,5,6]}},
            {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
          ]
        };
      }

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "1200",
        sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"A","direction":"ASC"}]',
        //filter: '{"B":"'+selectTypeValue+'"}',
        //filter: '{"AE":{">=":"'+dateToValue+'"}}'
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

      webix.ajax().get( tableUrl, objFilter).then(function(data) {
        table.parse(data.json().items);
      });

    });

    table.attachEvent("onPaste", function(text) {
      // define your pasting logic here
      let sel = this.getSelectedId(true);
      let change = {};
      sel.forEach(item => {
        this.getItem(item.row)[item.column] = text;
        this.refresh(item.row);
        change[item.column] = text;
        change['id'] = item.row;
        table.updateItem(item.row, change)
      });

    });

    this.formEdit = this.ui(UpdateFormOrderView);
    this.formCheckEdit = this.ui(CheckFormView);
  }

  doRefresh() {
    let table = this.$$("order-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let selectType = this.$$("select-type");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    let selectTypeValue = selectType.getValue();
    let filter =  {filter:{"B": {"in":[selectTypeValue]}}};
    if (selectTypeValue == 4) {
      filter = {
        filter: {
          "or":[
            {"B": {"in":[3,1,2,5,6]}},
            {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
          ]
        }
      };
    }
    this.restApi = this.app.config.apiRest;
    let tableUrl = this.restApi.getUrl('get',"accounting/orders", {
      "per-page": "1200",
      sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"A","direction":"ASC"}]',
    });

    webix.extend(table, webix.ProgressBar);
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.restApi.getLoad(tableUrl, filter).then(function(data){
      table.clearAll();
      table.parse(data.json().items);
      table.enable();
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

  doAdd() {
    let table = this.$$('order-table');
    table.unselect();

    this.formEdit.showForm(table);
  }

  doClickPrint() {
    let table = this.$$("order-table");
    //table.showColumnBatch(2);
    webix.print(table, { fit:"data"});
    //table.showColumnBatch(1);
  }

  doClickToExcel() {
    let table = this.$$("order-table");
    webix.toExcel(table);
  }

  doUndo() {
    let table = this.$$("order-table");
    let scope = this;

    this.restApi = this.app.config.apiRest;
    let tableUrl = this.restApi.getUrl('get',"accounting/user/order-back", {});


    this.restApi.getLoad(tableUrl, {}).then(function(data){
      //table.parse(data.json());
      let notChange = {'updated':false, 'index':false,'AE':false,'date_obivka':false};
      let dataJson = data.json();
      let record = dataJson.data[0];
      let changeParams = record.change_params;

      let oldRecord = JSON.parse(record.old_record);
      let recordTable = table.getItem(record.model_id);
      let changeField ={'id': record.model_id };
      for(let key in changeParams) {
         if(isNaN(notChange[key])) {
           recordTable[key] = oldRecord[key];
           changeField[key] = oldRecord[key];
           table.refresh();
         }
      }
      console.log(changeField);
      scope.restApi.put('accounting/orders',changeField).then(function(data){
        recordTable['updated'] = data['updated'];
        for (let key in changeField) {
          table.addCellCss(record.model_id, key, "webix_editing_cell_green highlight");
          setInterval(function(){ table.removeCellCss(record.model_id, key, "webix_editing_cell_green highlight") }, 50000)
        }
        table.showItem(record.model_id);
      });


    });

  }
}