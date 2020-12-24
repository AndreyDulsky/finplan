import {JetView} from "webix-jet";
//import {cashes} from "models/cashes";
import CashEditView from "views/transaction/cashEdit";
import {getRestUrl} from "models/rest";

import {accounts} from "models/transaction/accounts";
import {contragents} from "models/transaction/contragents";
import {projects} from "models/transaction/projects";
import {categories} from "models/transaction/categories";
import UpdateJetView from "core/updateJetView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

export default class CashesView extends JetView {
    constructor(app, name, urlConfig, data){
        super(app,name);
        this._componentData = data;
        //this.grid_config = config;
        this.urlConfig = urlConfig;
    }

    config(){
        const locale = this.app.getService("locale");
        const _ = locale._;
        return {
          type:"wide",
          cols:[
            {
              css:"webix_shadow_medium",
              rows: [
                {
                "view": "form",
                "localId": "searchFormOperation",
                "autoheight": false,
                "width": 250,
                "margin": 0,
                "scroll": "auto",
                "elements": [{"label": "Тип", "view": "label"}, {
                  "cols": [{
                    "view": "checkbox",
                    "localId": "search_type_operation",
                    "name": "type_operation.checkbox1",
                    "borderless": 1,
                    "css": "small",
                    "width": 33,
                    "value": "1",
                    "checkValue": "1",
                    "uncheckValue": 0
                  }, {"label": "Поступление", "view": "label"}], "height": 30
                }, {
                  "cols": [{
                    "view": "checkbox",
                    "width": 33,
                    "name": "type_operation.checkbox2",
                    "value": "2",
                    "checkValue": "2",
                    "uncheckValue": 0
                  }, {"label": "Выплата", "view": "label"}], "height": 30
                }, {
                  "cols": [{
                    "view": "checkbox",
                    "width": 33,
                    "name": "type_operation.checkbox3",
                    "value": "3,4",
                    "checkValue": "3,4",
                    "uncheckValue": 0
                  }, {"label": "Перемещение", "view": "label"}], "height": 30
                }, {"label": "Дата оплаты", "view": "label"}, {
                  "cols": [{
                    "view": "checkbox",
                    "width": 33,
                    "name": "is_committed.checkbox1",
                    "value": "1",
                    "uncheckValue": 0,
                    "checkValue": "1"
                  }, {"label": "Подтвержена", "view": "label"}], "height": 30
                }, {
                  "cols": [{
                    "view": "checkbox",
                    "width": 33,
                    "name": "is_committed.checkbox2",
                    "value": "2",
                    "uncheckValue": 0,
                    "checkValue": "2"
                  }, {"label": "Не подтвержена", "view": "label"}], "height": 30
                }, {"view": "datepicker-close", "name": "date_operation"}, {
                  "label": "Счет и Юр.лицо",
                  "view": "label",
                  "height": 25
                }, {
                  "localId": "searchAccountCombo",
                  "options": [],
                  "view": "combo-close",
                  "name": "account_id"
                }, {"label": "Контрагент", "view": "label", "height": 25}, {
                  "localId": "searchContragentCombo",
                  "view": "combo-close",
                  "options": [],
                  "name": "contragent_id"
                }, {"label": "Статья", "view": "label", "height": 25}, {
                  "localId": "searchCategoryCombo",
                  "view": "combo-close",
                  "options": [],
                  "name": "category_id"
                }, {"label": "Проект", "view": "label", "height": 25}, {
                  "localId": "searchProjectCombo",
                  "view": "combo-close",
                  "options": [],
                  "name": "project_id"
                }, {"label": "Сумма", "view": "label", "height": 25}, {
                  "cols": [{
                    "view": "text",
                    "value": "",
                    "placeholder": "от",
                    "name": "value.range.1"
                  }, {"label": "-", "view": "label", "width": 25}, {
                    "view": "text",
                    "value": "",
                    "placeholder": "до",
                    "name": "value.range.2"
                  }]
                }]
              }],
            },
            {

              rows: [
                {
                  "view": "toolbar",
                  "height": 40,
                  "paddingY":2,
                  "cols": [
                    { "view": "label", height:50, css: { 'font-size':'22px', 'padding': '5px 0px 10px 15px', 'font-weight': 700}, template:"<div>Операции</div>", borderless: true, width:130},
                    {
                      "label": "Добавить",
                      "type":"icon",
                      "icon":"mdi mdi-plus",
                      "view": "button",
                      "height": 50,
                      "css": "webix_primary",
                      //"width": 120,
                      autowidth:true,
                      click: () => this.doAddClick()
                    },
                    {},
                    { "label": "", "view": "search-close", "width": 300,  "align" :"right"  },
                  ]
                },
                {
                  "view": "treetable",
                  //"id": "transaction",
                  "localId": "transaction",
                  urlEdit: 'transaction',
                  //"autoHeight": false,
                  select: true,
                  scrollX: false,
                  hover: "myhover",

                  // scheme: {
                  //   $sort:{ by:"date_operation", dir:"desc" },//not dynamic loading
                  //
                  // },
                  //fixedRowHeight:false,
                  //rowLineHeight: 25,
                  rowHeight:43,
                  "columns":
                    [{
                      "id": "ch1",
                      "header": {"content": "masterCheckbox"},
                      "checkValue": "on",
                      "uncheckValue": "off",
                      //"template": "{common.checkbox()}",
                      "width": 40,
                      template: function(obj,common, value, config){
                        if (obj.$level==1) return common.checkbox(obj,common, value, config);
                        return "";
                      }
                    }, {
                      "id": "is_committed",
                      "header": "",
                      "width": 30,
                      template: function(obj,common, value, config) {
                        if (obj.$level==1) return "<span class='mdi mdi-check' value='"+obj.is_committed+"' />";
                        return "";
                      }
                    }, {
                      "id": "date_operation",
                      "header": "Дата",
                      "sort": "string",
                      "editor": "date",
                      "adjust": true,
                      //"format" : webix.i18n.longDateFormatStr,
                      template:function(obj, common) {
                        let result = '';

                        if (obj.$level==1 && obj.$count > 1) result = common.icon(obj, common) + webix.i18n.longDateFormatStr(obj.date_operation);
                        if (obj.$level!=1)  result = "<div class='subrowimage'><div></div></div>";
                        if (obj.$level==1 && obj.$count < 2) result = "<div style='margin-left:20px;'>"+webix.i18n.longDateFormatStr(obj.date_operation)+"</div>";
                        if (obj.$level==1 && obj.is_committed == 2) result = '<div style="color:blue">'+result+'</div>';
                        return result;
                      }
                    },
                      {"id": "account", "header": ["Счет"],
                        //"map": "#account.name#",
                        "template": "#account.name#",
                        "adjust": true,
                        template:function(obj, common) {
                          let result = obj.account.name;

                          if (obj.type_operation == 3) result = '<span style="line-height: 20px; display: block;">'+obj.account.name+'</span>';

                          return result;
                        }
                      },
                      {
                        "id": "type_operation",
                        "width": 50,
                        "header": "Тип",
                        "sort": "server",
                        //"adjust": true,
                        template : function(obj) {

                          if (obj.type_operation == 1) {
                            return '<span class="webix_icon wxi-angle-double-left" style = "color: green"></span>';
                          }
                          if (obj.type_operation == 2) {
                            return '<span class="webix_icon wxi-angle-double-right" style = "color: red"></span>';
                          }
                          if (obj.type_operation == 3 || obj.type_operation == 4) {
                            return '<span class="webix_icon wxi-sync" style = "color: grey"></span>';
                          }
                        }
                      },
                      {
                        "id": "contragent",
                        "header": "Контрагент",
                        //"map": "#contragent.name#",
                        //"template": "#contragent.name#",

                        "fillspace": true,
                        "template" : function(obj) {


                          if (obj.$level==1 && obj.type_operation == 3)  return '';
                          if (obj.$level==1 && obj.$count>1 && obj.contragent.name=="") return '<span class="webix_snippet_tag">'+obj.$count+' контрагента</span>';
                          //if (obj.$level==1 && obj.$count>1 && obj.contragent.name=="") return '';
                          return  obj.contragent.name;
                        }
                      },
                      {
                        "id": "category",
                        "header": "Статья",
                        //"fillspace": true,
                        "width" : 200,
                        //"map": "#category.name#",
                        //"template": "#category.name#",
                        "template" : function(obj) {
                          //debugger;
                          let comment = (obj.comment) ?obj.comment : '';
                          if (obj.$level==1 && obj.type_operation == 3)  return '<span class="webix_snippet_tag">Перемещение</span>';
                          if (obj.$level==1 && obj.$count>1 && obj.category.name=="") return '<span class="webix_snippet_tag">'+obj.$count+' статьи</span>';
                          //if (obj.$level==1 && obj.$count>1 && obj.category.name=="") return '';
                          return  '<span style="display: block; line-height: 22px;">'+obj.category.name+'</span>'+'<span style="display: block; line-height: 15px; font-size: 11px;color: #666;">'+comment+'</span>';
                        },
                        "sort": "string"
                      },
                      {
                        "id": "project",
                        "header": "Проект",
                        "fillspace": true,
                        //"adjust": true,
                        "autoheight": true,
                        //"template": "#project.name#",
                        "template" : function(obj) {
                          // if (obj.$count>1 && obj.type_operation == 2) {
                          //   debugger;
                          // }

                          if (obj.$level==1 && obj.type_operation == 3)  return '';
                          if (obj.$level==1 && obj.$count>1 && obj.type_part_id == 4) return '<span class="webix_snippet_tag">'+obj.$count+' проекта</span>';
                          //if (obj.$level==1 && obj.$count>1 && obj.project.name=="") return '';
                          return  obj.project.name;
                        },
                        //"map": "#project.name#"
                      },
                      {
                        "id": "value",
                        "header": "Сумма",
                        "adjust": true,
                        "css": {"color": "red", "text-align": "right"},
                        template : function(obj){
                          if (obj.type_operation == 1) {
                            return '<span style = "color: green; text-align: right;">+ '+ webix.Number.format(obj.value, {
                              decimalSize: 0, groupSize: 3,
                              decimalDelimiter: ".", groupDelimiter: " "
                            })+'</span>';
                          }
                          if (obj.type_operation == 2) {
                            return '<span style = "color: red;  text-align: right;">- '+webix.Number.format(obj.value, {
                              decimalSize: 0, groupSize: 3,
                              decimalDelimiter: ".", groupDelimiter: " "
                            })+'</span>';
                          }
                          if (obj.type_operation == 3) {

                            return '<span style = "color: red;  text-align: right;">- '+webix.Number.format(obj.value, {
                              decimalSize: 0, groupSize: 3,
                              decimalDelimiter: ".", groupDelimiter: " "
                            })+'</span>';
                          }
                          if (obj.type_operation == 4) {

                            return '<span style = "color: green;  text-align: right;">+ '+webix.Number.format(obj.value, {
                              decimalSize: 0, groupSize: 3,
                              decimalDelimiter: ".", groupDelimiter: " "
                            })+'</span>';
                          }

                        }
                      },
                      {"id": "id", "hidden": true},
                      {
                        "id": "action-delete",
                        "header": "",
                        "width": 50,
                        "template": "{common.trashIcon()}"
                      },
                      {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
                    ],
                  url: this.app.config.apiRest.getUrl('get','accounting/transactions',{
                    "expand":"contragent,category,project,account,data",
                    sort: '-date_operation',
                    //"count": -1
                  }),
                  //"api->accounting/transactions",
                  save: "api->accounting/transactions",
                  //datafetch:50, // 200 records
                  //loadahead:50,
                  scroll:"y",
                  on:{
                    // "data->onParse":function(){
                    //     debugger;
                    //     this.clearAll();
                    //     //this.data.url = "https://docs.webix.com/samples/server/packages_part";
                    // },
                    "onResize":webix.once(function(){
                      //this.adjustRowHeight("contragent", true);
                    }),
                    onBeforeLoad:function(){
                      this.showOverlay("Loading...");
                    },
                    onAfterLoad:function(){
                      if (!this.count())
                        this.showOverlay("Sorry, there is no data");
                      else
                        this.hideOverlay();
                    },
                    onItemClick:function(id, e, trg) {

                      if (this.getSelectedItem().$level == 2) {
                        return this.clearSelection();

                      }
                      if (id.column == 'action-delete') {
                        var table = this;
                        webix.confirm("Удалить запись?").then(function(result){
                          webix.dp(table).save(
                            id.row,
                            "delete"
                          ).then(function(obj){
                            webix.dp(table).ignore(function(){
                              table.remove(id.row);
                            });
                          }, function(){
                            webix.message("Ошибка! Запись не удалена!");
                          });
                        });

                      } else {
                        this.$scope.cashEdit.showForm(this);
                      }
                    },
                    onBeforeFilter: function(a,b,c) {
                      //c.value = 2;
                    },
                    // "data->onGroupCreated":function(id, value, data){
                    //     this.getItem(id).account = this.getItem(id).account.name;
                    // }
                  },

                },
                { cols: [
                  {
                    view: "label",
                    label: "0",
                    localId: "count",
                    template: "<div class='webix_el_box' style='line-height:32px'>Показано: #label# операций</div>"
                  },
                  {
                    view: "label",
                    label: "",
                    localId: "income",
                    template: "<div class='webix_el_box' style='line-height:32px; color: darkgreen'>Поступлений: #label#</div>"
                  },
                  {
                    view: "label",
                    label: "",
                    localId: "outcome",
                    template: "<div class='webix_el_box' style='line-height:32px; color: red'>Выплат: #label#</div>"
                  },
                  {
                    view: "label",
                    label: "",
                    localId: "move",
                    color: 'grey',
                    template: "<div class='webix_el_box' style='line-height:32px; color: #color#'>Перемещения: #label#</div>"
                  },
                  {
                    view: "label",
                    label: "",
                    localId: "total",
                    color: 'grey',
                    template: "<div class='webix_el_box' style='line-height:32px; color: #color#'>Итого:  #label#</div>"
                  },
                  {
                    "align" :"right"
                  }
                ]}
              ]
            },
          ]};

    }



    init(view){


        this.view = view;

        var list = this.$$("searchAccountCombo").getPopup().getList();
        list.parse(accounts);
        list = this.$$("searchContragentCombo").getPopup().getList();
        list.parse(contragents);
        list = this.$$("searchCategoryCombo").getPopup().getList();
        list.parse(categories);
        list = this.$$("searchProjectCombo").getPopup().getList();
        list.parse(projects);

        var form = this.$$("searchFormOperation");
        var table = this.$$("transaction");
        let scope = this;

        form.attachEvent("onChange", function(obj){
            var filter = form.getValues();
            var filterNew = {};
            var split = {};
            var values = {};
            var znak = '';
            for (var key in filter) {
                if (filter[key]) {
                    //debugger;
                    split = key.split('.');

                    if (split.length > 1) {

                        if (split[1] == 'range') {
                            //debugger;
                            if (!values[split[0]]) {
                                values[split[0]] = [];  values[split[0]] = {">=": filter[key]};
                            } else {
                                values[split[0]]["<="] = filter[key];
                            }
                            //values[split[0]][znak] = filter[key];
                            filter[split[0]] = values[split[0]];
                            filterNew[split[0]] = filter[split[0]];
                        } else {

                            if (!values[split[0]]) values[split[0]] = [];
                            let splitFilter = filter[key].split(',');
                            if (splitFilter.length > 1) {
                              for (let key1 in splitFilter) {
                                values[split[0]].push(splitFilter[key1]);
                              }
                            } else {
                              values[split[0]].push(filter[key]);
                            }
                            filter[split[0]] = {"in": values[split[0]]};
                            filterNew[split[0]] = filter[split[0]];
                        }
                    } else {
                        if (key == 'date_operation') {
                            //debugger;
                            filterNew[key] = {'>=':filter[key], '<':webix.Date.add(filter[key], 1, "day", true)};
                        } else {
                            filterNew[key] = filter[key];
                        }
                        //filterNew[key] = filter[key];
                    }
                }
            }
            webix.extend(table, webix.ProgressBar);
            var obj = { filter: filterNew };
            //table.clearAll(true);
            // table.showProgress({
            //     delay:2000,
            //     hide:false
            // });
            webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/transactions',{"expand":"contragent,category,project,account,data"}), obj).then(function(data) {
                table.parse(data);
            });
            let urlSummary = scope.app.config.apiRest.getUrl('get','accounting/transaction/summary')
              webix.ajax().get( urlSummary, obj).then(function(data) {
                scope.setTotal(data.json());

              });

            // table.loadNext(0, 0, 0, 0, 1).then(function (data) {
            //     table.clearAll(true);
            //     table.parse(data);
            // });

        });
      let urlSummary = this.app.config.apiRest.getUrl('get','accounting/transaction/summary');

