import {JetView} from "webix-jet";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

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

export default class OrderPaymentView extends JetView{



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
            {"view": "label", width: 200, height:30, template: "План оплат", css: { 'font-size':'17px', 'padding': '10px 0px 10px 15px', 'font-weight': 600}},
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
              hidden: true,
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
            { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
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
          localId: 'order-payment-table',
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
              id:"A", header:[ "# заказа", { content:"textFilter" },"" ],	width:140,

              tooltip:"#F# #C#-#D# Дата клиента: #H# <br>#E# #I# #L# - Статус ткани: #M# Дата ткани: #K#<br>#N# #O# #P# #Q# #R# #T#",
              template:function(obj, common){

                if (obj.$level==1) return common.treetable(obj, common) + formatDate(obj.value);
                //if (obj.$level == 2) return common.treetable(obj, common) + obj.A;
                //if (obj.$group) return common.treetable(obj,common) + (obj.value || obj.item);
                return obj.A;
              },
              "css": {"color": "black", "text-align": "right", "font-weight": 500}
            },
            {
              id:"date_shipment",
              header:[ "Дата.отгр.", { content:"selectFilter" }, "" ],
              width:80,
              editor:"date",
              //format:webix.Date.dateToStr("%d.%m.%y"),
              hidden: false,
              template: function(obj) {
                return formatDate(parserDate(obj.date_shipment));
              }
            },
            { id:"B", header:[ "Статус", { content:"selectFilter" }, "" ], width:70,  editor:"text",
              "css": {"color": "green", "text-align": "center"},
              template: function(obj) {
                if (obj.$group) return "";
                if (obj.B == 4) {
                  return '<i class="mdi mdi-check-circle"></i>';
                }
                return  (obj.B === null) ? "" : obj.B;
              }
            },
            { id:"F", header:[ "Клиент", { content:"textFilter" }, "" ], width:150, editor:"text" },
            { id:"G",
              width:100,
              header:[ "Сумма план", { content:"textFilter" }, { content:"totalColumn" }],
              "css": {"color": "black", "text-align": "right",  "font-weight": 500}, editor:"text"
              //footer: {content: "summColumn", css: {"text-align": "right"}}
            },
            { id:"I", header:[ "Изделие", { content:"textFilter" }, { content:"totalColumnCount" } ], width:200, editor:"text" },
            { id:"pay_type", header:[ "Тип.опл", { content:"textFilter" }, "" ], width:50, editor:"text" },


            { id:"date_predict_plan", header:[ "Дата.аван.план", { content:"textFilter" }, "" ], width:90,   editor:"date",
              format: formatDate
            },
            { id:"pay_predict_plan", header:[ "План.aванс", { content:"textFilter" }, { content:"totalColumn" } ], width:90,   editor:"text",
              "css": {"color": "black", "text-align": "right"},
            },

            { id:"date_predict", header:[ "Дата.аван.факт", { content:"textFilter" }, "" ], width:90,   editor:"date",
              format: formatDate,
              "css": {"color": "green", "text-align": "center"},
            },
            { id:"pay_predict", header:[ "Факт.аванс", { content:"textFilter" }, { content:"totalColumn" } ], width:90,   editor:"text",
              "css": {"color": "green", "text-align": "right"},
            },

            { id:"date_remainder_plan", header:[ "Дата.ост.план", { content:"textFilter" }, "" ], width:90,   editor:"date",
              format: formatDate
            },
            { id:"pay_remainder_plan", header:[ "План.ост.", { content:"textFilter" },{ content:"totalColumn" } ], width:90,   editor:"text",
              "css": {"color": "black", "text-align": "right"},
            },

            { id:"date_remainder", header:[ "Дата.ост.факт", { content:"textFilter" }, "" ], width:90,   editor:"date",
              format: formatDate,
              "css": {"color": "green", "text-align": "center"},
            },
            { id:"pay_remainder", header:[ "факт.ост", { content:"textFilter" },{ content:"totalColumn" } ], width:90,   editor:"text",
              "css": {"color": "green", "text-align": "right"},
            },
            { id:"desc_pay", header:[ "Примечание", { content:"textFilter" }, "" ], width:150,  editor:"text" },


            { id:"C", header:[ "Принят", { content:"textFilter" }, "" ], width:80,  editor:"text" },
            { id:"D", header:[ "Отгрузка", { content:"textFilter" }, "" ], width:70 ,  editor:"text"},



            { id:"H", header:[ "Дата кл.", { content:"textFilter" }, "" ], width:80,  editor:"text" },




            //{ id:"E", header:[ "Тип", { content:"selectFilter" }, "" ], width:80, editor:"text"  },

