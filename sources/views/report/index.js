import {JetView} from "webix-jet";
import {CoreEditClass} from "core/CoreEditClass";
import localViews from  "helpers/localviews";

function viewFactory(config, scope, tableId){
  class some123 extends JetView {
    constructor(app, name){
      super(app,name);
      this.state = new CoreEditClass(this);
      this.state.app = app;
    }
    config(){
      return config;
    }
    init(view, url) {
      let state = this.state;
      state.table = this.$$("table-register"+tableId);
      state.tableUrl = this.app.config.apiRest.getUrl('get',"accounting/register/turnover");

      //state.table.load(state.tableUrl);
      this.attachTableEvents();
    }

    attachTableEvents() {
      let state = this.state;

      state.scope = this;
      //let scope = this;
      //state.formUrl = state.table.data.url;
      let selected = {};

      state.table.attachEvent("onItemDblClick", function(id) {

        selected = state.table.getSelectedItem();


        webix.ajax().get( state.tableUrl, {"account" : selected.account_id, "account_type": selected.account_type}).then(function(data) {
          let idView = "report"+selected.account_id+(selected.account_type||0);
          state.tableId = idView;
          if(!localViews[idView]) {
            localViews[idView] = viewFactory(reportTable(data, state.tableId ), state.scope, idView);
            $$("top:menu").add({ id: idView, value:"ОСВ:"+selected.account, icon:"mdi mdi-view-dashboard"},null,"info");
            $$("top:menu").open("info");

            $$("views").addView({ id:idView, rows:[localViews[idView]]});
            //adding option to the tabbar
            $$('tabs').addOption(idView, selected.account, true);
          }

          //state.app.show("/top/"+idView);
          console.log(state.scope.$$("table-register"+state.tableId));



        });
      });

    }
  };

  return some123;
}


function reportTable(data, id='') {
  return {
    rows: [
      {
        view:"toolbar",
        cols:[
          {
            view:"icon",
            "icon": "mdi mdi-close",
            click: function() {
              //debugger;
              //this.$scope.app.show('/top/report');

            }
          }
        ],
        css: {"text-align": "right"}
      },
      {
      view: "datatable",
      close: true,
      //id: "table-register",
      localId: "table-register"+id,
      autoConfig: true,
      css: "webix_header_border webix_data_border",
      header: true,
      title: "Оборотно-сальдовая ведомость",
      footer: true,
      //scroll: "true",
      autoheight: true,
      select: "cell",
      resizeColumn: {headerOnly: true},
      columns: [
        {header: "", width: 50},
        {
          id: "account", header: "Субконто", width: 170, template: function (data) {
          if (data.account_date) {
            return webix.i18n.dateFormatStr(data.account_date) + " " + " №" + data.account;
          } else {
            return data.account;
          }
        }
        },
        {
          id: "A",
          header: [{text: "Сальдо на начало", colspan: 2}, "Дебет"],
          footer: {content: "summColumn", css: {"text-align": "right"}},
          css: {"text-align": "right"}
        },
        {
          id: "B",
          header: [{text: "", colspan: 2}, "Кредит"],
          footer: {content: "summColumn", css: {"text-align": "right"}},
          css: {"text-align": "right"}
        },
        {
          id: "sum_debet",
          header: [{text: "Оборот за период", colspan: 2}, "Дебет"],
          footer: {content: "summColumn", css: {"text-align": "right"}},
          css: {"text-align": "right"},
          format: webix.Number.format
        },
        {
          id: "sum_credit",
          header: [{text: "", colspan: 2}, "Кредит"],
          footer: {content: "summColumn", css: {"text-align": "right"}},
          css: {"text-align": "right"},
          format: webix.Number.format
        },
        {
          id: "E",
          header: [{text: "Сальдо на конец", colspan: 2}, "Дебет"],
          footer: {content: "summColumn", css: {"text-align": "right"}},
          css: {"text-align": "right"}
        },
        {
          id: "F",
          header: [{text: "", colspan: 2}, "Кредит"],
          footer: {content: "summColumn", css: {"text-align": "right"}},
          css: {"text-align": "right"}
        },
        {header: "", fillspace: true},
      ],
      data: data
    },
    {}]
  };
}

