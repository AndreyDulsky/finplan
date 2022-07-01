import {JetView, plugins} from "webix-jet";
import FormCoreDocumentWindow from "core/service/CoreDocumentWindow";
import FormCoreCharacteristicWindow from "core/service/CoreCharacteristicWindow";

import FormEditView from "core/service/FormDocumentEditView";
import FormCommnetView from "views/comment/index";
import FormViewView from "views/order/check-work";
import UpdateFormOrderView from "core/updateFormOrderView";
import WindowDirectoryView from "core/window/WindowDirectoryView";
import FormDocumentTableWindow from "core/service/FormDocumentTableWindow";


//import FormTransactionEditView from "core/service/formTransactionEditView";
import FormTransactionSchemaEditView from "core/service/FormTransactionSchemaEditView";

import FormDocumentEditView from "core/service/FormDocumentEditView";
import TableDynamic from  "components/tableService";
import formFilterView from "core/service/FormFilterView";

import FormView from "core/formView";

import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";
import "components/comboDirectory";

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
    decimalSize:0
  });
};

// webix.ui.datafilter.totalColumn = webix.extend({
//   refresh: function (master, node, value) {
//     var result = 0, _val;
//     let sumParent = {};
//     master.data.each(function (obj) {
//       if (obj.$group ) return;
//
//       if (sumParent[obj.$parent] && sumParent[obj.$parent][value.columnId]) {
//         sumParent[obj.$parent][value.columnId] += obj[value.columnId] * 1;
//       } else {
//         sumParent[obj.$parent] = {};
//         sumParent[obj.$parent][value.columnId] = obj[value.columnId] * 1;
//       }
//
//       _val = obj[value.columnId];
//       if (value.columnId == 'coefMoney') {
//         _val = obj.G/7860;
//       }
//       if (_val !== null) {
//         if (_val!= 0) {
//           _val = _val.toString().replace(".",",");
//         }
//         _val = webix.Number.parse(_val, {
//           decimalSize: 2, groupSize: 3,
//           decimalDelimiter: ",", groupDelimiter: ""
//         });
//       }
//       _val =  parseFloat(_val);
//       if (!isNaN(_val)) result = result+_val;
//     });
//     for (let key in sumParent) {
//       if (key == 0) continue;
//       //debugger;
//       let item =  master.getItem(key);
//
//       if (item && item.$group) {
//         master.getItem(key)[value.columnId] = sumParent[key][value.columnId];
//         //master.updateItem(key)
//       }
//     }
//
//     result = webix.i18n.numberFormat(result,{
//       groupDelimiter:"`",
//       groupSize:3,
//       decimalDelimiter:".",
//       decimalSize:2
//     })
//     //if (value.format)
//     //result = value.format(result);
//     if (value.template)
//       result = value.template({ value: result });
//     node.style.textAlign = "right";
//     node.innerHTML = result;
//   }
// }, webix.ui.datafilter.summColumn);


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

