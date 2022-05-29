import {JetView} from "webix-jet";
import {FormClassState} from "core/service/FormClassState";
import TableSetting from  "components/tableSetting";
import TableDynamic from  "components/tableDynamic";


export default class CoreDocumentWindow extends JetView {
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
    this.state.types = [];
    this.state.tables = [];
    this.state.isUpdates = [];
    this.state.tableRecords = [];


  }
  showWindow(configWindow) {
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
    let configTable = scope.getTableConfig(configWindow);

    //let configForm = scope.getFormConfig(table, type);
    //depend
    let prefix = 'accounting/';

    if (configWindow.operation_type  && configWindow.operation_type == 'depend') {

      //table.config.urlEdit = editor.config['options_depend_url'];
      configWindow['isUpdate'] = 0;
      configWindow['changeUrl'] = true;
      configWindow['changeUrlSource'] = prefix+configWindow.options_url;
      configWindow['tableId'] = prefix+configWindow.options_depend_url;

      //table.refresh();
    } else {

      //table.config.urlEdit = editor.config['options_url'];
      configWindow['changeUrl'] = false;
      //state.changeUrlSource = prefix+table.config.urlEdit;
      if (configWindow.table) {
        configWindow['tableId'] = prefix + configWindow.table.config.urlEdit;
      }
    }
    if (configWindow.operation_type  && configWindow.operation_type == 'copy') {
      configWindow['isUpdate'] = 0;
    }

    //state.tableId = table.config.urlEdit;
    if (!configWindow.table) {
      scope.renderWindow(configTable, configWindow.type);
      return;
    }

    configWindow['formUrl'] = configWindow.tableId+"/form-document";
    api.get(configWindow.formUrl).then(function(data) {
      configWindow['formData'] = data.json();
      configWindow['formConfig'] = {};
      if (configWindow.formData.data.configForm) {
        configWindow.formConfig = configWindow.formData.data.configForm;
      }
      scope.renderWindow(configTable, configWindow.type);

      //scope.bindCollection();
    });

  }

  getTableConfig(obj) {

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
        formTransactionSchemaEditView: obj.view.formTransactionSchemaEditView,
        formDocumentEditView: obj.view.formDocumentEditView,
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

    if (obj.type == 'documentData' || obj.type == 'document' ) {
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
              scope.doClickSaveDoc();
            }

          }

          // {
          //   width: 10
          // },
        ]
      };
      //rows.push(configForm);
    }

    rows.push(configTable);
    if (Object.keys(configDocument).length > 0) {
      rows.push(configDocument);
    }
    return rows
  }

  renderWindow(tableConfig, type) {
    let state = this.state;
    let count = 25*this.state.wins.length;
    let scope = this;
    let countLeft = count;
    let countTop = count;
    let rows = [];
    let config;

    config = state.configs[state.windowNumber];

    if (type == 'documentData' || type=='document') {
      rows = [
        {
          view: 'form',
          complexData: true,
          localId: 'formEditDocument',
          elements: config.formConfig
          //rows: formConfig,
        },
        {
          rows :tableConfig
        }
      ];
    } else {
      rows = [
        {
          rows :tableConfig
        }
      ];
    }
    let head = {
      cols:[
        { template:"Title", type:"header", borderless:true},
        {
          view:"icon", icon:"mdi mdi-fullscreen", tooltip:"Развернуть окно", click:function() {

          if (this.getParentView().getParentView().config.fullscreen){

            this.getParentView().getParentView().define({
              fullscreen: false, position: function (state) {
                let width = state.maxWidth / 1.5;
                let height = state.maxHeight / 1.2;
                let left = 44*2;
                let top = 34*2;
                if (config['window_width'] && config['window_width'] == 'max') {
                  left = left/2;
                  top = top/2;
                  width = state.maxWidth - left;
                  height = state.maxHeight - (top*2+10);
                }
                state.top = top;
                state.width = width;
                state.height = height;
                state.left = left;
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
          scope.hideWindow(this);
        }}
      ]
    };
    if (config['window_head'] == false) {
      head = false;
    }

    state.win = webix.ui({
      $scope: this,
      localId: "windowDirectory",
      view: "window",
      position: function (state) {
        let width = state.maxWidth / 1.5;
        let height = state.maxHeight / 1.2;
        let left = 44*2;
        let top = 34*2;
        if (config['window_width'] && config['window_width'] == 'max') {
          left = left/2;
          top = top/2;
          width = state.maxWidth - left;
          height = state.maxHeight - (top*2+10);
        }
        state.top = top;
        state.width = width;
        state.height = height;
        state.left = left;
      },
      //head: false,
      head: head,
      //width: 500,
      fullscreen:false,
      resize: true,
      move: true,
      toFront: true,
      scroll: true,
      //head: "Справочник",
      close: true,
      modal: (config['window_modal'] == false) ? false: true,
      body: {
        type:  (config['window_layout_type']) ? config['window_layout_type'] : 'space',
        css: 'webix_primary',
        rows: rows
      },
      ref: config.options_url_edit
    });
    state.wins.push(state.win);
    config['win'] = state.win;
    //set localViews
    debugger;
    scope.app.config.localViews[config.options_url_edit] = {'index': state.wins.length-1,'win':state.win};
    state.currentTab = $$("tabbar").getValue();
    $$("tabbar").addOption({
        id:config.options_url_edit,
        value:config.header[0]['text'],
        close:true,
        icon:config.header[0]['icon'],
        width: 'auto'
      },
      true
    );

    if (head != false) {
      config.win.getHead().getChildViews()[0].setHTML(config.header[0].text);
    }

    state.win.show();

    var res = webix.promise.defer();
    res.resolve(config.win.getBody()).then(function(result, res1) {
      let res2 = config.win.getBody().queryView({'localId':'table-layout'});
      scope.setSumByTableRows();
      res2.data.attachEvent("onDataUpdate", function(id, data, old){
        scope.setSumByTableRows()
      });
      res2.data.attachEvent("onAfterAdd", function(id, data, old){
        scope.setSumByTableRows()
      });
      res2.data.attachEvent("onAfterDelete", function(id){
        scope.setSumByTableRows()
      });
      res2.data.attachEvent("onItemClick", function(id){

      });
      let complexes = config.win.getBody().queryView({'complex': true}, 'all');
      for (let key in complexes) {
        complexes[key].attachEvent("onChange", function(id){
          let localId =  this.config.localId;
          let localIdArray = localId.split('_');
          for (let key in localIdArray) {
            if (key == (localIdArray.length-1)) {
              localIdArray[key] = 'name';
            }
          }
          let localIdName = localIdArray.join('_');
          let elementName = config.win.getBody().queryView({'localId': localIdName});
          if (elementName) {
            elementName.setValue(this.data.text);
          }
        });
      }
      let currencyIs = config.win.getBody().queryView({'name': 'currencyIs'});
      currencyIs.attachEvent("onChange", function(value) {

        let currencies = config.win.getBody().queryView({'batch': 'currency'}, 'all');

        for (let key in currencies) {
          if (value) {
            currencies[key].show();
          } else {
            currencies[key].hide();
          }
        }

      });

      config['formEditDocument'] = config.win.queryView({'localId': 'formEditDocument'});

      if (config['formEditDocument'] && config.isUpdate) {
        config['formEditDocument'].setValues(scope.getRecord());
      } else {
        //if depend
        if (config['operation_type'] == 'depend' || config['operation_type'] == 'copy') {
          let selectItem = Object.assign({}, config.table.getSelectedItem());
          delete selectItem['id'];
          delete selectItem['_id'];
          delete selectItem['idDocument'];
          delete selectItem['name'];
          //delete selectItem['dateDocument'];
          selectItem['dateDocument'] = new Date();
          delete selectItem['isCommitted'];
          config['formEditDocument'].setValues(selectItem);
        }

      }

    });
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

  bindCollection(result) {

    let state = this.state;
    let scope = this;
    let api = this.apiRest;
    let loadedCount = 0;
    let collections = result.data.dataCollections;
    let collectionsCount = Object.keys(collections).length;
    let params = {"per-page": -1};

    for (let elementId in collections) {

      //find element by id and get his options
      let list = $$(elementId).getPopup().getList();
      //get data by url collection
      let nameField = (collections[elementId].field) ? collections[elementId].field : 'name';
      let dataCollection = api.getCollection(collections[elementId].url, params, nameField);

      dataCollection.waitData.then(function() {
        loadedCount++;
        list.sync(dataCollection);
        if (loadedCount === collectionsCount) {

          state.formEditDocument.setValues(scope.getRecord());
          state.formEditDocument.enable();
          state.formEditDocument.hideProgress();
        }
      });
      //set data collection
    }
    if (collectionsCount == 0 ) {
      state.formEditDocument.setValues(scope.getRecord());
      state.formEditDocument.enable();
      state.formEditDocument.hideProgress();
    }
  }

  bindColumnCollection(result) {
    let scope = this;
    let api = this.apiRest;
    let params = {"per-page": -1};
    let columnCollection = result.data.columnCollections;
    for (let tableLocalId in columnCollection) {
      let columns = columnCollection[tableLocalId];
      for (let columnId in columns) {
        scope.$$(tableLocalId).getColumnConfig(columnId).options = api.getCollection(
          columns[columnId].url, params
        );
      }
      scope.$$(tableLocalId).refreshColumns();
    }
  }

  selectRecord(record) {

    let state  = this.state;
    let config;
    config = state.configs[state.windowNumber];
    let item = {};
    if (!config.hasOwnProperty("returnObject")) {
      item = config.table.getSelectedItem();
    }
    let id = record.id;

    if (record.hasOwnProperty("idDocument")) {
      id = record.idDocument;
    }

    if (config.hasOwnProperty("return")) {
      if (config.return) {
        if (config.hasOwnProperty("returnObject")) {
          let dataId = null;
          if (config.return == 'json') {
            let objGetter = config.returnObject;
            let list = objGetter.getPopup().getList();
            dataId = JSON.stringify({'id': id, '_id': record.id, 'name': record.name});
            let collection = new webix.DataCollection({
              data: [{'id': dataId, '_id': record.id, 'value': record.name}]
            });
            list.sync(collection);
          }
          if (config.return == 'integer') {
            dataId = id;
          }

          config.returnObject.setValue(dataId);

        }
      } else
        item[config.editor.column] = {'id': id, '_id': record.id, 'name': record.value};
    } else {

      item[config.editor.column] = {'id': id, '_id': record.id, 'name': record.value};
    }

    if (item.hasOwnProperty("unit")) {
      let unitId = 1;
      if (record.unit_id) {
        unitId = 1;
      }
      let itemDirectory =  config.table.getColumnConfig('unit').collection.getItem(unitId);
      item['unit'] =  {'id' :unitId, 'name' : itemDirectory.name};
    }
    if (item.hasOwnProperty("price") && item['price'] == '') {
      item['price'] =  record.price;
    }
    if (!config.hasOwnProperty("returnObject")) {
      webix.dp(config.table).ignore(function () {
        config.table.updateItem(item.id, item);
      });
      let index = config.table.getColumnIndex(config.editor.column);
      // var now = state.table.getEditor();
      //state.table.editNext(true, now);
      //state.table.unselectAll();
      //state.table.editStop();

      if (item.id && config.table.config.columns[index + 1] && config.table.editStop()) {
        for (let i = index + 1; i < state.table.config.columns.length - 1; i++) {
          if (config.table.config.columns[i].hasOwnProperty('editor')) {
            index = i;
            break;
          }
        }
        config.table.select(item.id, config.table.config.columns[index].id);
        config.table.edit({row: item.id, column: config.table.config.columns[index].id});
      } else {
        return config.table.editStop();
      }
    }
    //webix.UIManager.setFocus(state.table.editCell(item.id, state.table.config.columns[index+1].id));
    //webix.UIManager.setFocus(item.id);
    //return false;
    //state.table.updateItem(item.id, item);
    //state.table.$scope.doRefresh();
    //state.table.select(item.id);
  }

  hideWindow(win) {

    let state  = this.state;
    let scope = this;
    //let windowNumber = state.wins.pop();
    let windowNumber = scope.app.config.localViews[win.getTopParentView().config.ref]['index'];
    //state.configs.pop();



    let modal = true;
    if (state.configs[windowNumber] && state.configs[windowNumber]['window_modal'] && state.configs[windowNumber]['window_modal'] == false) {
      modal = false;
    }
    if (modal == true) {
      $$("tabbar").removeOption(win.getTopParentView().config.ref);
    }
    $$("tabbar").setValue(state.currentTab);

    state.configs.splice(windowNumber, 1);
    state.wins.splice(windowNumber, 1);
    delete scope.app.config.localViews[win.getTopParentView().config.ref];
    state.windowNumber = state.configs.length-1;
    if (modal == false) {
      win.getTopParentView().close();
    } else {
      win.getTopParentView().hide()
    }

    //windowNumber.hide();
    //win.getTopParentView().hide()
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


  doClickSaveDoc(copy = false) {

    //this.doSaveDocument();
    let scope = this;
    let state = this.state;
    let config;
    config = state.configs[state.windowNumber];

    //config.formEditDocument = state.wins[state.wins.length-1].queryView({'localId': 'formEditDocument'});
    if (!config.formEditDocument.validate()) return;

    let tableSubData = config.win.queryView({'localId': 'table-layout'});
    let record = config.formEditDocument.getValues();
    let data = [];
    let columns = {};
    tableSubData.config.columns.forEach(function(item) {
      columns[item.id] = {};
    });
    tableSubData.data.each(function(method, master, all, id) {
      let row = {};
      for (let key in columns) {
        if (method[key]) {
          row[key] = method[key];
        }
      };
      data.push(row);
    });

    record.data = data;

    if (copy) {
      config.isUpdate = false;
      record.id = '';
    }

    let dp = webix.dp(config.table);


    if (config.changeUrl == true) {
      config['baseUrlEdit'] = dp.config.url.source;
      dp.config.url.source = config.changeUrlSource;
    }

    dp.save(
      (config.isUpdate) ? record.id : webix.uid(),
      (config.isUpdate) ? "update" : "insert",
      record
    ).then(function(obj){

      if (config.changeUrl == true) {
        config.changeUrl = false;
        dp.config.url.source = config.baseUrlEdit;
        //state.tables[state.tables.length-1].refresh();
        //config.win.hide();
        scope.hideWindow(config.win);

      } else {
        dp.ignore(function () {

          (config.isUpdate) ? config.table.updateItem(record.id, obj) : config.table.add(obj, 0);
          let branches = config.table.data.getBranch(config.table.getSelectedId());

          if (branches.length > 0 && config.isUpdate) {
            config.table.remove(config.table.data.branch[record.id]);
            config.table.data.branch[record.id] = [];
            config.table.parse({
              parent: obj.id,
              data: obj.data
            });

          } else {
            obj.data.forEach(function(item, key) {
              config.table.data.add(item, key, obj.id);
            });

          }




          config.table.select(obj.id);

          if (!config.isUpdate) {
            config.table.scrollTo(0, 0);
          }


          //state.table.sort("name", "asc", "string");
          //state.table.markSorting("name", "asc");

        });
        // debugger;
        // //state.table.getBranch(item).bind(data);
        //state.tables[state.tables.length-1].getItem(state.tables[state.tables.length-1].getSelectedId()).data = data;

        config.table.refresh();

        //config.win.hide();
        scope.hideWindow(config.win);
      }
    }, function(){
      webix.message("Ошибка! Данные не сохранены!");
    });
  }

  setSumByTableRows() {

    let state  = this.state;
    let scope = this;

    let config;

    config = state.configs[state.windowNumber];

    let type = config.type;
    if (type != 'documentData' && type != 'document' ) {
      return;
    }
    let res2 = config.win.getBody().queryView({'localId':'table-layout'});
    let sum = 0;
    // res2.data.each(function(row){
    //   debugger;
    //   sum = sum + parseFloat(row.salary);
    // });

    res2.data.each(function(row){
      if (row) {

        if (row.sum != 'undefined') {
          sum = sum + parseFloat(row.sum);
        }
      }
    });

    //state.tables[state.tables.length-1].getSelectedItem()['sum'] = sum;
    let form = config.win.getBody().queryView({'localId':'formEditDocument'});

    //webix.message(JSON.stringify(state.table.getSelectedItem()),"info",-1,"Message" );

    form.setValues({"sum" :sum }, true);


  }

}