            //{ id:"L", header:[ "Ткань", { content:"textFilter" }, "" ], width:150, editor:"text"},
            // { id:"J", header:[ "Размер", { content:"selectFilter" }, { content:"totalColumnCount" } ],
            //   width:70,
            //   "css": {"text-align": "center"},
            //   batch:1, editor:"text" },


            { id:"S", header:[ "# кл.", { content:"textFilter" }, ""], width:70,  editor:"text" },




          ],
          save: "api->accounting/orders",
          scheme:{
            $group:{
              by:function(obj){ return formatDate(obj.date_shipment_plan)}, // 'company' is the name of a data property
              map:{
                G:["G","median"],
                value:["date_shipment_plan"],
                A:["A"],
                pay_predict_plan: ['pay_predict_plan'],
                pay_predict: ['pay_predict'],
                pay_remainder_plan: ['pay_remainder_plan'],
                pay_remainder: ['pay_remainder'],

              },
            },


            $sort:{ by:"date_shipment_plan", dir:"asc", as: "date" },


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
            let state = webix.storage.local.get("order-payment-table");
            if (state)
              this.setState(state);
            //this.openAll();
          },
          scroll: true,

          on: {
            "onColumnResize" : function() {

              webix.storage.local.put("order-payment-table", this.getState());
            },
            "onAfterColumnDrop" : function() {
              webix.storage.local.put("order-payment-table", this.getState());

            },
            "onAfterColumnShow" : function() {
              //webix.storage.local.put("order-payment-table", this.getState());
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
              let record = this.getItem(context.order-payment);
              let recordSource = this.getItem(context.parent);
              scope.beforeDropChangeData(record, recordSource.value);

            }
          }

        }
      ]
    }
  }

  init(view) {

    let table = this.$$("order-payment-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFrom = this.$$("dateFrom");
    let dateTo = this.$$("dateTo");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());
    let form = this.$$("form-search");

    this.restApi = this.app.config.apiRest;
    webix.extend(table, webix.ProgressBar);

    let tableUrl = this.restApi.getUrl('get',"accounting/orders", {
      "per-page": "1000",
      sort: '[{"property":"date_shipment_plan","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"date_shipment_plan":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
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
        sort: '[{"property":"date_shipment_plan","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"date_shipment_plan":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
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
        sort: '[{"property":"date_shipment_plan","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        filter: '{"date_shipment_plan":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
      });

      scope.restApi.getLoad(tableUrl).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
      });
    });

    form.attachEvent("onChange", function(obj){

      let filter;// = {'A':form.getValue()};

      //filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
      filter = {
        "or":[
          {"date_shipment_plan":{">=":dateFromValue, '<=':dateToValue}}
        ]
      };





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

      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
        "per-page": "1000",
        sort: '[{"property":"date_shipment_plan","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
        //filter: '{"date_shipment_plan":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
        //filter: '{"B":"'+selectTypeValue+'"}',
        //filter: '{"AE":{">=":"'+dateToValue+'"}}'
      });

      webix.ajax().get( tableUrl, objFilter).then(function(data) {
        table.parse(data.json().items);
      });

    });




  }

  doRefresh() {
    let table = this.$$("order-payment-table");
    let format = webix.Date.dateToStr("%d.%m.%y");
    let dateFromValue = format(this.$$("dateFrom").getValue());
    let dateToValue = format(this.$$("dateTo").getValue());

    let tableUrl = this.restApi.getUrl('get',"accounting/orders", {
      "per-page": "1000",
      sort: '[{"property":"date_shipment_plan","direction":"ASC"}, {"property":"index","direction":"ASC"}]',
      filter: '{"date_shipment_plan":{">=":"'+dateFromValue+'","<=":"'+dateToValue+'"}}',
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
    let table = this.$$("order-payment-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  showBatch(newv){
    this.$$("order-payment-table").showColumnBatch(newv);
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
      if(this.$$("order-payment-table").isColumnVisible(element.id)) {
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

    let grid = this.$$("order-payment-table");
    if(grid.isColumnVisible(id))
      grid.hideColumn(id, {spans:false});
    else
      grid.showColumn(id, {spans:false});

    if(scope.getItem(id).icon == iconEye) {
      icon = iconEyeSlash;
    }
    scope.getItem(id).icon = icon;
    scope.updateItem(id);
    webix.storage.local.put("order-payment-table", grid.getState());
  }

  doClickPrint() {
    let table = this.$$("order-payment-table");
    //table.showColumnBatch(2);
    webix.print(table, { fit:"data"});
    //table.showColumnBatch(1);
  }

  doClickToExcel() {
    let table = this.$$("order-payment-table");
    webix.toExcel(table);
  }


}