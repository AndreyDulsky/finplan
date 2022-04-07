import {JetView} from "webix-jet";
import {FormClassState} from "core/service/FormClassState";
import TableSetting from  "components/tableSetting";
import TableDynamic from  "components/tableDynamic";


export default class FormDocumentTableWindow extends JetView {
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
    this.state.types = [];
    this.state.tables = [];
    this.state.isUpdates = [];
    this.state.tableRecords = [];


  }

  renderWindow(tableConfig, formConfig, type) {
    let state = this.state;
    let count = 25*this.state.wins.length;
    let scope = this;
    let countLeft = count;
    let countTop = count;
    let rows = [];
    if (type == 'documentData' || type=='document') {
      rows = [
        {
          view: 'form',
          complexData: true,
          localId: 'formEditDocument',
          elements: formConfig
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
    state.types.push(type);
    state.tables.push(state.table);
    state.isUpdates.push(state.isUpdate);
    state.tableRecords.push(state.tableRecord);


    state.wins[state.wins.length-1].show();

    var res = webix.promise.defer();
    res.resolve(state.wins[state.wins.length-1].getBody()).then(function(result, res1) {
      let res2 = state.wins[state.wins.length-1].getBody().queryView({'localId':'table-layout'});
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
      let complexes = state.wins[state.wins.length-1].getBody().queryView({'complex': true}, 'all');
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
          let elementName = state.wins[state.wins.length-1].getBody().queryView({'localId': localIdName});
          elementName.setValue(this.data.text);
        });
      }
      let currencyIs = state.wins[state.wins.length-1].getBody().queryView({'name': 'currencyIs'});
      currencyIs.attachEvent("onChange", function(value) {

        let currencies = state.wins[state.wins.length-1].getBody().queryView({'batch': 'currency'}, 'all');

        for (let key in currencies) {
          if (value) {
            currencies[key].show();
          } else {
            currencies[key].hide();
          }
        }

      });
      state.formEditDocument = state.wins[state.wins.length-1].queryView({'localId': 'formEditDocument'});

      if (state.formEditDocument && state.isUpdate) {
        state.formEditDocument.setValues(scope.getRecord());
      }

    });
  }


  getTableConfig(obj, table, editor, view, type) {

    let scope = this;
    let state = this.state;
    let configTable = {
      view: "table-service",
      localId: "windowBody",
      $scope : scope,
      state: {
        scope : scope,
        parent: table,
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
        formEdit:  view.formEdit,
        formView:  view.formView,
        formComment:  view.formComment,
        windowDirectory:  view.windowDirectory,
        formDocumentTableWindow:  view.formDocumentTableWindow,
        type: type

      },
      stateCache : webix.storage.local.get(state.editor.config.options_url_edit+'_'+type+"_filter_state"),

    };

    if (state.editor.config.filter) {
      //webix.storage.local.put(state.editor.config.options_url_edit + '_' + type + "_filter_state", state.editor.config.filter);
      configTable.state.params.id = state.editor.config.filter['filterInput'];
    }


    let configDocument = {};
    let rows = [];
    let configForm = {};

    //configForm = scope.getFormDocument();

    if (type == 'documentData' || type == 'document' ) {
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
    }

    rows.push(configTable);
    if (Object.keys(configDocument).length > 0) {
      rows.push(configDocument);
    }
    return rows
  }

  showWindow(obj, table, editor, view, type) {

    let scope = this;
    let state  = this.state;
    let record = (table) ? table.getSelectedItem() : null;
    let isUpdate = (record);
    let fieldSet;
    state.tableRecord = record;

    let api = this.apiRest;

    state.isUpdate = isUpdate;
    state.table = table;
    state.editor = editor;
    state.windowNumber = this.state.wins.length;




    let configTable = scope.getTableConfig(obj, table, editor, view, type);

    //let configForm = scope.getFormConfig(table, type);

    state.tableId = table.config.urlEdit;
    let prefix = 'accounting/';
    state.formUrl = prefix+state.tableId+"/form-document";
    api.get(state.formUrl).then(function(data) {
      state.formData = data.json();
      state.formConfig = {};
      if (state.formData.data.configForm) {
        state.formConfig = state.formData.data.configForm;
      }
      scope.renderWindow(configTable, state.formConfig, type);

      //scope.bindCollection();
    });

  }

  getRecord() {
    let state  = this.state;
    if (state.isUpdates[state.isUpdates.length-1]) {
      return state.tableRecords[state.tableRecords.length-1];
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

    let item = state.table.getSelectedItem();
    item[state.editor.column] = {'id' :record.id, 'name' : record.value};

    if (item.hasOwnProperty("unit")) {
      let unitId = 1;
      if (record.unit_id) {
        unitId = 1;
      }
      let itemDirectory =  state.table.getColumnConfig('unit').collection.getItem(unitId);
      item['unit'] =  {'id' :unitId, 'name' : itemDirectory.name};
    }
    if (item.hasOwnProperty("price") && item['price'] == '') {
      item['price'] =  record.price;
    }
    webix.dp(state.table).ignore(function(){
      state.table.updateItem(item.id, item);
    });
    let index = state.table.getColumnIndex(state.editor.column);
    // var now = state.table.getEditor();
    //state.table.editNext(true, now);
    //state.table.unselectAll();
    //state.table.editStop();

    if(item.id && state.table.config.columns[index+1].id && state.table.editStop()) {
      for (let i=index+1;i< state.table.config.columns.length-1; i++) {
        if (state.table.config.columns[i].hasOwnProperty('editor')) {
          index = i;
          break;
        }
      }
      state.table.select(item.id,state.table.config.columns[index].id);
      state.table.edit({row: item.id, column: state.table.config.columns[index].id});
    } else {
      return state.table.editStop();
    }
    //webix.UIManager.setFocus(state.table.editCell(item.id, state.table.config.columns[index+1].id));
    //webix.UIManager.setFocus(item.id);
    //return false;
    //state.table.updateItem(item.id, item);
    //state.table.$scope.doRefresh();
    //state.table.select(item.id);
  }

  hideWindow() {
    let state  = this.state;
    let windowNumber = state.wins.pop();
    state.types.pop();
    state.tables.pop();
    state.isUpdates.pop();
    state.tableRecords.pop();

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

    //this.doSaveDocument();
    let state = this.state;
    state.formEditDocument = state.wins[state.wins.length-1].queryView({'localId': 'formEditDocument'});
    if (!state.formEditDocument.validate()) return;

    let tableSubData = state.wins[state.wins.length-1].queryView({'localId': 'table-layout'});
    let record = state.formEditDocument.getValues();
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
      state.isUpdates[state.isUpdates.length-1] = false;
      record.id = '';
    }

    webix.dp(state.tables[state.tables.length-1]).save(
      (state.isUpdates[state.isUpdates.length-1]) ? record.id : webix.uid(),
      (state.isUpdates[state.isUpdates.length-1]) ? "update" : "insert",
      record
    ).then(function(obj){

      webix.dp(state.tables[state.tables.length-1]).ignore(function(){

        (state.isUpdates[state.isUpdates.length-1]) ? state.tables[state.tables.length-1].updateItem(record.id, obj) : state.tables[state.tables.length-1].add(obj,0);
        let branches = state.tables[state.tables.length-1].data.getBranch(state.tables[state.tables.length-1].getSelectedId());

        if (state.isUpdates[state.isUpdates.length-1]) {
          state.tables[state.tables.length - 1].remove(state.tables[state.tables.length - 1].data.branch[record.id]);
          state.tables[state.tables.length - 1].data.branch[record.id] = [];
        }
        state.tables[state.tables.length-1].parse({
          parent: obj.id,
          data: obj.data
        });

        state.tables[state.tables.length-1].select(obj.id);

        if (!state.isUpdates[state.isUpdates.length-1])  { state.tables[state.tables.length-1].scrollTo(0, 0) };

        //state.table.sort("name", "asc", "string");
        //state.table.markSorting("name", "asc");

      });
      // debugger;
      // //state.table.getBranch(item).bind(data);
      //state.tables[state.tables.length-1].getItem(state.tables[state.tables.length-1].getSelectedId()).data = data;

      state.tables[state.tables.length-1].refresh();
      state.wins[state.wins.length-1].hide();
    }, function(){
      webix.message("Ошибка! Данные не сохранены!");
    });
  }

  setSumByTableRows() {

    let state  = this.state;
    let scope = this;
    let type = state.types[state.types.length-1];
    if (type != 'documentData' && type != 'document' ) {
      return;
    }
    let res2 = state.wins[state.wins.length-1].getBody().queryView({'localId':'table-layout'});
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
    let form = state.wins[state.wins.length-1].getBody().queryView({'localId':'formEditDocument'});

    //webix.message(JSON.stringify(state.table.getSelectedItem()),"info",-1,"Message" );

    form.setValues({"sum" :sum }, true);


  }

}


