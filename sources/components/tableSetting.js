function columnGroupTemplate(obj, common, item){

  if (obj.$group) return common.treetable(obj, common) + obj.property_value;

  return  common.icon(obj)+common.folder(obj, common)+' '+item;
}

webix.protoUI({
  name:"table-setting",
  defaults: {
    view: "treetable",
    localId: 'table-directory',
    urlEdit: '',
    css: "webix_header_border webix_data_border ",
    leftSplit: 1,
    //spans:true,
    //rightSplit: 0,
    select:"multiselect",
    resizeColumn: {headerOnly: true},
    //localId: 'order-table',
    multiselect: true,
    //scroll: true,
    clipboard: "selection",
    //blockselect: true,
    tooltip: true,
    editable:true,
    editaction: "dblclick",
    sort:"multi",
    drag: false,
    dragColumn:true,
    math: true,
    //save: "api->accounting/"+this.getModelName(this.mode),
    //save: "firebase->accounting/"+this.mode,//this.getModelName(this.mode),
    //owCss:"#css#",
    //url: "firebase->transaction",
    on:{
      onAfterColumnDrop : function() {
        //webix.storage.local.put("start-table", this.getState());

      },
      onItemDblClick:function(id, e, trg) {
        let item = this.getItem(id);
        this.$scope.selectRecord(item);
        this.$scope.hideWindow();

        if (item.account_id) {
          if (this.$scope.urlParams['account_id']) {
            this.$scope.show('inproduce/register-account-subconto?account_id='+item.account_id+'&subconto1_value=' + item.subconto1_value);
          }
          if (Object.keys(this.$scope.urlParams).length == 0) {
            this.$scope.show('inproduce/register-account?account_id=' + item.account_id+'&schema-table-user-id=196');
          }

        }
      },
      onItemClick:function(id, e, trg) {

        if (id.column == 'action-edit') {
          this.$scope.state.table.$scope.formEdit.showForm(this);
        }
        if (id.column == 'action-view') {
          //this.$scope.formView =  this.$scope.ui(FormView);
          let configColumn = this.$scope.table.getColumnConfig(id.column);
          //this.$scope.formView.showWindow(configColumn['goto']);
          if (configColumn['goto']) {

            this.$scope.show('inproduce/'+configColumn['goto']+'/'+id.row);
          } else {
            this.$scope.formView.showWindow({},this);
          }

        }
        if (id.column == 'action-delete') {
          var table = this;
          webix.confirm("Удалить запись?").then(function(result) {
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

        }
        if (id.column == 'action-comment') {
          let item = this.getItem(id);
          //TODO: change A to configurate column for comment
          this.$scope.formComment.showForm(this, item.A);

        }
      },
      onBeforeLoad:function(){

        //this.showOverlay("Loading...");
      },
      onBeforeDrop:function(context, e){


        let record = this.getItem(context.start);
        let recordSource = this.getItem(context.parent);
        let result = true;
        if (!recordSource) {
          result = false;
        }

        if (result) {
          result = scope.beforeDropChangeData(record, recordSource.value, context);
        }
        if (!result) {
          scope.table.addRowCss(record.id, "highlight-red");
          setInterval(function(){ scope.table.removeRowCss(record.id, "highlight-red") }, 4000);
        }
        return result;

      },

      onSelectChange: function(id, e, trg){

      },
    },
    onClick:{
      "editor-button":function(ev, id,obj, obj1){

        let editor = this.getEditState();
        this.$scope.windowDirectory.showWindow({},this, editor);
        return false; // blocks the default click behavior
      }
    }


  },
  $init:function(){
    //this.getTable();
    this.getDataTable();
  },
  getTable() {
    let layout = this;
    let scope = this;
    //let tableConfig = ;

    //let table = webix.ui(tableConfig);


    //this.table = table;
    //webix.extend(this.table, webix.ProgressBar);
    //layout.addView(table);


    //this.table = webix.ui(tableConfig,this );
    //this.setColorSettingForTable();
  },
  // defaults:{
  //   view: "treetable",
  //   localId: 'table-directory-layout',
  //   //urlEdit: this.mode,
  //   css: "webix_header_border webix_data_border ",
  //   leftSplit: 15,
  //   directoryUrl: '',
  //   //spans:true,
  //   //rightSplit: 0,
  //   select:"multiselect",
  //   resizeColumn: {headerOnly: true},
  //   //localId: 'order-table',
  //   multiselect: true,
  //   //scroll: true,
  //   clipboard: "selection",
  //   //blockselect: true,
  //   tooltip: true,
  //   editable:true,
  //   editaction: "dblclick",
  //   sort:"multi",
  //   drag: false,
  //   dragColumn:true,
  //   math: true,
  //   //url: "api->accounting/product-beds",//+this.getModelName(this.mode),
  //   //save: "firebase->accounting/"+this.mode,//this.getModelName(this.mode),
  //   //owCss:"#css#",
  //
  //   scheme:{
  //
  //   },
  //   ready: function() {
  //
  //
  //   },
  //   on:{
  //     onAfterColumnDrop : function() {
  //       //webix.storage.local.put("start-table", this.getState());
  //
  //     },
  //     onItemDblClick:function(id, e, trg) {
  //       let item = this.getItem(id);
  //       this.$scope.selectRecord(item);
  //       this.$scope.hideWindow();
  //     },
  //     onItemClick:function(id, e, trg) {
  //
  //       if (id.column == 'action-edit') {
  //         this.$scope.formEdit.showForm(this);
  //       }
  //       if (id.column == 'action-view') {
  //         //this.$scope.formView =  this.$scope.ui(FormView);
  //         let configColumn = this.$scope.table.getColumnConfig(id.column);
  //         //this.$scope.formView.showWindow(configColumn['goto']);
  //         if (configColumn['goto']) {
  //
  //           this.$scope.show('inproduce/'+configColumn['goto']+'/'+id.row);
  //         } else {
  //           this.$scope.formView.showWindow({},this);
  //         }
  //
  //       }
  //       if (id.column == 'action-delete') {
  //         var table = this;
  //         webix.confirm("Удалить запись?").then(function(result) {
  //           webix.dp(table).save(
  //             id.row,
  //             "delete"
  //           ).then(function(obj){
  //             webix.dp(table).ignore(function(){
  //               table.remove(id.row);
  //             });
  //           }, function(){
  //             webix.message("Ошибка! Запись не удалена!");
  //           });
  //         });
  //
  //       }
  //       if (id.column == 'action-comment') {
  //         let item = this.getItem(id);
  //         //TODO: change A to configurate column for comment
  //         this.$scope.formComment.showForm(this, item.A);
  //
  //       }
  //     },
  //     onBeforeLoad:function(){
  //
  //       //this.showOverlay("Loading...");
  //     },
  //     onBeforeDrop:function(context, e){
  //
  //
  //       let record = this.getItem(context.start);
  //       let recordSource = this.getItem(context.parent);
  //       let result = true;
  //       if (!recordSource) {
  //         result = false;
  //       }
  //
  //       if (result) {
  //         result = scope.beforeDropChangeData(record, recordSource.value, context);
  //       }
  //       if (!result) {
  //         scope.table.addRowCss(record.id, "highlight-red");
  //         setInterval(function(){ scope.table.removeRowCss(record.id, "highlight-red") }, 4000);
  //       }
  //       return result;
  //
  //     },
  //
  //     onSelectChange: function(id, e, trg){
  //
  //     },
  //
  //
  //
  //   },
  //
  //   onClick:{
  //     "editor-button":function(ev, id,obj){
  //       this.$scope.windowDirectory.showWindow({'head' : 'Справочник подразделений'},this);
  //       return false; // blocks the default click behavior
  //     }
  //   }
  // },

  getDataTable() {

    let scope = this;


    scope.table = this;


    scope.columns = [];

    webix.extend(scope, webix.ProgressBar);
    scope.disable();
    scope.showProgress({
      type:"icon",
      hide: false
    });
    scope.filter = {};


    scope.tableUrl = scope.$scope.directoryUrl;
    //scope.table.load(scope.tableUrl);
    webix.ajax().get(scope.tableUrl, scope.filter ).then(function(data){
      //debugger;
      //scope.table = scope.queryView('treetable');
      scope.table.clearAll();
      let items = data.json();

      let dataItem = (items.data)?items.data:items.items;
      scope.dataItem = dataItem;


      items.config.columns = scope.dataDriverJsonToObject(items.config.columns);

      scope.table.config.columns = items.config.columns;
      scope.columns = items.config.columns;
      scope.table.refreshColumns();
      //scope.setColumnSettingForTable();


      scope.table.parse(dataItem);


      scope.table.enable();
      scope.table.hideProgress();
      scope.table.select(scope.$scope.state.editor.value);
      scope.table.showItem(scope.$scope.state.editor.value*1);

      let resultType= 'obj.group';

      // scope.table.group({
      //   by: function (obj) {
      //     return eval(resultType);
      //   },
      //   map: {
      //     'property_value':[function (obj) {
      //       return eval(resultType);
      //     }],
      //     'property_title':['A'],
      //     'index':['','string'],
      //     'I':['','string'],
      //     'G':['G','sum'],
      //     'value_sum':['value_sum','median'],
      //     'L':['','string'],
      //     'N':['','string'],
      //     'O':['','string'],
      //     'P':['','string']
      //   },
      // });
      scope.table.openAll();
    });
  },
  dataDriverJsonToObject(configColumns) {
    configColumns.forEach(function(item,key) {

      let myObj = {
        func: {}
      }

      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('webix') ==0) {
        eval(" myObj.func = (obj) => { return "+item.format+"(obj); }");// + item.format);
        configColumns[key].numberFormat = "1111.00";//eval(item.format);
      }

      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('formatMonthYear') ==0) {
        eval(" myObj.func = (obj) => { return "+item.format+"(obj); }");// + item.format);
        //configColumns[key].numberFormat = "1111.00";//eval(item.format);
        configColumns[key].format = myObj.func;
      }


      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('formatDateTime') ==0) {
        eval(" myObj.func = (obj) => { try {formatDateTime(obj)} catch (e) { debugger; obj = obj.trim(); } return  (obj!='' && obj!=null) ? formatDateTime(obj) : ''; }");// + item.format);
        configColumns[key].format = myObj.func;//eval(item.format);
      }

      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('formatDateShort') ==0) {
        eval(" myObj.func = (obj) => { try {formatDateShort(obj)} catch (e) { debugger; obj = obj.trim();} return  (obj!='' && obj!=null) ? formatDateShort(obj) : ''; }");// + item.format);
        configColumns[key].format = myObj.func;//eval(item.format);
      }

      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('formatDate') ==0) {
        eval(" myObj.func = (obj) => { try {formatDate(obj)} catch (e) { debugger; } return  (obj!='' && obj!=null) ? formatDate(obj) : ''; }");// + item.format);
        configColumns[key].format = myObj.func;//eval(item.format);
      }

      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('formatDateHour') ==0) {
        eval(" myObj.func = (obj) => { try {formatDateHour(obj)} catch (e) { debugger; } return  (obj!='' && obj!=null) ? formatDateHour(obj) : ''; }");// + item.format);
        configColumns[key].format = myObj.func;//eval(item.format);
      }

      if (item.template && typeof configColumns[key].template != 'function' && item.template.indexOf('(obj,common,value)') ==0) {
        eval(" myObj.func = " + item.template);
        configColumns[key].template = myObj.func;
      }
      if (item.template && typeof configColumns[key].template != 'function' && item.template.indexOf('custom_checkbox') ==0) {
        eval(" myObj.func = " + item.template);
        configColumns[key].template = myObj.func;
      }
      //debugger;
      if (item.template && typeof configColumns[key].template != 'function' && item.template.indexOf('columnGroupTemplate') ==0) {
        eval(" myObj.func = " + item.template);
        configColumns[key].template = myObj.func;
      }

    });
    return configColumns;
  },

}, webix.ui.treetable);