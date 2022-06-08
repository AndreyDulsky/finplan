import {JetView} from "webix-jet";
import {FormClassState} from "core/service/FormClassState";
import TableSetting from  "components/tableSetting";
import TableDynamic from  "components/tableDynamic";


export default class CoreCharacteristicWindow extends JetView {
  constructor(app, name){
    super(app,name);
    this.state = new FormClassState(this);
  }

  config() {
    this.apiRest = this.app.config.apiRest;
    this.win = {};
    return {}
  }

  init(view, url) {
    this.state.wins = [];
    this.state.configs= [];
  }
  showWindowCharacteristic(configWindow) {
    // this window can be call 1-new document 2-edit document 3-copy document 4-depend document 5-editbutton in table 6-editbutton in component
    // 1.Define type window 1-this can be document,documentData, directory, table,
    // If type = 'document'
    // three type form enter, flag form objConfig.operation_type(editor.operation_type)
    // 1-edit editor.operation_type = 'update'
    // 2-edit editor.operation_type = 'insert'
    // 3-copy editor.operation_type = 'copy'
    // 4-depend editor.operation_type = 'depend'


    // 2. Us Need know is this window depend from record table or other element to use selectItem()
    // this define config option editor.returnObject : this, if isset this option this it means other element
    // and must be option editor.return - type return value 'json', 'integer', 'object'
    //
    // type = 'document' operation_type = update || copy || depend isUpdate = 0-insert || 1-update
    // type = 'directory' operation_type = null returnObject = object(configColumn) || object(component -for example combo) isUpdate = null
    let scope = this;
    let state  = this.state;


    let record = (configWindow['table']) ? configWindow['table'].getSelectedItem() : null;
    // configWindow['operation_type'] = configWindow['operation_type'];
    // configWindow['type'] = configWindow['type'];
    // configWindow['returnObject'] = configWindow['returnObject'];
    // configWindow['return'] = configWindow['return'];
    // configWindow['options_url'] = configWindow['options_url'];
    // configWindow['options_url_edit'] =configWindow['options_url_edit'];
    // configWindow['header'] = configWindow['options_url_edit'];
    // configWindow['filter'] = configWindow['options_url_edit'];

    configWindow['tableRecord'] = record;
    configWindow['isUpdate'] = (record);
    state.windowNumber = state.configs.length;
    state.configs.push(configWindow);

    let api = this.apiRest;




    scope.getDataProperty();

  }

  getDataProperty() {
    let scope = this;
    let state = this.state;
    let config;
    let filter = {};
    config = state.configs[state.windowNumber];

    if (config.filter) {
      //webix.storage.local.put(state.editor.config.options_url_edit + '_' + type + "_filter_state", state.editor.config.filter);
      filter = {filter:{"or":[{"list_id":config.filter['filterInput']}]}};//{'list_id':config.filter['filterInput']};

    }

    let tableUrl = state.$scope.app.config.apiRest.getUrl('get',"accounting/"+config['options_url']);

    webix.ajax().get(tableUrl, filter ).then(function(data) {

      let items = data.json();
      let dataItem = [];

      let len =  state.windowNumber;

      let value = config.parent.getTopParentView().queryView({'localId':'table-layout'}).getSelectedItem();

      if (value != '') {
        let valueParams = value.params;

        items.data.forEach(function(item) {
          item['virtual_value'] = {};

          if (Array.isArray(value['params'])) {
            valueParams.forEach(function(itemValue) {
              if (item.directory_id == itemValue.directory_id ) {
                item['virtual_value'] = itemValue['virtual_value'];
                //dataItem.push(item);
              }

            });
          }
          dataItem.push(item);



        });
      }
      let configTable = scope.getTableConfig(config, dataItem);
      scope.renderWindow(configTable);
      // //debugger;
      // scope.table.clearAll();
      // scope.table.parse(dataItem);
      // scope.table.enable();
      // scope.table.hideProgress();
      // scope.getEl('loading-table').enable();
      // scope.getEl('loading-table').hideProgress();
    });
  }