export default class ReportView extends JetView{
  constructor(app, name){
    super(app,name);
    this.state = new CoreEditClass(this);
    this.state.app = app;
  }

  config(){
    return {
      type:"wide",
      cols:[
        {
          rows:[

            {view:"tabbar", id:"tabs", multiview:true, close:true, options:[
              { id:"t1", value:"ОСВ", hidden: false, close: false}
            ], optionWidth:180,
            },
            {view:"multiview", id:"views",cells:[
              {
                id:"t1",
                rows: [
                  {  height:50, css: {"padding-left":150}, template:"<h2>Отчеты</h2>", borderless: false},
                  {
                    "view": "toolbar",
                    height: 40,
                    paddingY:2,
                    cols: [

                      {
                        view:"menu",
                        data:[
                          { id:"2",value:"Экспорт", submenu:[
                            { id:"3", value:"Excel"},
                            { value:"Csv" },
                            { value:"Pdf" }
                          ]}
                        ],
                        type:{
                          subsign:true
                        },
                        on:{
                          onMenuItemClick:function(id){
                            if (id == 3) {
                              webix.toExcel("table-register", {
                                spans: true,
                                styles: true
                              });
                            }
                          }
                        }
                      },
                      {
                        "view": "datepicker",
                        "name": "date_from",
                        "align" :"left",
                        "width": 120
                      },
                      {
                        "view": "label",
                        "label": "по",
                        "align" :"left",
                        "width": 30
                      },
                      {
                        "view": "datepicker",
                        "name": "date_to",
                        "align" :"left",
                        "width": 120
                      },
                      {},
                      { "label": "", "view": "search", "width": 300,  "align" :"right"  },
                      {
                        view:"button",
                        value:"fs",
                        width: 30,
                        click: function() {
                          webix.fullscreen.set("table-register");
                        }
                      },
                    ]
                  },
                  {
                    height:70,
                    template:"<h2>Оборотно-сальдовая ведомость</h2>",
                    align: "center,middle"
                  },
                  {
                    //scroll: true,
                    //autoheight:false,

                    rows: [
                      reportTable(""),
                      {

                        align: "bottom",

                      },

                    ]
                  },

                ]
              }
            ]},
          ]
        },


      ]
    };
  }

  init(view, url) {
    let state = this.state;
    state.scope = this;
    state.table = this.$$("table-register");
    state.tabbar = this.$$("tabbar");
    state.tableUrl = this.app.config.apiRest.getUrl('get',"accounting/register/turnover");

    state.table.load(state.tableUrl);
    localViews['t1'] = viewFactory(reportTable('', 't1' ), state.scope, 't1');
    if ($$("top:menu").getItem('t1')) {
      $$("top:menu").remove('t1');
    }
    $$("top:menu").add({ id: 't1', value:"ОСВ", icon:"mdi mdi-view-dashboard"},null,"info");
    $$("top:menu").open("info");


    this.attachTableEvents();

  }

  attachTableEvents() {
    let state = this.state;

    state.scope = this;
    //let scope = this;
    //state.formUrl = state.table.data.url;
    let selected = {};

    state.table.attachEvent("onItemDblClick", function(id) {

      selected = state.table.getSelectedItem();

      webix.ajax().get( state.tableUrl, {"account" : selected.account_id, "account_type": selected.account_type}).then(function(data) {
        let idView = "report"+selected.account_id+(selected.account_type||0);
        state.tableId = idView;
        if(!localViews[idView]) {
          localViews[idView] = viewFactory(reportTable(data, state.tableId ), state.scope, idView);
          $$("top:menu").add({ id: idView, value:"ОСВ:"+selected.account, icon:"mdi mdi-view-dashboard"},null,"info");
          $$("top:menu").open("info");

          $$("views").addView({ id:idView, rows:[localViews[idView]]});
          //adding option to the tabbar
          $$('tabs').addOption(idView, selected.account, true);
        }

        //state.app.show("/top/"+idView);
        console.log(state.scope.$$("table-register"+state.tableId));



      });
    });

    $$('tabs').attachEvent("onOptionRemove", function(id, value){
      $$("views").removeView(id);
      delete localViews[id];
      $$("top:menu").remove(id);
    });
  }

}