webix.ui.datafilter.mathColumn = webix.extend({
  refresh:function(master, node, value){
    var result = 0;
    var result2 = 0;
    let _val = 0;
    let _val2 = 0;
    let res = 0;
    let resultFormula = 'res = 0;';
    this.sumRes = {};
    let scope = this;
    master.data.each(function (obj) {

      if (obj.$group) return;
      if (obj['$'+value.columnId]) {
        let formula = obj['$'+value.columnId];
        var re = /[^\[.\]$']+/g;
        var newstr = formula.match(re);
        resultFormula = 'res';


        let isset = {};
        newstr.forEach(function(item) {
          let replace = item.replace('r,','');

          if (obj[replace]) {

            if (!scope.sumRes[replace]) {
              scope.sumRes[replace] = 0;
            }
            if (!isset[replace]) {
              //debugger;
              isset[replace] = true;
              scope.sumRes[replace] += obj[replace] * 1;
            }
            replace = "this.sumRes['"+replace+"']";
          }
          resultFormula += replace;
        });
      }
    });

    if (resultFormula != 'res = 0;') {
      eval(resultFormula);
    }
    result = value.format(res);
    node.innerHTML = result;
  }
}, webix.ui.datafilter.summColumn);

function formatPercent(value){
  return value*100;
}

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
      width:350,
      height:200
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
let formatDateHour = webix.Date.dateToStr("%d.%m.%y %H:00");
let formatDateShort = webix.Date.dateToStr("%d.%m");
let formatDateTimeDb = webix.Date.dateToStr("%Y-%m-%d %H:%i");
let formatMonthYear = webix.Date.dateToStr("%M %y");

let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
var parserDate = webix.Date.strToDate("%Y-%m-%d");
var parserDateTime = webix.Date.strToDate("%Y-%m-%d %H:%i");
var parserDateTimeGroup = webix.Date.strToDate("%d.%m.%y %H:%i");



function custom_checkbox(obj, common, value){
  if (value)
    return "<div class='webix_table_checkbox checked'> YES </div>";
  else
    return "<div class='webix_table_checkbox notchecked'> NO </div>";
};

function columnGroupTemplate(obj, common, item){

  if (obj.$group) return common.treetable(obj, common) + obj.property_value;

  return  common.icon(obj)+common.folder(obj, common)+' '+item;
}

webix.editors.buttonEditor = {
  focus:function(){
    this.getInputNode(this.node).focus();
    this.getInputNode(this.node).select();
  },
  getValue:function(){
    return this.getInputNode(this.node).refValue;
  },
  setValue:function(value, obj){
    let name = '';
    let item = this.config.collection.getItem(value);
    if (item) {
      name = item.value;
    }
    this.getInputNode(this.node).value =  name;//value;
    this.getInputNode(this.node).refValue =  value;

  },
  getInputNode:function(){
    return this.node.firstChild;
  },
  render:function(){
    return webix.html.create("div", {
      "class":"webix_dt_editor"
    }, "<input type='text' disabled='disabled' /><button class='editor-button' style='position: absolute;margin: 1px; right:0; height:25px;'>...</button>");
  }
}

export default class ServiceView extends JetView{
  config(){

    let hash = document.location.hash.split('/');
    let hashMode = hash[hash.length-1];
    let state = webix.storage.local.get(hashMode+"_filter_state");

    let scope = this;
    this.api = this.app.config.apiRest;


    return {
      localId: "layout"

    };
  }

  urlChange(view,url){
    var id = this.getParam("mode", true);
    var mode = this.getParam("mode", true);

    this.mode = mode;
    if (url[1]) {
      this.urlParams = url[1].params;
    }
    if (this.initParam) {

      this.setPage();
    }
    this.initParam = true;
  }

  init(view) {

    let scope = this;

    this.initParam =false;
    this.use(plugins.UrlParam, ["mode", "id", "account_id"]);
    //
    let mode = this.getParam('mode');
    //
    if (this.app.statusView) {
      mode = this.app.statusView;
      //this.app.statusView = '';
    }
    this.mode = mode;


    this.formEdit = this.ui(FormEditView);
    this.formComment = this.ui(FormCommnetView);
    this.formView = this.ui(FormViewView);
    //this.formTransactionEditView = this.ui(FormTransactionEditView);
    this.formTransactionSchemaEditView = this.ui(FormTransactionSchemaEditView);

    this.formFilterView = this.ui(formFilterView);
    this.formUpdateOrderView = this.ui(UpdateFormOrderView);
    this.formDocumentEditView = this.ui(FormDocumentEditView);
    this.formDocumentTableWindow = this.ui(FormDocumentTableWindow);
    this.formCoreDocumentWindow = this.ui(FormCoreDocumentWindow);
    this.formCoreCharacteristicWindow = this.ui(FormCoreCharacteristicWindow);




    this.windowDirectory = this.ui(WindowDirectoryView);
    let type = 'table';
    let config = {
      view: "table-service",
      state: {
        scope : scope,
        parent: null,
        params: {
          mode: mode,
          id: this.getParam('id'),
          account_id : this.getParam('account_id')
        },
        apiRest: this.app.config.apiRest,
        urlTableUserLists: this.app.config.apiRest.getUrl('get',"accounting/schema-table-user-lists",
          {
            'per-page':-1,
            'sort':'sort_order'
          }),
        urlTableSettingUsers: this.app.config.apiRest.getUrl('get',"accounting/schema-table-setting-users", {'per-page' : -1,
          'sort':'[{"property":"type_property","direction":"ASC"},{"property":"property_title","direction":"ASC"}]'
        }),
        urlTableUsers: this.app.config.apiRest.getUrl('get',"accounting/schema-table-users",{'per-page':-1,
          'sort':'[{"property":"sort_order","direction":"ASC"},{"property":"column_id","direction":"ASC"}]'
        }),
        urlTableUsersSave: "api->accounting/schema-table-users",
        urlTableSettingUsersSave: "api->accounting/schema-table-setting-users",
        urlTableUserListsPut: "accounting/schema-table-user-lists",
        formEdit: this.formEdit,
        formFilter: this.formFilterView,
        formView: this.formView,
        formComment: this.formComment,
        formUpdateOrderView: this.formUpdateOrderView,
        formDocumentEditView: this.formDocumentEditView,
        formDocumentTableWindow: this.formDocumentTableWindow,
        formCoreDocumentWindow: this.formCoreDocumentWindow,
        formCoreCharacteristicWindow: this.formCoreCharacteristicWindow,
        formTransactionSchemaEditView: this.formTransactionSchemaEditView,
        windowDirectory: this.windowDirectory,
        type: type,

      },
      stateCache : webix.storage.local.get(this.mode+'_'+type+"_filter_state"),

    };
    this.table = webix.ui(config, this.$$('layout') );
    //debugger;
    //this.app.config.localViews['service/'+mode] = this.table;



    this.lastXHR = {};

    webix.attachEvent("onBeforeAjax", function(mode, url, params, xhr,
                                               headers, file, promise){


      if (Object.keys(scope.lastXHR).length > 0) {
        for (let key in scope.lastXHR) {
          let item = scope.lastXHR[key];
          console.log(item.readyState);
          console.log('set abort = ');
          console.log(item);
          item.abort();
        };
      }


      scope.lastXHR[url]=xhr;

      console.log('set onBeforeAjax xhr = ');
      console.log(xhr);
      console.log(promise);
      if (!isNaN(promise)) {
        promise.then(function () {

          delete scope.lastXHR[url];
        }, function () {
          delete scope.lastXHR[url];
        });
      }
    });



  }

  setPage() {
    // this.table.state.params = {
    //   mode: this.mode,
    //   id: this.getParam('id'),
    //   account_id : this.getParam('account_id')
    // };
    this.table.state.params = this.urlParams;
    this.table.state.params['mode'] = this.mode;
    this.table.state.params['id'] = this.getParam('id');
    this.table.stateCache  = webix.storage.local.get(this.mode+"_table_filter_state");
    //debugger;
    //debugger;
    //this.app.config.localViews['service/'+this.mode] = this.table;
    this.table.setPage();

  }

}