      webix.ajax().get( urlSummary).then(function(data) {
        scope.setTotal(data.json());
      });

      this.cashEdit = this.ui(UpdateJetView);
    }

    doAddClick() {
        this.$$('transaction').unselect();
        this.cashEdit.showForm(this.$$('transaction'));
    }

    setTotal(data) {

      let incomeLabel = this.$$('income');
      let outcomeLabel = this.$$('outcome');
      let moveLabel = this.$$('move');
      let totalLabel = this.$$('total');
      let countLabel = this.$$('count');

      let income = 0;
      let outcome = 0;
      let incomeMove = 0;
      let outcomeMove = 0;
      let count = 0;

      for (let key in data.data) {
        if (data.data[key]['type_operation']==1) { income = data.data[key].value; }
        if (data.data[key]['type_operation']==2) { outcome = data.data[key].value; }
        if (data.data[key]['type_operation']==3) { incomeMove = data.data[key].value; }
        if (data.data[key]['type_operation']==4) { outcomeMove = data.data[key].value; }
        (income) ? incomeLabel.setValue(webix.Number.format(income)) : incomeLabel.setValue(0);
        (outcome) ? outcomeLabel.setValue(webix.Number.format(outcome)) : outcomeLabel.setValue(0);

        count = count + Number.parseInt(data.data[key]['id_part']);
      }
      let total = webix.Number.format(income-outcome);
      let move = webix.Number.format(incomeMove - outcomeMove);
      moveLabel.setValue(move);
      totalLabel.setValue(total);
      countLabel.setValue(count);
      (total >= 0) ? totalLabel.define("color","green") : totalLabel.define("color","red");
      (move >= 0) ? moveLabel.define("color","green") : moveLabel.define("color","red");

      incomeLabel.refresh();
      outcomeLabel.refresh();
      moveLabel.refresh();
      totalLabel.refresh();
      countLabel.refresh();
    }


}