  getTableConfig(obj, data) {

    let scope = this;
    let state = this.state;

    let configTable = {
      view:"property",
      localId:"sets",
      width:300,

      elements:[
        { label:"Основные", type:"label" },
        // { label:"Width", type:"text", id:"width", value: 250},
        // { label:"Height", type:"text", id:"height"},
        // { label:"Password", type:"password", id:"pass"},
        //
        // { label:"Data url", type:"text", id:"url", value:"http://webix.com/data"},
        // { label:"Type", type:"select", options:["json","xml","csv"], id:"type"},
        // { label:"Position", type:"select",  id:"position"},
        // { label:"Date", type:"date", id:"date", format:webix.i18n.dateFormatStr},
        // { label:"Color", type:"combo",  id:"color"},
        // { label:"Use JSONP", type:"checkbox", id:"jsonp"}
      ],
    };
    data.forEach(function(item) {

      let directory = 'nomenclature';

      if (item.directory_id == 1) {
        directory = 'directory-cloth';
      }
      if (item.directory_id == 2) {
        directory = 'product-bed-size';
      }
      configTable.elements.push({
        label: item.name,
        height: 30,
        type:"directoryEditorCharacteristic",
        id: item.id,
        directory_id: item.directory_id,
        value: item.virtual_value,
        options_url: directory,
        template:function(value, config){
          return "<input type='button' class='webix_toggle_button_custom'  value='"+value+"' style='margin:0px; 	width:95%; height:20px; font-size:12px; '/>";
        },
      });
    });




    let configDocument = {};
    let rows = [];
    let configForm = {};

    //configForm = scope.getFormDocument();


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
          "width": 120,
          click: function(){
            scope.doClickSave();
          }

        }

