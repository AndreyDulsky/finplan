import {JetView} from "webix-jet";
import {CoreEditClass} from "core/CoreEditClass";
import TableSetting from  "components/tableSetting";
import TableDynamic from  "components/tableDynamic";


export default class WindowDirectoryView extends JetView {
  constructor(app, name){
    super(app,name);
    this.state = new CoreEditClass(this);
  }

  config() {
    this.apiRest = this.app.config.apiRest;
    this.win = {};


    //this.widgets = import(/* webpackChunkName: "widgets" */  "views/inproduce");
    //var widgets = import(/* webpackChunkName: "widgets" */  "components/tableSetting");
    // return widgets.then(() => {
    //
    //   return {
    //     localId: "windowDirectory",
    //     view: "window",
    //     position: function (state) {
    //       //state.left = 44;
    //       //state.top = 34;
    //       state.width = state.maxWidth/2;
    //       state.height = state.maxHeight/2;
    //       state.left = state.width/2;
    //       state.top = state.height/2;
    //     },
    //
    //     head: "Справочник",
    //     close: true,
    //     modal: true,
    //     body: {
    //       localId: "windowBody",
    //       view:"table-setting"
    //
    //     }
    //   }
    //
    // });

    return {}


  }

  init(view, url) {
    this.state.wins = [];
  }



  showWindow(obj, table, editor, view, type) {

    let scope = this;
    let state  = this.state;
    let record = table.getSelectedItem();
    let isUpdate = (record);
    let fieldSet;

    state.isUpdate = isUpdate;
    state.table = table;
    state.editor = editor;
    state.windowNumber = this.state.wins.length;


    //state.windowBody =  this.$$("windowBody");
    //state.win = this.$$("windowDirectory");

    //this.directoryUrl = state.table.$scope.app.config.apiRest.getUrl('get',"accounting/"+state.editor.config.options_url);

    let config = {
      view: "table-dynamic",
      localId: "windowBody",
      $scope : scope,
      state: {
        scope : scope,
        params: {
          mode: state.editor.config.options_url_edit,
          id: this.getParam('id'),
          account_id : this.getParam('account_id'),
          window: true
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
        formEdit: view.formEdit,
        formView: view.formView,
        formComment: view.formComment,
        windowDirectory: view.windowDirectory,
        type: type

      },
      stateCache : webix.storage.local.get(state.editor.config.options_url_edit+'_'+type+"_filter_state"),

    };

    if (state.editor.config.filter) {
      //webix.storage.local.put(state.editor.config.options_url_edit + '_' + type + "_filter_state", state.editor.config.filter);
      config.state.params.id = state.editor.config.filter['filterInput'];
    }


    let count = 25*this.state.wins.length;

    let countLeft = count;
    let countTop = count;

    let configDocument = {};
    if (type == 'document') {
      configDocument = {
        //view: 'toolbar',
        // margin:{
        //   top:10, bottom:10, left:10, right:10
        // },
        type: 'space',
        borderless:true,
        cols: [
          {},

          {
            "view": "button",
            "label": "Отмена",
            "localId": "btn_cancel",
            "css": "webix_transparent",
            "align": "right",
            "width": 120,
            click: function(){
              scope.hideWindow();
            }
          }, {
            "view": "button",
            "localId": "btn_save",
            "css": "webix_primary",
            "label": "Сохранить",
            "align": "right",
            "width": 120
          }

          // {
          //   width: 10
          // },
        ]
      }
    }
    let rows = [];
    rows.push(config);
    if (Object.keys(configDocument).length > 0) {
      rows.push(configDocument);
    }

    state.win = webix.ui({
      scope: this,
      localId: "windowDirectory",
      view: "window",
      position: function (state) {
        state.top = 38*2+countTop;
        state.width = state.maxWidth / 1.5;
        state.height = state.maxHeight/1.2;
        state.left = 44*2+countLeft;
      },
      head:{
        cols:[
          { template:"Title", type:"header", borderless:true},
          {
            view:"icon", icon:"mdi mdi-fullscreen", tooltip:"Развернуть окно", click:function() {

            if (this.getParentView().getParentView().config.fullscreen){

              this.getParentView().getParentView().define({
                fullscreen: false, position: function (state) {
                  state.top = 38*2+countTop;
                  state.width = state.maxWidth / 1.5;
                  state.height = state.maxHeight/1.2;
                  state.left = 44*2+countLeft;
                } });
              this.define({icon:"mdi mdi-fullscreen", tooltip:"Развернуть окно"});
            }
            else {

              this.define({icon:"mdi mdi-fullscreen-exit", tooltip:"Сверуть окно"});
              this.getParentView().getParentView().define({
                fullscreen: true, top:0, left:0, position:false
              });
            }
            this.refresh();
            this.getParentView().getParentView().resize();
          }
          },
          {view:"icon", icon:"wxi-close", tooltip:"Close window", click: function(){
            scope.hideWindow();
          }}
        ]
      },
      //width: 500,
      fullscreen:false,
      resize: true,
      move: true,
      scroll: true,
      //head: "Справочник",
      close: true,
      modal: true,
      body: {
        type: 'space',
        css: 'webix_primary',
        rows: rows
      }
    });

    state.win.getHead().getChildViews()[0].setHTML(state.editor.config.header[0].text);
    state.wins.push(state.win);
    state.win.show();
    // webix.ui(
    //   config,
    //   state.windowBody
    // );
    //state.formEdit.setValues(record);

    //scope.attachFormEvents();

    //set title window


    //state.win.show();

  }

  selectRecord(record) {

    let state  = this.state;
    let item = state.table.getSelectedItem();
    item[state.editor.column] = record.id;
    state.table.updateItem(item.id, item);
    //state.table.$scope.doRefresh();
    //state.table.select(item.id);
  }

  hideWindow() {
    let state  = this.state;

    let windowNumber = state.wins.pop();

    windowNumber.hide();

  }

  attachFormEvents() {

    let scope = this;
    let state = this.state;
    // let btnSave = this.$$("btn_save");
    // let btnCopy = this.$$("btn_copy");
    //
    // btnSave.attachEvent("onItemClick", function(newValue) {
    //   scope.doClickSave();
    // });


  }


  doClickSave(copy = false) {

    let state = this.state;
    if (!state.formEdit.validate()) return;

    let record = state.formEdit.getValues();
    if (copy) {
      state.isUpdate = false;
      record.id = '';
    }
    //debugger;
    webix.dp(state.table).save(
      (state.isUpdate) ? record.id : webix.uid(),
      (state.isUpdate) ? "update" : "insert",
      record
    ).then(function(obj){
      webix.dp(state.table).ignore(function(){

        (state.isUpdate) ? state.table.updateItem(record.id, obj) : state.table.add(obj,0);

        state.table.select(obj.id);

        if (!state.isUpdate)  { state.table.scrollTo(0, 0) };

        //state.table.sort("name", "asc", "string");
        //state.table.markSorting("name", "asc");

      });

      state.table.refresh();
      state.win.close();
    }, function(){
      webix.message("Ошибка! Данные не сохранены!");
    });
  }


}