        // {
        //   width: 10
        // },
      ]
    };
    //rows.push(configForm);


    rows.push(configTable);
    if (Object.keys(configDocument).length > 0) {
      rows.push(configDocument);
    }
    return rows
  }


  getTableConfig1(obj) {

    let scope = this;
    let state = this.state;
    let configTable = {
      view: "table-service",
      localId: "windowBody",
      $scope : scope,
      state: {
        scope : scope,
        parent: obj.table,
        params: {
          mode: obj.options_url_edit,
          id: this.getParam('id'),
          account_id : this.getParam('account_id'),
          window: true,
          operation_type: obj.operation_type
        },
        depend: obj.depend,
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
        formEdit:  obj.view.formEdit,
        formView:  obj.view.formView,
        formComment:  obj.view.formComment,
        windowDirectory:  obj.view.windowDirectory,
        formDocumentTableWindow:  obj.view.formDocumentTableWindow,
        formCoreDocumentWindow: obj.view.formCoreDocumentWindow,
        formCoreCharacteristicWindow: obj.view.formCoreCharacteristicWindow,
        type: obj.type

      },
      stateCache : webix.storage.local.get(obj.options_url_edit+'_'+obj.type+"_filter_state"),

    };

    if (obj.filter) {
      //webix.storage.local.put(state.editor.config.options_url_edit + '_' + type + "_filter_state", state.editor.config.filter);
      configTable.state.params.id = obj.filter['filterInput'];
    }


    let configDocument = {};
    let rows = [];
    let configForm = {};

    //configForm = scope.getFormDocument();


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
          "width": 120,
          click: function(){
            scope.doClickSave();
          }

        }

        // {
        //   width: 10
        // },
      ]
    };
      //rows.push(configForm);


    rows.push(configTable);
    if (Object.keys(configDocument).length > 0) {
      rows.push(configDocument);
    }
    return rows
  }

  renderWindow(tableConfig) {
    let state = this.state;
    let count = 25*this.state.wins.length;
    let scope = this;
    let countLeft = count;
    let countTop = count;
    let rows = [];
    let config;

    config = state.configs[state.windowNumber];

    rows = [
      {
        rows :tableConfig
      }
    ];
    state.win = webix.ui({
      $scope: this,
      localId: "windowDirectoryCharacteristic",
      view: "window",
      position: function (state) {
        // state.top = 0;//38*2;
        // state.width = state.maxWidth / 3;
        // state.height = state.maxHeight/3;
        // state.left = 0;//44*2;
      },
      head:{
        cols:[
          { template:"Title", type:"header", borderless:true},
          {view:"icon", icon:"wxi-close", tooltip:"Close window", click: function(){
            scope.hideWindow();
          }}
        ]
      },
      //width: 500,
      //fullscreen:false,
      //resize: false,
      //move: true,
      //scroll: true,
      //head: "Справочник",
      close: true,
      modal: true,
      body: {
        type: 'space',
        css: 'webix_primary',
        rows: rows,
      }
    });

    state.win.getBody().queryView({'localId':'sets'}).registerType("directoryEditorCharacteristic",{
      template:function(value, config){
        let result = '';
        if (value['name']) result = value.name;
        return result + "<button class='directory-button' style='position: absolute;margin: 0px; right:0; height:20px;'>...</button>";
      },
      click:{
        "directory-button":function(e, id){

          var data = this.getItem(id);
          //var keys = Object.keys(data.collection.data.pull); // keys equal to values
          // if (keys[0] == data.value)
          //   data.value = keys[1];
          // else
          //   data.value = keys[0];
          // this.editStop();
          //this.refresh(id);
          //this.callEvent("onCheck",[id, data.value]);
          let filter = {};
          // if (this.config.options_url_directory && this.config.options_url_directory.id) {
          //   filter = {'filterInput' : this.config.options_url_directory.id};
          // }
          debugger;
          let objConfig = {
            'config':{
              'return' : 'object',
              'returnObject' : state.win.getBody().queryView({'localId':'sets'}),
              'id' : id,
              'urlEdit' : data.options_url,
              'editor' : data,
              'options_url' : data.options_url,
              'options_url_edit': data.options_url,
              'header': [{'text':'Справочник'}],
              'filter': filter
            }
          };
          this.config['urlEdit'] = data.options_url;

          config.parent.state.formDocumentTableWindow.showWindow({},this, objConfig, config.parent, 'directory');
        }
      },
      editor:"inline-text"
    });

    // state.win.getBody().attachEvent("onClick",function(id, e, node){
    //
    //   if (e.target = 'document-button') {
    //
    //   }
    // });
    state.wins.push(state.win);
    config['win'] = state.win;

    config.win.getHead().getChildViews()[0].setHTML(config.header[0].text);

    state.win.show();

    // var res = webix.promise.defer();
    // res.resolve(config.win.getBody()).then(function(result, res1) {
    //   let res2 = config.win.getBody().queryView({'localId':'table-layout'});
    // });
  }

  getRecord() {
    let state  = this.state;
    let config;
    config = state.configs[state.windowNumber];
    if (config.isUpdate) {
      return config.tableRecord;
    }
    return {
      'dateDocument' :  new Date()
      //date_operation: new Date(),
      //is_committed : 1,
      //type_operation: 2
    }
  }

  hideWindow() {
    let state  = this.state;
    let windowNumber = state.wins.pop();
    state.configs.pop();

    windowNumber.hide();
  }

  doClickSave(copy = false) {
    let state = this.state;
    let scope = this;
    let config;
    let itemSelect;
    let dataItems = [];

    config = state.configs[state.windowNumber];
    itemSelect = config.table.getSelectedItem();
    let table = config.win.getBody().queryView({'localId':'sets'});
    let values = table.getValues();
    let item = {};
    let result = {};
    for (let key in values) {
      item = table.getItem(key);
      result = {"name": item.label, "directory_id" : item.directory_id, "id": item.id, "list_id" : 283, "virtual_value" : values[key]};
      dataItems.push(result);
    }
    // values.forEach(function(item) {
    //   dataItems.push(item);
    // });

    let dp = webix.dp(config.table);
    itemSelect[config.editor.column] =  dataItems;
    dp.ignore(function () {
      config.table.updateItem(itemSelect.id, itemSelect);
    });

    scope.hideWindow();
  }



}


