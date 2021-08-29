import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

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
      decimalDelimiter:".",
      decimalSize:2
    })
    //if (value.format)
    //result = value.format(result);
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

webix.protoUI({
  name:"table-dynamic",
  defaults: {
    localId:"layout"
  },

  $init: function(config) {
    let scope = this;
    this.initParam = false;

    this.state = config.state;
    this.stateCache = config.stateCache;

    config.rows = [
      {
        view: "toolbar",
        padding: 10,
        cols:[
          {
            view: "icon",
            icon: "mdi mdi-keyboard-backspace",
            autowidth: true,
            value : true,
            localId: "btn-back",
            click: function() {  window.history.back(); }

          },
          {
            type: "header",
            localId: "table-title",
            template: "Таблица",
            width: 300,
            borderless: true
          },
          {
            localId: "show-filter-date-range",
            hidden: true,
            cols:[
              {
                localId: "filter-date-range-field",
                cols:[{
                  localId: "filter-date-range-field-label",
                  label: "",
                  view: "label",
                  width: 20
                },
                  {
                    view: "datepicker",
                    localId: "dateFrom",
                    inputWidth: 120,
                    width: 130,
                    value: (this.stateCache) ? this.stateCache.dateFrom : webix.Date.monthStart(new Date())
                  },
                  {
                    label: "по",
                    view: "label",
                    width: 27
                  },
                  {
                    view: "datepicker",
                    localId: "dateTo",
                    inputWidth: 120,
                    width: 120,
                    value: (this.stateCache) ? this.stateCache.dateTo :webix.Date.monthEnd(new Date())
                  }
                ]
              },
              {
                view: "icon",
                icon: "mdi mdi-filter",
                localId: "show-icon-filter-setting",
                width: 30,
                css: "small",
                click: function() {
                  scope.showFilterSetting();
                }
              },
              {
                view: "icon",
                icon: "mdi mdi-sort",
                localId: "show-icon-sort-setting",
                width: 30,
                css: "small",
                click: function() {
                  scope.showSortSetting();
                }
              },
              {
                view: "icon",
                icon: "mdi mdi-format-color-fill",
                localId: "show-icon-color-setting",
                width: 30,
                css: "small",
                click: function() {
                  scope.showColorSetting();
                }
              },
              {
                view: "icon",
                icon: "mdi mdi-invert-colors",
                localId: "show-icon-color-column-setting",
                width: 30,
                css: "small",
                click: function() {
                  scope.showColumnSetting();
                }
              },
            ]
          },

          {
            localId: "show-filter",
            hidden: true,

            cols:[
              {
                cols:[{
                  width :25
                },
                  {
                    label: "Отбор по",
                    view: "label",
                    width: 60,
                    localId: "filter-field-label"
                  },

                  {
                    view: "select",
                    labelWidth: 100,
                    value: (this.stateCache) ? this.stateCache.dateFrom : "",
                    options: [],
                    hidden: false,
                    localId: "filter-field"
                  },
                  {
                    localId: "filter-layout",
                    cols:[

                    ]
                  }

                ]
              },
            ]
          },
          { view: "richselect",
            localId: "batch-column",
            value: 4,
            labelWidth: 100,
            options:[],
            width: 250,
            hidden: true,
            on:{
              onChange:function(newv){
                scope.selectColumnSettingForTable(newv);

              }
            }
          },


          {
            view: "richselect",
            value: 4,
            labelWidth: 100,
            options: [],
            width: 250,
            hidden: false,
            localId: "select-type"
          },
          {
            view: "icon",
            icon: "mdi mdi-tools",
            localId: "show-icon-setting",
            width: 30,
            hidden: true,
            click: function() {
              scope.showSetting();
            }
          },
          //{ $subview:true }

        ]
      },
      {
        view: "toolbar",
        localId: "show-toolbar",
        height: 30,
        cols:[
          {
            view: "icon",
            icon: "mdi mdi-plus",
            localId: "show-add-button",
            tooltip: "Добавить",
            hidden: true,
            width: 30,
            click: () => this.doAddClick()
          },


          //{ view:"icon", icon: 'mdi mdi-printer', autowidth:true, click: () =>  this.doClickPrint()},
          { view: "icon", icon: 'mdi mdi-microsoft-excel', autowidth: true, click: () =>  this.showExportToExcelSetting()},
          {
            view: "toggle",
            type: "icon",
            icon: "mdi mdi-file-tree",
            autowidth: true,
            value: true,
            hidden: false,
            click: function() { scope.doClickOpenAll() }

          },
          {
            view: "icon",
            icon: 'mdi mdi-refresh',
            autowidth: true,
            value: true,
            click: function() { scope.doRefresh() }

          },
          {},
        ]
      },
      {
        localId: "body-layout",
        cols:[{
          localId: "table-layout",
          view: "datatable"
        }]
      }
    ];
    this.$ready.push(this.setPage);
    //this.$ready.push(this.attachToolBarEvents());

    //this.setPage();
    //this.attachToolBarEvents();

    // this.formEdit = this.ui(FormEditView);
    // this.windowDirectory = this.ui(WindowDirectoryView);
    // this.formComment = this.ui(FormCommnetView);
    // this.formView = this.ui(FormViewView);

  },
  $ready: function() {
    //this.setPage();
  },
  setPage() {

    this.showGoToBack();
    this.model = this.capitalizeFirstLetter(this.state.params.mode);
    this.setSelectType();
    this.schemaTableSetting = this.getSchemaTableSetting();
    this.setTableSetting();
    this.setFilterSetting();
    this.getTable();
    this.getDataTable();
    this.attachToolBarEvents();


  },

  attachToolBarEvents() {

    let scope = this;
    scope.dateFrom.attachEvent("onChange", function(id) {

      scope.getDataTable();
      scope.putFilterState();
    });

    scope.dateTo.attachEvent("onChange", function(id) {

      scope.getDataTable();
      scope.putFilterState();
    });

    scope.filterField.attachEvent("onChange", function(id) {

      scope.getDataTable();
      scope.putFilterState();
    });

    scope.filterInput.attachEvent("onChange", function(id) {

      scope.getDataTable();
      scope.putFilterState();
    });



  },

  eventSetColumnUserSize(id,newWidth,oldWidth,user_action) {
    let scope = this;
    //let url = this.state.apiRest.getUrl('get',"accounting/schema-table-users");
    if (user_action) {
      let config = this.table.getColumnConfig(id);
      let url = this.state.apiRest.getUrl('get',"accounting/schema-table-users/"+config.rowId);
      webix.ajax().put(url, {"width":newWidth,"adjust":'', "id":config.rowId}, function(text, data, request) {
        scope.showMessageResult(data.json(), request, false)
      })
    }
  },

  eventSetColumnUserSort(sourceId, targetId, event) {

    let scope = this;
    let configSource = this.table.getColumnConfig(sourceId);
    let configTarget = this.table.getColumnConfig(targetId);

    let url = this.state.apiRest.getUrl('get',"accounting/schema-table-user/order");//+configSource.rowId);
    webix.ajax().get(url, {"sort_order": configSource.sort_order, "id":configSource.rowId, 'target_sort_order':configTarget.sort_order,
      'list_id' : scope.selectTypeValue }, function(text, data, request) {
      scope.showMessageResult(data.json(), request, false)
    });

  },

  putFilterState() {
    webix.storage.local.put(this.state.params.mode+'_'+this.state.cachePrefix+"_filter_state", {
      dateFrom:this.dateFrom.getValue(),
      dateTo:this.dateTo.getValue(),
      filterField: this.filterField.getValue(),
      filterInput:this.filterInput.getValue(),
    });
  },

  showGoToBack() {
    let id = this.state.params.id;
    if (id) {
      this.getEl('btn-back').show();
    } else {
      this.getEl('btn-back').hide();
    }
  },

  getEl(localId) {
    return this.queryView({'localId' : localId})
  },

  capitalizeFirstLetter(string) {
    let names = string.split('-');
    let result = [];
    names.forEach(function(item) {
      result.push(item.charAt(0).toUpperCase() + item.slice(1));
    });
    return result.join('');
  },

  setSelectType() {
    let scope = this;
    this.selectType = this.getEl('select-type');
    let response = webix.ajax().sync().get(this.state.urlTableUserLists,{filter:{'model': this.model}, 'expand':'schemaTableUserFilter'});
    let dataSelectType = JSON.parse(response.responseText);
    if (dataSelectType['errors']) {
      for (var prop in dataSelectType.errors) {
        webix.message({
          text:prop+':'+dataSelectType.errors[prop],
          type:"error",
          expire: -1,
        });

      }
      webix.alert({
        title:"Ошибка",
        ok:"Ок",
        text:"Обратитесь к администратору системы"
      });
      throw new Error();
    }
    this.dataSelectType = dataSelectType;

    let length = dataSelectType.data.length;

    let idSelectType = '';
    scope.schemaTableUserFilter = [];
    let stateSelectType;

    if (this.getSelectTypeState()) {
      stateSelectType = this.getSelectTypeState();
      dataSelectType.data.forEach(function (item) {
        if (item.id == stateSelectType) {
          idSelectType = item.id;
          scope.schemaTableUserFilter = item.schemaTableUserFilter;
          scope.schemaFilterUserList = item.filter_setting;
          scope.schemaSortUserList = item.sort_setting;
          scope.schemaColorUserList = item.color_setting;
          scope.schemaColumnUserList = item.column_setting;

        }
      });
      if (idSelectType == '') webix.storage.local.remove(this.state.params.mode+'_'+this.state.cachePrefix+"_select_type_state");
    }
    dataSelectType.data.forEach(function (item) {

      if (idSelectType =='' && item.is_default == 1) {
        idSelectType = item.id;
        scope.schemaTableUserFilter = item.schemaTableUserFilter;
        scope.schemaFilterUserList = item.filter_setting;
        scope.schemaSortUserList = item.sort_setting;
        scope.schemaColorUserList = item.color_setting;
        scope.schemaColumnUserList = item.column_setting;

      }
    });

    this.selectType.define('options', {
      body: {
        data: dataSelectType.data,
        on: {
          onItemClick: function (id) {

            let item = this.getItem(id);
            scope.selectTypeValue = id;
            scope.schemaTableSetting = scope.getSchemaTableSetting();
            scope.schemaTableUserFilter = item.schemaTableUserFilter;
            scope.schemaFilterUserList = item.filter_setting;
            scope.schemaSortUserList = item.sort_setting;
            scope.schemaColorUserList = item.color_setting;
            scope.schemaColumnUserList = item.column_setting;
            scope.setColorSettingForTable();
            //scope.setColumnSettingForTable();

            scope.setTableSetting();
            scope.setFilterSetting();
            scope.getDataTable();

            scope.putSelectTypeState(id);
          }
        }
      },

    });

    this.selectType.refresh();

    this.selectType.setValue(idSelectType);
    this.selectTypeValue = idSelectType;

    if (length == 1) {
      this.selectType.hide();
    } else {
      this.selectType.show();
    }

  },

  getSelectTypeState() {
    let stateCache = webix.storage.local.get(this.state.params.mode+'_'+this.state.cachePrefix+"_select_type_state");
    if (stateCache)
      return stateCache.selectType;
    return false;
  },

  getSchemaTableSetting() {

    let url = this.state.urlTableSettingUsers;
    let response = webix.ajax().sync().get(url, {filter:{"model": this.model, "list_id":this.selectTypeValue}});
    let data = JSON.parse(response.responseText);
    let setting = {};
    this.schemaTableSettingColumns = data.config.columns;
    this.schemaTableSettingItems = data.data;
    this.schemaTableSettingData = data;
    data.data.forEach(function(item)  {
      if (!setting[item.type_property]) setting[item.type_property] = {};
      setting[item.type_property][item.property] = item;
    });

    return setting;
  },

  setTableSetting() {
    let scope = this;
    let setting = this.schemaTableSetting;

    for (let key in setting.show) {
      if (this.getEl(key) !==null && setting.show[key].value ==='1') {
        this.getEl(key).show();
      }
    }

    for (let keyTemp in setting.template) {
      if (this.getEl(keyTemp) !==null ) {
        this.getEl(keyTemp).define({'template' : setting.template[keyTemp].value});
        this.getEl(keyTemp).refresh();
      }
    }

    for (var keyFilter in setting.filter) {
      if (this.getEl(keyFilter) !==null ) {
        if (keyFilter == 'filter-field') {
          this.getEl(keyFilter+'-label').define({'label': setting.filter[keyFilter].value});
          this.getEl(keyFilter+'-label').refresh();
        }
        if (keyFilter == 'filter-date-range-field') {

          // scope.$$(keyFilter+'-label').define({'label': setting.filter[keyFilter].property_title});
          // scope.$$(keyFilter+'-label').refresh();
          this.filterDateRangeField = setting.filter[keyFilter].value;
        }
      }
    }
  },

  setFilterSetting() {
    let scope = this;
    this.getEl('filter-field').data.options = [];
    this.getEl('filter-field').refresh();
    this.schemaTableUserFilter.forEach(function(item, key) {

      scope.getEl('filter-field').data.options.push({'id': item.column_id, 'value': item.header});
      if (key==0 && !scope.getEl('filter-input')) {
        scope.getEl('filter-layout').addView({
          view:'search-close',
          name:'text',
          value: (scope.stateFilter) ? scope.stateFilter.filterInput: '',
          //width:200,
          localId: 'filter-input'
        })
      }

    });

    scope.getEl('filter-field').refresh();
    if (scope.stateFilter) {
      scope.getEl('filter-field').setValue(scope.stateFilter.filterField);
    }
  },

  getTable() {
    let layout = this.getEl("body-layout");
    let scope = this;
    let tableConfig = {
      view: "treetable",
      localId: 'table-layout',
      urlEdit: this.state.params.mode,
      css: "webix_header_border webix_data_border ",
      leftSplit: 0,
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
      save: "api->accounting/"+this.getModelName(this.state.params.mode),
      //save: "firebase->accounting/"+this.mode,//this.getModelName(this.mode),
      //owCss:"#css#",
      //url: "firebase->transaction",
      scheme:{

      },
      ready: function() {
        //scope.attachToolBarEvents()
      },
      on:{
        onAfterColumnDrop : function() {
          //webix.storage.local.put("start-table", this.getState());

        },
        onItemDblClick:function(id, e, trg) {
          let item = this.getItem(id);

          if (scope.state.cachePrefix == 'directory') {
            this.$scope.selectRecord(item);
            this.$scope.hideWindow();
          }
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
            scope.state.formEdit.showForm(this);
          }
          if (id.column == 'action-view') {
            //this.$scope.formView =  this.$scope.ui(FormView);
            let configColumn = scope.table.getColumnConfig(id.column);
            //this.$scope.formView.showWindow(configColumn['goto']);
            if (configColumn['goto']) {

              scope.$scope.show('main/'+configColumn['goto']+'/'+id.row);
            } else {
              scope.state.formView.showWindow({},this);
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
            scope.state.formComment.showForm(this, item.A);

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
          scope.state.windowDirectory.showWindow({},scope.table, editor, scope.state.scope);
          return false; // blocks the default click behavior
        }
      }
    };

    //let table = webix.ui(tableConfig);


    //this.table = table;
    //webix.extend(this.table, webix.ProgressBar);
    //layout.addView(table);


    this.table = webix.ui(tableConfig,layout,this.getEl('table-layout') );
    this.table.attachEvent("onColumnResize", function(id,newWidth,oldWidth,user_action) {
      scope.eventSetColumnUserSize(id,newWidth,oldWidth,user_action);
    });

    this.table.attachEvent("onAfterColumnDrop", function(sourceId, targetId, event) {
      scope.eventSetColumnUserSort(sourceId, targetId, event);
    });

    this.setColorSettingForTable();

  },

  getModelName(mode) {
    let end = mode[mode.length-1];
    let word = mode.split('-');
    word = word[word.length-1];

    if (end == 'y' && word.length > 3) {
      return mode.replace(/y$/,'ies');
    }
    if (end == 's' && word.length > 3) {
      return mode.replace(/s$/,'ses');
    }
    return mode+'s';
  },

  getDataTable() {
    let scope = this;

    this.table.define('leftSplit', (this.schemaTableSetting.datatable['leftSplit'].value) ? this.schemaTableSetting.datatable['leftSplit'].value*1 : 0);
    this.table.define('rightSplit', (this.schemaTableSetting.datatable['rightSplit'].value) ? this.schemaTableSetting.datatable['rightSplit'].value*1 : 0);
    this.table.define('drag', (!this.schemaTableSetting['access'] || (!this.schemaTableSetting['access']['can-drop'] || this.schemaTableSetting['access']['can-drop'].value == 0) ) ? false :  "order");


    scope.columns = [];
    let params = {
      'per-page' : 2000,
      'schema-table-user-id': scope.selectTypeValue,
      //'sort': '[{"property":"'+this.filterDateRangeField+'","direction":"ASC"}]'
    };

    let paramsSort = this.getSortParams();
    if (paramsSort.length > 0) {
      params['sort'] = paramsSort;
    }

    if (this.state.params.mode == 'order') {
      params['expand'] = 'comment,images';
    }


    let url = new URL(location.href.replace('/#!',''));

    let searchParams = new URLSearchParams(url.search);
    if (!this.urlParams && (searchParams.get('account_id') || searchParams.get('subconto1_value'))) {

      this.urlParams = [];
      if (searchParams.get('account_id')) this.urlParams['account_id'] = searchParams.get('account_id');
      if (searchParams.get('subconto1_value'))  this.urlParams['subconto1_value'] = searchParams.get('subconto1_value');
      if (searchParams.get('schema-table-user-id')) this.urlParams['schema-table-user-id'] = searchParams.get('schema-table-user-id');

    }

    if (this.urlParams) {
      for (let key in this.urlParams) {
        params[key] = this.urlParams[key];
      }
    }
    scope.tableUrl = this.state.scope.app.config.apiRest.getUrl('get',"accounting/"+this.getModelName(this.state.params.mode), params);

    webix.extend(this.table, webix.ProgressBar);
    this.table.disable();
    this.table.showProgress({
      type:"icon",
      hide: false
    });
    scope.filter = scope.getFilterParams();


    webix.ajax().get(scope.tableUrl, scope.filter ).then(function(data){
      scope.table.clearAll();
      let items = data.json();

      let dataItem = (items.data)?items.data:items.items;
      scope.dataItem = dataItem;
      //debugger;
      //items.config.columns = webix.DataDriver.json.toObject(items.config.columns);

      items.config.columns = scope.dataDriverJsonToObject(items.config.columns);

      scope.table.config.columns = items.config.columns;
      scope.columns = items.config.columns;
      scope.table.refreshColumns();
      scope.setColumnSettingForTable();


      scope.table.parse(dataItem);

      scope.table.enable();
      scope.table.hideProgress();

      let resultType= '';
      if (scope.schemaTableSetting.group['group-by'].type) {
        resultType = scope.schemaTableSetting.group['group-by'].type+'(obj.'+scope.schemaTableSetting.group['group-by'].value+')';
      } else {
        let configColumn = scope.table.getColumnConfig(scope.schemaTableSetting.group['group-by'].value);

        resultType = 'obj.'+scope.schemaTableSetting.group['group-by'].value;
      }

      if (scope.schemaTableSetting.group['group-by'].value) {
        scope.table.group({
          by: function (obj) {
            return eval(resultType);
          },
          map: {
            'property_value': [function (obj) {

              let per = eval(resultType);
              let configColumn = scope.table.getColumnConfig(scope.schemaTableSetting.group['group-by'].value);
              if (configColumn.collection) {
                //id collection json or colellection "api->url"
                return (configColumn.collection.getItem(per)) ? configColumn.collection.getItem(per).value : scope.api.dataCollection['accounting/material-types'].getItem(per).value;//configColumn.collection.getItem(per).value;
              } else {
                return eval(resultType);
              }
            }],
            'property_title': ['A'],
            'index': ['', 'string'],
            'I': ['', 'string'],
            'G': ['G', 'sum'],
            'value_sum': ['value_sum', 'median'],
            'L': ['', 'string'],
            'N': ['', 'string'],
            'O': ['', 'string'],
            'P': ['', 'string']
          },
        });
      }

      scope.table.openAll();
      if (scope.state.cachePrefix == 'directory') {
        scope.table.select(scope.$scope.state.editor.value);
        scope.table.showItem(scope.$scope.state.editor.value*1);
      }


    });
  },

  getSortParams() {
    let params = '';

    if (this.filterDateRangeField) {
      params = '[{"property":"'+this.filterDateRangeField+'","direction":"ASC"}]';
    }
    if (this.schemaSortUserList && this.schemaSortUserList.length > 2) {
      let sort = JSON.parse(this.schemaSortUserList);
      params = [];
      for (let key in sort) {
        params.push({'property':sort[key].field, 'direction' : sort[key].direction});
      }
      params = JSON.stringify(params);
    }

    return params;
  },

  getFilterParams() {

    let scope = this;
    this.format = webix.Date.dateToStr("%Y-%m-%d");
    this.dateFrom = this.getEl("dateFrom");
    this.dateTo = this.getEl("dateTo");
    this.filterField = this.getEl('filter-field');
    this.showFilterDateRange= this.getEl('show-filter-date-range');
    this.filterInput = this.getEl('filter-input');

    this.dateFromValue = this.format(this.dateFrom.getValue());
    this.dateToValue = this.format(this.dateTo.getValue());
    this.filterFieldValue = this.filterField.getValue();
    this.filterInputValue = this.filterInput.getValue();

    let filterParams = {
      filter: {
        "or":[]
      }
    };

    let type = {};
    let date = {};

    if (this.showFilterDateRange.isVisible() && this.filterDateRangeField) {
      date[this.filterDateRangeField] =  {">=": this.dateFromValue, '<=': this.dateToValue};
      filterParams["filter"]["or"] = [date];
    }




    if (this.schemaFilterUserList && this.schemaFilterUserList.length > 2) {
      let filter = JSON.parse(this.schemaFilterUserList);

      let filterSchema = {};
      let filterFirstLavel = {"or": []};
      //let filter = setting;

      for (let key in filter) {

        if (filter[key].value == 'dateFrom') filter[key].value = this.dateFromValue;
        if (filter[key].value == 'dateTo') filter[key].value = this.dateToValue;

        if (filter[key].comparison == 'in') filter[key].value = filter[key].value.split(',');

        if (filter[key].operator == "or") {
          filterFirstLavel["or"].push(filterSchema);
          filterSchema = {};
        }
        if (!filterSchema[filter[key].field]) filterSchema[filter[key].field] = {};
        filterSchema[filter[key].field][filter[key].comparison] = filter[key].value;


      }

      filterFirstLavel["or"].push(filterSchema);
      filterParams["filter"] = filterFirstLavel;


    }

    if (this.filterField.isVisible() && this.filterInputValue!='') {
      //type[this.filterFieldValue] =  {">=": this.dateFromValue, '<=': this.dateToValue};
      type[this.filterFieldValue] = {};
      type[this.filterFieldValue]['like'] =  this.filterInputValue;
      filterParams["filter"]["or"] = [type];
    }
    //
    // if (type.length == 0 && date.length == 0) {
    //   filterParams["filter"]["or"] = [];
    // }

    if (this.state.params.id) {
      filterParams["filter"]["and"] = [{'list_id': this.state.params.id}];
    }


    //filterParams["filter"]["or"].push(type);

    console.log(filterParams);
    return filterParams;
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

  setColumnSettingForTable() {

    let scope = this;
    let selectBatch = this.getEl('batch-column');
    let columnSetting = {};
    let options = [];
    let select = "0";
    let i = 0;
    this.schemaColumnUserListObject = JSON.parse(this.schemaColumnUserList);

    columnSetting = this.schemaColumnUserListObject;

    for (let key in columnSetting) {
      i++;

      if (i== 1) {
        select = (scope.selectColumnSettingId) ? scope.selectColumnSettingId : key;
      }
      let item = columnSetting[key];

      options.push({'id':key,'value':item.value})
    }

    selectBatch.define('options', {
      body: {
        data: options
      },
    });


    selectBatch.setValue(select);
    this.selectColumnSettingForTable(select);

    if (i==0 || i==1) {
      selectBatch.hide();

    } else {
      selectBatch.show();
    }
    selectBatch.refresh();



  },

  selectColumnSettingForTable(id) {
    let scope = this;
    scope.selectColumnSettingId = id;
    //debugger;

    let columnSetting = this.schemaColumnUserListObject;

    let categories = {};
    let cssFormatSelect = {}
    for (let key in columnSetting) {
      categories = columnSetting[key].category;
      for (let keyCategory in categories) {
        console.log(keyCategory);
        let item = categories[keyCategory];
        let cssFormat = '';
        if (key == id) {
          //item['border-left'] = '1px #bbb solid';
          //item['border-right'] = '1px #bbb solid';
          cssFormatSelect[item.field] = item;
          scope.table.getColumnConfig(item.field).cssFormat = function (value, config) {
            return item
          };
          //scope.table.getColumnConfig(item.field).css = {'border-left' : '1px #bbb solid', 'border-right' : '1px #bbb solid'};

        } else {
          let columnConfig = scope.table.getColumnConfig(item.field);
          if (columnConfig) {
            //clear other
            columnConfig.cssFormat = cssFormat;
          }
        }
      }
    }
    ///for last appply
    for (let key in cssFormatSelect) {
      if (scope.table.getColumnConfig(key)) {
        scope.table.getColumnConfig(key).cssFormat = function (value, config) {
          return cssFormatSelect[key];
        };
      }
    }
    scope.table.refreshColumns();
  },

  //setting filter
  showFilterSetting() {
    let scope = this;
    let body = {
      localId: 'body-setting-filter-layout',
      css: 'webix_primary',
      type: 'space',
      cols:[
        {
          type: 'form',
          rows:[

            {

              rows: this.getHeaderFilterSetting()
            },


          ]
        }
      ]
    }

    let winConfig = {
      view:"window",
      head:"Настройки фильтра",
      width: 700,
      height: 500,
      position: 'center',
      modal:true,
      close:true,
      move: true,
      resize:true,
      body: body
    };

    this.winFilter = webix.ui(winConfig);
    this.setElementFilterForm();
    this.winFilter.show();
  },

  setElementFilterForm() {
    if (this.schemaFilterUserList && this.schemaFilterUserList.length >2) {

      let values = JSON.parse(this.schemaFilterUserList);

      let formRowLayout = this.winFilter.queryView({'localId': 'form-row-layout'});
      for (let key in values) {
        formRowLayout.addView(this.getElementFilterForm(key));
      }
      this.winFilter.queryView('form').setValues(values);
    }
  },

  getElementFilterForm(id) {
    let scope = this;
    return {
      localId: 'element-filter-'+id,
      rows:[{
        cols:[{
          view:'combo',
          name: id+'.operator',
          labelWidth: 150,
          labelPosition: 'top',
          label:'Оператор',
          value: '',
          disabled: (id == 0) ? true : false,
          options:['','and','or']
        },
          {
            view:'combo',
            name: id+'.field',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Выберите поле',
            value: 'date_shipment',
            options: this.table.config.columns
          },
          {
            view:'combo',
            name: id+'.comparison',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Тип сравнения',
            value: '=',
            options: ['=','>=','<=','in', '!=']

          },
          {
            view:'text',
            name: id+'.value',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Значение',
            value: ''
          },
          {
            view:'icon',
            icon: 'mdi mdi-close',
            labelPosition: 'top',
            labelWidth: 34,
            click: function() {
              scope.deleteElementFilterForm('element-filter-'+id)
            }

          }
        ]
      },
        {
          height: 20
        }
      ]

    };
  },

  deleteElementFilterForm(id) {
    let formRowLayout = this.winFilter.queryView({'localId': 'form-row-layout'});
    let element = this.winFilter.queryView({'localId': id});
    formRowLayout.removeView(element);
  },

  getHeaderFilterSetting() {
    let scope = this;
    return [
      {
        view:'form',
        complexData:true,
        scroll: 'auto',
        elements:[
          {
            localId: 'form-row-layout',
            rows:[
            ]
          },

          {
            cols: [
              {},
              {},
              {
                view: 'button',
                label: '+',
                localId: 'add-filter-element',
                css: 'webix_primary',
                width: 40,
                click: function() {
                  let layout = this.getTopParentView().queryView({'localId':'form-row-layout'});
                  let count = layout.getChildViews().length;
                  layout.addView(scope.getElementFilterForm(count));


                }
              },

            ]
          },
          {},
          {
            cols: [
              {},
              {},
              {
                view: 'button',
                label: 'Сохранить',
                localId: 'save-setting',
                css: 'webix_primary',
                //width: 400,
                click: function() {
                  scope.doSaveFilterSettingClick(this.getTopParentView().queryView('form').getValues());
                  scope.winFilter.close();
                }
              },

            ]
          }
        ]
      },
    ]
  },

  doSaveFilterSettingClick(values) {
    let scope = this;
    if (this.selectTypeValue) {
      scope.schemaFilterUserList =  JSON.stringify(values);
      let url = this.state.apiRest.getUrl('put', this.state.urlTableUserListsPut,{},this.selectTypeValue);
      webix.ajax().put(url, {
        'filter_setting': JSON.stringify(values)
      }, {
        error: function (text, data, response) {
          scope.showMessageError(data.json());
        },
        success: function (text, data, response) {
          webix.message({
            text: 'Данные успешно сохранены!',
            type: "info",
            expire: 4000,
          });
        }
      });

    }


  },

//setting table and columns

  showSetting() {
    //if (!this.win) {
    let scope = this;
    this.state.model = this.model;
    this.state.dataList = '';
    this.state.listId = '';
    this.state.tableSetiingConfigColumn = [];
    this.state.tableSettingItems =  [];
    // this.state = {
    //   'model' : this.capitalizeFirstLetter(this.state.params.mode),
    //   'urlTableUsers': this.state.urlTableUsers,
    //   'urlTableUserLists' : this.state.urlTableUserLists,
    //   'urlTableSettingUsers' : this.state.urlTableSettingUsers,
    //   'dataList' : '',
    //   'urlTableUsersSave' : this.state.urlTableUsersSave,
    //   'urlTableSettingUsersSave' :  this.state.urlTableSettingUsersSave,
    //   'listId' : '',
    //   'tableSetiingConfigColumn' : [],
    //   'tableSettingItems' : []
    // };

    this.state['dataList'] = this.dataSelectType.data;
    this.state['listId'] = this.selectTypeValue;
    this.state.listId = this.selectTypeValue;
    let responseList = webix.ajax().sync().get(this.state.urlTableUserLists, {filter:{"model":this.state['model']}});
    this.state['dataList'] = JSON.parse(responseList.responseText);
    //this.state['listId'] = (this.state['dataList'].data[0]) ? this.state['dataList'].data[0]['id'] : 0;

    let response = webix.ajax().sync().get(scope.state.urlTableUsers, {filter:{"model":scope.state.model,"list_id":scope.state.listId}});
    let data = JSON.parse(response.responseText);
    this.state['tableConfigColumn'] =  data.config.columns;
    this.state['tableItems'] = (data.data)? data.data : data.items;

    this.state['tableSetiingConfigColumn'] =  this.schemaTableSettingColumns;
    this.state['tableSettingItems'] = this.schemaTableSettingItems;
    this.state['tableSetiingData'] = this.schemaTableSettingData;
    // let responseSetting = webix.ajax().sync().get(scope.state.urlTableSettingUsers, {filter:{"model":scope.state.model,"list_id":scope.state.listId}});
    // let dataSetting = JSON.parse(responseSetting.responseText);
    // this.state['tableSetiingData'] = dataSetting;
    // this.state['tableSetiingConfigColumn'] =  dataSetting.config.columns;
    // this.state['tableSettingItems'] = (dataSetting.data)? dataSetting.data : dataSetting.items;

    this.win = {};
    let body = {
      localId: 'body-setting-layout',
      css: 'webix_primary',
      type: 'space',
      //collapsed:true,
      //view:"accordion",
      //multi:true,
      cols:[
        {
          view:"menu",
          layout:"y",
          width:250,
          select:true,
          localId: 'menu-list',
          scroll: true,
          onContext:{},
          data: this.state['dataList'],
          ready:function(){
            this.select(scope.state.listId);
            //this.callEvent("onItemClick", [scope.state.listId]);
            scope.attachEventShowColumns();

          },
          on:{
            onItemClick:function (id) {

              let response = webix.ajax().sync().get(scope.state.urlTableUsers, {filter:{"model": scope.state.model, 'list_id': id}});
              let dataUser = JSON.parse(response.responseText);
              scope.state['tableConfigColumn'] = dataUser.config.columns;
              scope.state['tableItems'] = (dataUser.data)? dataUser.data : dataUser.items;
              scope.state['listId'] = id;
              let showColumnTab =this.getParentView().queryView({'localId':'showColumnsTab'});
              let settingColumnTab = this.getParentView().queryView({'localId':'settingColumnsTab'});
              let propertyTab = this.getParentView().queryView({'localId':'tablePropertyTab'});

              showColumnTab.define('rows',scope.getHeaderShowColumns());
              showColumnTab.reconstruct();
              scope.attachEventShowColumns();
              settingColumnTab.define('rows',scope.getHeaderSettingColumns());
              settingColumnTab.reconstruct();

              let responseSetting = webix.ajax().sync().get(scope.state.urlTableSettingUsers, {filter:{"model":scope.state.model,"list_id":id}});
              let dataSetting = JSON.parse(responseSetting.responseText);
              scope.state['tableSetiingData'] = dataSetting;
              scope.state['tableSetiingConfigColumn'] =  dataSetting.config.columns;
              scope.state['tableSettingItems'] = (dataSetting.data)? dataSetting.data : dataSetting.items;

              propertyTab.define('rows',scope.getHeaderTableProperty());
              propertyTab.reconstruct();
            }
          }
        },

        {view:"resizer"},
        {
          rows:[

            { view:"tabbar",
              value:"showColumnsTab",
              //inputWidth:550,
              options:[
                { id:"showColumnsTab", value:"Видимые колонки" },
                { id:"settingColumnsTab", value:"Свойства колонок"},
                { id:"tablePropertyTab", value:"Настройки таблицы"}
              ],
              on:{
                onItemClick:function(id,e){
                  this.getParentView().queryView({'localId':this.getValue()}).show();
                }
              }
            },
            {
              animate:false,
              width: 660,
              cells:[
                {
                  //header:'Показывать',
                  localId: 'showColumnsTab',
                  type:"space",
                  // padding:{
                  //   top:5, bottom:0, left:0, right:0
                  // },
                  rows: this.getHeaderShowColumns()
                },
                {
                  //header:'Настройки',
                  localId: 'settingColumnsTab',
                  type:"space",
                  rows: this.getHeaderSettingColumns()
                },
                {
                  localId: 'tablePropertyTab',
                  type:"space",
                  rows: this.getHeaderTableProperty()
                }
              ]
            },


          ]
        }

      ]
    }

    let winConfig = {
      view:"window",
      head:{
        cols:[
          { width:4 },
          { type:"header", template: "Настройки таблицы", borderless:true },
          { view:"icon", icon: 'mdi mdi-close',  align: 'right', click:function(){ this.getTopParentView().hide(); }}
        ]
      },

      width: 950,
      height: 500,
      position: 'center',
      modal:true,
      close:true,
      move: true,
      resize:false,
      body: body
    };

    this.win = webix.ui(winConfig);
    this.contentMenu = this.$scope.ui(this.getContentMenu(),scope);
    this.contentMenu.attachTo(this.win.queryView({'localId':'menu-list'}));

    //}

    this.win.show();
  },

  getHeaderShowColumns() {
    let scope = this;

    let showColumns =  [
      {
        view: "text",
        //width: '63',
        localId: 'search-show-columns',
        placeholder: 'поиск'
      },
      {
        cols:[

          {
            view:"dataview",
            localId: 'dataview-show-columns',
            borderless:false,
            select:true,
            xCount:2,
            scroll: true,
            type: {
              //width:315,
              width: 'auto',
              markCheckbox:function(obj,common){
                return "<span class='metadata_config_check webix_icon wxi-checkbox-"+(!obj.hidden?"marked":"blank")+" +square-o'></span>";
              },
            },

            onClick: {
              "metadata_config_check": function (e, id) {
                var item = this.getItem(id);
                item.hidden = item.hidden ? 0 : 1;
                this.updateItem(id, item);
                if (item.hidden == 1) {
                  scope.table.hideColumn(item.column_id);
                } else {
                  let index = scope.table.getColumnIndex(item.column_id);

                  if (index!=-1) {
                    scope.table.showColumn(item.column_id);
                  } else {
                    //debugger;
                    scope.table.config.columns.splice(item.id, 0, {'id':item.column_id, 'header':item.header, 'adjust':'header', 'hidden':0});
                    //scope.table.columns.splice(0, 0, { id:"year", header:"Release" });
                    scope.table.refreshColumns();
                  }
                }

              }
            },
            on:{
              onBeforeSelect: function(id){
                return !this.getItem(id).hidden; }
            },
            scheme:{
              $init:function(obj){
                if (obj.hidden)
                  obj.$css = "metadata_list_item_disabled";
              }
            },
            template:"{common.markCheckbox()}<div style='margin-top:5px;'>#header# (#column_id#)</div>",
            data: scope.state.tableItems,
            datatype:"json",
            save: scope.state.urlTableUsersSave
          }

        ]
      },
      {
        //view: 'toolbar',
        // margin:{
        //   top:10, bottom:10, left:10, right:10
        // },
        type: 'space',
        borderless:true,
        cols: [

          {
            view: 'button',
            label: 'Копировать в базовые настройки',
            localId: 'save-setting',
            css: 'webix_primary',
            //width: 400,
            click: () => this.doSaveBaseSettingClick()
          },
          {},
          // {
          //   width: 10
          // },
        ]
      }
    ];
    return showColumns;


  },

  attachEventShowColumns() {
    let searchField = this.win.queryView({'localId':'search-show-columns'});
    let dataViewShowColumns = this.win.queryView({'localId':'dataview-show-columns'});
    searchField.attachEvent('onChange', function(newValue, oldValue, config) {

      dataViewShowColumns.filter(function(obj){
        return obj.column_id.toString().indexOf(newValue) != -1;
      });

      if (dataViewShowColumns.count() == 0) {
        dataViewShowColumns.filter(function (obj) {
          return obj.header.toString().indexOf(newValue) != -1;
        });
      }
    })
  },

  getHeaderSettingColumns() {
    let optionsHeaderFilterType = [];
    let optionsHeaderTotalType = [];
    let optionsFormat = [];
    let optionsSortType = [];
    let optionsEditorType = [];
    let optionsFormEdit = [];
    let filterData = [];





    this.state.tableItems.forEach(function(item) {
      if (item.hidden == 0) {
        filterData.push(item);
      }

    });
    this.state.tableConfigColumn.forEach(function(item) {
      if (item.id == 'header_filter_type') {
        optionsHeaderFilterType = item.options;
      }
      if (item.id == 'header_total_type') {
        optionsHeaderTotalType = item.options;
      }
      if (item.id == 'format') {
        optionsFormat = item.options;
      }
      if (item.id == 'sort_type') {
        optionsSortType = item.options;
      }
      if (item.id == 'editor') {
        optionsEditorType = item.options;
      }
      if (item.id == 'form_edit') {
        optionsFormEdit = item.options;
      }

    });
    return [{
      view:"datatable",
      css: "webix_header_border webix_data_border",
      select:'row',
      editable:true,
      editaction: "click",
      tooltip: true,
      leftSplit: 2,
      borderless:false,
      columns: [
        {'id':'index', 'header': '#', 'hidden': false, 'width':40, 'css':{'background-color': '#F4F5F9'}},
        //{'id':'id', 'header': 'ID', 'hidden': true},
        //{'id':'column_id', 'header': 'Колонка', 'hidden':true},
        {'id':'header', 'header': 'Колонка', 'adjust':'all', editor:'text', 'css':{'background-color': '#F4F5F9'},tooltip:'#column_id#'},
        {'id':'sort_order', 'header':'Порядок', editor:'text',  'adjust':'all'},
        {'id':'header_filter_type', 'header':'Тип фильтра', editor:'select', 'options':optionsHeaderFilterType, 'adjust':'all'},
        {'id':'header_total_type', 'header':'Тип итого', editor:'select', 'options':optionsHeaderTotalType, 'adjust':'all'},
        {'id':'editor', 'header':'Редактор', editor:'select', 'options':optionsEditorType, 'adjust':'all'},
        {'id':'format', 'header':'Формат колонки', editor:'select', 'options':optionsFormat, 'adjust':'header'},
        {'id':'css', 'header':'Стиль', editor:'popup', 'adjust':'header'},
        {'id':'css_format', 'header':'Css Формат', editor:'popup', 'adjust':'header'},
        {'id':'sort_type', 'header':'Тип сорт.', editor:'select', 'options':optionsSortType, 'adjust':'all'},
        {'id':'width', 'header':'Ширина', editor:'text', 'adjust':'all'},
        {'id':'adjust', 'header':'Рег.ширины', editor:'text', 'adjust':'all'},
        {'id':'template', 'header':'Шаблон', editor:'popup', 'adjust':'header'},
        {'id':'options', 'header':'Список', editor:'popup', 'adjust':'header'},
        {'id':'options_url', 'header':'Url справочника', editor:'popup','adjust':'all'},
        {'id':'use_filter', 'header':'Исп. в фильтре', editor:'text', 'adjust':'all'},
        {'id':'math', 'header':'Math', editor:'popup', 'adjust':'all'},
        {'id':'form_edit', 'header':'Форма редакт.', editor:'select', 'options':optionsFormEdit,'adjust':'all'},
        {'id':'goto', 'header':'url', editor:'popup','adjust':'all'},
        {'id':'', 'header':'', 'fillspace':true},

      ],
      data: filterData,
      datatype:"json",
      save: this.state.urlTableUsersSave,
      scheme:{
        $init:function(item) {

          item.index = (this.count()-1)+1;
        }
      },
    }];
  },

  getHeaderTableProperty() {

    this.state['tableSetiingData'].config.columns = this.dataDriverJsonToObject(this.state['tableSetiingData'].config.columns);
    return [{
      view:"treetable",
      css: "webix_header_border webix_data_border",
      select:'cell',
      editable:true,
      editaction: "click",
      tooltip: true,
      //url: this.state.urlTableSettingUsers,
      //columns: this.state['tableSetiingConfigColumn'],
      data: this.state['tableSetiingData'],
      save: this.state.urlTableSettingUsersSave,
      scheme:{
        $init:function(item) {
          item.index = (this.count()-1)+1;
        },
        $group:{
          by:"type_property", // 'company' is the name of a data property
          map:{
            property_value:["type_property"],
            property_title:["property_title"],
            value: ["","string"]
            //type_property:["property_title","string"]
          }
        }
      },
      ready:function(){
        this.openAll();
      }
    }]
  },

  doSaveBaseSettingClick() {
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-user-list/save-to-base-setting");
    let response = webix.ajax().sync().get(url, {'listId': this.state.listId, 'model':this.state.model});
    let dataJson = JSON.parse(response.responseText);
    this.showMessageError(dataJson);
  },

  //content menu for setting table menu
  getContentMenu() {
    let scope = this;
    return {
      view:"contextmenu",
      //id:"cmenu",
      editable:true,
      editor:"text",
      data:[
        {id:"add",value:"Копировать"},
        {id:"rename",value:"Переименовать"},
        {id:"is_default",value:"По умолчанию"},
        {id:"copy_user",value:"Для пользователя"},
        { $template:"Separator" },
        {id:"delete",value:"Удалить"},
      ],
      on:{
        onItemClick:function(id){
          var context = this.getContext();
          var list = context.obj;
          var listId = context.id;

          if (id == 'delete') {
            scope.doDeleteMenuClick(context.id, context.obj);
          }
          if (id == 'add') {
            scope.doSaveSettingClick();
          }
          if (id == 'rename') {
            scope.doRenameClick(context.id, context);
          }
          if (id == 'is_default') {
            scope.doDefaultMenuClick(context.id, context);
          }
          if (id == 'copy_user') {
            scope.doCopyUsertMenuClick(context.id, context);
          }

          //webix.message("List item: <i>"+list.getItem(listId).title+"</i> <br/>Context menu item: <i>"+this.getItem(id).value+"</i>");
        }
      }
    };
  },

  doSaveSettingClick() {
    let url = this.state.apiRest.getUrl('get',"accounting/schema-table-user/save-setting");
    let response = webix.ajax().sync().get(url, {'listId': this.state.listId, 'model':this.state.model});
    let dataJson = JSON.parse(response.responseText);
    let menu = this.win.queryView({'localId': 'menu-list'});
    menu.add(dataJson.data);
    menu.select(dataJson.data.id);
    menu.callEvent("onItemClick", [dataJson.data.id]);

  },

  doDeleteMenuClick(id, menu) {
    let url = this.state.apiRest.getUrl('delete',"accounting/schema-table-user-lists",{},id);
    let response = webix.ajax().sync().del(url);
    if (response.status == 204) {
      menu.remove(id);
      menu.select(menu.getFirstId());
      this.state['listId'] = menu.getFirstId();
    } else {
      webix.message("Ошибка! Данные не удалены!");
    }

  },

  doDefaultMenuClick(id, context) {
    let url = this.state.apiRest.getUrl('get',"accounting/schema-table-user-list/set-default",{'id':id});
    let response = webix.ajax().sync().get(url);
    let dataJson = JSON.parse(response.responseText);
    if (dataJson.success == true) {
      //debugger;

      context.obj.data.each(function(item) {
        if (item.id == context.id) {
          item.icon = 'mdi mdi-flip-to-front';
          item.is_default = 1;
          item.editor = 'text';
        } else {
          item.icon = 'mdi mdi-flip-to-back';
          item.is_default = 0;
        }
      });

      // let item = context.obj.getItem(context.id);
      // item.icon = 'mdi mdi-menu-right';
      // item.is_default = 1;
      context.obj.refresh();
    } else {
      webix.message("Ошибка! Данные не изменены!" + JSON.stringify(dataJson.errors));
    }
  },

  doRenameClick(id, context) {

    let url = this.state.apiRest.getUrl('put',"accounting/schema-table-user-lists",{},id);


    webix.prompt({
      //title: "Изменение названия",
      text: "Изменить название",
      ok: "Сохранить",
      cancel: "Отмена",
      input: {
        required:true,
        value: context.obj.getItem(id).value,
        placeholder:"Введите название",
      },
      width:350,
    }).then(function(result){
      let response = webix.ajax().sync().put(url,{'name':result});
      let dataJson = JSON.parse(response.responseText);
      if (response.status == 200) {
        let item = context.obj.getItem(context.id);
        item.name = result;
        item.value = result;
        context.obj.refresh();
      } else {
        webix.message("Ошибка! Данные не изменены!" + JSON.stringify(dataJson.errors));
      }
    }).fail(function(){
      // webix.alert({
      //   type: "alert-error",
      //   text: "Cancelled"
      // });
    });
  },

  doCopyUsertMenuClick(id, context) {
    let scope = this;
    let url = this.state.apiRest.getUrl('get',"accounting/users");

    webix.ui({
      view:"window",
      width:500,
      height:400,
      head:"Копировать настройи для пользователя",
      modal: true,
      position: 'center',
      close: true,
      body:{
        type: 'space',

        cols:[{
          type:'form',
          rows:[
            {
              view: 'combo-close',
              localId: 'combo-user',
              options:this.state.apiRest.getCollection("accounting/users", {"per-page": -1},'email'),
              label: 'Выберите пользователя',
              labelWidth: 180,
              required:true,
              //value: 0,
              placeholder:"Выберите пользователя",
            },
            {
              cols:[{
                view: 'button',
                label:'Сохранить',
                click: function() {

                  let selectUser = this.getTopParentView().queryView({'localId':'combo-user'}).getValue();
                  let url = scope.state.apiRest.getUrl('get',"accounting/schema-table-user/save-setting-for-user");
                  let response = webix.ajax().sync().get(url, {'listId': context.id, 'model':scope.state.model, 'userId':selectUser});
                  let dataJson = JSON.parse(response.responseText);
                  this.getTopParentView().hide();
                  scope.showMessageError(dataJson);


                }
              },{},{}

              ]
            }
          ]
        }]

      }
    }).show();


  },

  //setting sort
  showSortSetting() {
    let scope = this;
    let body = {
      localId: 'body-setting-sort-layout',
      css: 'webix_primary',
      type: 'space',
      cols:[
        {
          type: 'form',
          rows:[

            {

              rows: this.getHeaderSortSetting()
            },


          ]
        }
      ]
    }

    let winConfig = {
      view:"window",
      head:"Настройки сортировки",
      width: 700,
      height: 500,
      position: 'center',
      modal:true,
      close:true,
      move: true,
      resize:true,
      body: body
    };

    this.winSort = webix.ui(winConfig);
    this.setElementSortForm();
    this.winSort.show();
  },

  setElementSortForm() {

    if (this.schemaSortUserList && this.schemaSortUserList.length >2) {

      let values = JSON.parse(this.schemaSortUserList);

      let formRowLayout = this.winSort.queryView({'localId': 'form-row-layout'});
      for (let key in values) {
        formRowLayout.addView(this.getElementSortForm(key));
      }
      this.winSort.queryView('form').setValues(values);
    }
  },

  getElementSortForm(id) {
    let scope = this;
    return {
      localId: 'element-sort-'+id,
      rows:[{
        cols:[
          {
            view:'combo',
            name: id+'.field',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Выберите поле',
            value: 'date_shipment',
            options: this.table.config.columns
          },
          {
            view:'combo',
            name: id+'.direction',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Тип сортировки',
            value: 'ASC',
            options: [{'id':'ASC','value': 'по возрастанию'},{'id':'DESC','value': 'по убыванию'}]

          },
          {
            view:'icon',
            icon: 'mdi mdi-close',
            labelPosition: 'top',
            labelWidth: 34,
            click: function() {
              scope.deleteElementSortForm('element-sort-'+id)
            }

          }
        ]
      },
        {
          height: 20
        }
      ]

    };
  },

  deleteElementSortForm(id) {
    let formRowLayout = this.winSort.queryView({'localId': 'form-row-layout'});
    let element = this.winSort.queryView({'localId': id});
    formRowLayout.removeView(element);
  },

  getHeaderSortSetting() {
    let scope = this;
    return [
      {
        view:'form',
        complexData:true,
        scroll: 'auto',
        elements:[
          {
            localId: 'form-row-layout',
            rows:[
            ]
          },

          {
            cols: [
              {},
              {},
              {
                view: 'button',
                label: '+',
                localId: 'add-sort-element',
                css: 'webix_primary',
                width: 40,
                click: function() {
                  let layout = this.getTopParentView().queryView({'localId':'form-row-layout'});
                  let count = layout.getChildViews().length;
                  layout.addView(scope.getElementSortForm(count));


                }
              },

            ]
          },
          {},
          {
            cols: [
              {},
              {},
              {
                view: 'button',
                label: 'Сохранить',
                localId: 'save-setting',
                css: 'webix_primary',
                //width: 400,
                click: function() {
                  scope.doSaveSortSettingClick(this.getTopParentView().queryView('form').getValues());
                  scope.winSort.close();
                }
              },

            ]
          }
        ]
      },
    ]
  },

  doSaveSortSettingClick(values) {
    let scope = this;
    if (this.selectTypeValue) {
      scope.schemaSortUserList =  JSON.stringify(values);
      let url = this.state.apiRest.getUrl('put', this.state.urlTableUserListsPut,{},this.selectTypeValue);


      webix.ajax().put(url, {
        'sort_setting': JSON.stringify(values)
      }, {
        error: function (text, data, response) {
          scope.showMessageError(data.json());
        },
        success: function (text, data, response) {
          webix.message({
            text: 'Данные успешно сохранены!',
            type: "info",
            expire: 4000,
          });
        }
      });

    }


  },

  //setting color row
  setColorSettingForTable() {

    let colorSetting = JSON.parse(this.schemaColorUserList);

    let condition = [];
    let obj = { func: function() {} };
    let index = -1;
    for (let key in colorSetting) {
      let item = colorSetting[key];
      if (item['operator'].trim() !='') {
        condition[index].push(item);
      } else {
        index++;
        condition[index] = [];
        condition[index].push(item);
      }
    }
    let conditionFunction = 'function(item, view, prop) { item.index = (this.count())+1; ';

    condition.forEach((items) => {

      if (items.length > 1) {
        let operatorCondition = '(';
        let lastItem = {};
        items.forEach((itemOperator) => {
          let comparison = (itemOperator['comparison'] == '=') ? '==' : itemOperator['comparison'];
          let value = (itemOperator['value'].indexOf('{')!=-1) ? itemOperator['value'].replace('{','').replace('}','') : '\''+itemOperator['value']+'\'';
          let operator = '';
          if (itemOperator['operator'] == 'and') operator = '&&';
          if (itemOperator['operator'] == 'or') operator = '||';
          operatorCondition += operator+' item.'+itemOperator['field']+' '+comparison+' '+value+' ';
          lastItem = itemOperator;
        });
        operatorCondition += ')';
        let css = '{"background-color":"'+lastItem['color']+'"}';
        conditionFunction += 'if '+operatorCondition+' { item.$css = '+css+'; } ';
      }

      if (items.length == 1) {
        let item = items[0];
        let css = '{"background-color":"'+item['color']+'"}';
        let comparison = (item['comparison'] == '=') ? '==' : item['comparison'];
        let value = (item['value'].indexOf('{')!=-1) ? item['value'].replace('{','').replace('}','') : '\''+item['value']+'\'';
        conditionFunction += 'if (item.'+item['field']+' '+comparison+' '+value+') { item.$css = '+css+'; } ';
      }
    });

    conditionFunction += '}';
    console.log(conditionFunction);

    eval(" obj.func = " + conditionFunction);
    this.table.define('scheme', {
      $init: obj.func
    });
  },

  showColorSetting() {
    let scope = this;
    let body = {
      localId: 'body-setting-color-layout',
      css: 'webix_primary',
      type: 'space',
      cols:[
        {
          type: 'form',
          rows:[

            {

              rows: this.getHeaderColorSetting()
            },


          ]
        }
      ]
    }

    let winConfig = {
      view:"window",
      head:"Настройки цветов",
      width: 700,
      height: 500,
      position: 'center',
      modal:true,
      close:true,
      move: true,
      resize:true,
      body: body
    };

    this.winColor = webix.ui(winConfig);
    this.setElementColorForm();
    this.winColor.show();
  },

  setElementColorForm() {

    if (this.schemaColorUserList && this.schemaColorUserList.length >2) {

      let values = JSON.parse(this.schemaColorUserList);

      let formRowLayout = this.winColor.queryView({'localId': 'form-row-layout'});
      for (let key in values) {
        formRowLayout.addView(this.getElementColorForm(key));
      }
      this.winColor.queryView('form').setValues(values);
    }
  },

  getElementColorForm(id) {
    let scope = this;
    return {
      localId: 'element-color-'+id,
      rows:[{
        cols:[{
          view:'combo',
          name: id+'.operator',
          labelWidth: 150,
          labelPosition: 'top',
          label:'Оператор',
          value: '',
          disabled: (id == 0) ? true : false,
          options:[' ','and','or']
        },
          {
            view:'combo',
            name: id+'.field',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Выберите поле',
            value: '',
            options: this.table.config.columns
          },
          {
            view:'combo',
            name: id+'.comparison',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Тип сравнения',
            value: '==',
            options: ['==','>=','<=','!=']
          },
          {
            view:'text',
            name: id+'.value',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Значение',
            value: ''
          },
          {
            view:'colorpicker',
            name: id+'.color',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Цвет',
            value: ''
          },
          {
            view:'icon',
            icon: 'mdi mdi-close',
            labelPosition: 'top',
            labelWidth: 34,
            click: function() {
              scope.deleteElementColorForm('element-color-'+id)
            }

          }
        ]
      },
        {
          height: 20
        }
      ]

    };
  },

  deleteElementColorForm(id) {
    let formRowLayout = this.winColor.queryView({'localId': 'form-row-layout'});
    let element = this.winColor.queryView({'localId': id});
    formRowLayout.removeView(element);
  },

  getHeaderColorSetting() {
    let scope = this;
    return [
      {
        view:'form',
        complexData:true,
        scroll: 'auto',
        elements:[
          {
            localId: 'form-row-layout',
            rows:[
            ]
          },

          {
            cols: [
              {},
              {},
              {
                view: 'button',
                label: '+',
                localId: 'add-color-element',
                css: 'webix_primary',
                width: 40,
                click: function() {
                  let layout = this.getTopParentView().queryView({'localId':'form-row-layout'});
                  let count = layout.getChildViews().length;
                  layout.addView(scope.getElementColorForm(count));


                }
              },

            ]
          },
          {},
          {
            cols: [
              {},
              {},
              {
                view: 'button',
                label: 'Сохранить',
                localId: 'save-color-setting',
                css: 'webix_primary',
                //width: 400,
                click: function() {
                  scope.doSaveColorSettingClick(this.getTopParentView().queryView('form').getValues());
                  scope.winColor.close();
                }
              },

            ]
          }
        ]
      },
    ]
  },

  doSaveColorSettingClick(values) {
    let scope = this;
    if (this.selectTypeValue) {
      scope.schemaColorUserList =  JSON.stringify(values);
      let url = this.state.apiRest.getUrl('put', this.state.urlTableUserListsPut,{},this.selectTypeValue);


      webix.ajax().put(url, {
        'color_setting': JSON.stringify(values)
      }, {
        error: function (text, data, response) {
          scope.showMessageError(data.json());
        },
        success: function (text, data, response) {
          webix.message({
            text: 'Данные успешно сохранены!',
            type: "info",
            expire: 4000,
          });
        }
      });

    }


  },

  showColumnSetting() {
    let scope = this;
    let body = {
      localId: 'body-setting-color-column-layout',
      //css: 'webix_primary',
      type: 'space',
      cols:[
        {
          //type: 'form',
          rows:[
            {
              rows: this.getHeaderColumnSetting()
            },
            {
              padding: 10,
              cols: [
                {},
                {},
                {
                  view: 'button',
                  label: 'Сохранить',
                  localId: 'save-column-setting',
                  css: 'webix_primary',
                  //width: 400,
                  click: function() {
                    scope.doSaveColumnSettingClick(this.getTopParentView().queryView('form').getValues());
                    scope.winColumn.close();
                  }
                },

              ]
            }
          ]
        },

      ]
    }

    let winConfig = {
      view:"window",
      head:"Настройки  столбцов",
      width: 800,
      height: 600,
      position: 'center',
      modal:true,
      close:true,
      move: true,
      resize:true,
      body: body
    };

    this.winColumn = webix.ui(winConfig);
    this.setCategoryColumnForm();
    this.winColumn.show();
  },

  setCategoryColumnForm() {

    if (this.schemaColumnUserList && this.schemaColumnUserList.length >2) {

      let values = JSON.parse(this.schemaColumnUserList);

      let formRowLayout = this.winColumn.queryView({'localId': 'form-row-layout'});
      for (let key in values) {
        formRowLayout.addView(this.getCategoryColumnForm(key));
        for (let keyCategory in values[key]['category']) {
          let view = formRowLayout.queryView({'localId':'form-subrow-layout'+key});
          view.addView(this.getElementColumnForm(key, keyCategory));
        }
      }
      this.winColumn.queryView('form').setValues(values);
    }
  },

  getCategoryColumnForm(id) {
    let scope = this;
    return {
      localId: 'category-column-'+id,
      //padding: {'right' : 20},
      rows: [
        {
          type:'form',
          rows:[{
            cols:[
              {
                view:'text',
                name: id+'.value',
                labelWidth: 150,
                labelPosition: 'top',
                label:'Название расцветки',
                value: ''
              },
              {
                view:'icon',
                icon: 'mdi mdi-close',
                labelPosition: 'top',
                labelWidth: 34,
                click: function() {
                  scope.deleteCategoryColumnForm('category-column-'+id, id);

                }
              }
            ]
          },
            {
              localId: 'form-subrow-layout'+id,
              rows: []
            },
            {
              cols: [
                {
                  view: 'button',
                  label: '+',
                  localId: 'add-column-category',
                  css: 'webix_primary',
                  width: 40,
                  click: function() {
                    let layout = this.getTopParentView().queryView({'localId':'form-subrow-layout'+id});
                    let count = "0";
                    if (layout.getChildViews().length > 0) {
                      count = scope.getLasElementId(this,id);
                    }
                    layout.addView(scope.getElementColumnForm(id, count));


                  }
                },
                {},
                {},

              ]
            },
          ]
        },
        {
          height:10
        }
      ]

    }

  },

  getLasElementId(view,id) {
    let values = view.getTopParentView().queryView('form').getValues();
    let category = values[id];
    let result = Object.keys(category.category)[Object.keys(category.category).length-1]*1+1;
    return result.toString();
  },

  getLasCategoryId(view) {
    let values = view.getTopParentView().queryView('form').getValues();
    let result = Object.keys(values)[Object.keys(values).length-1]*1+1;
    return result.toString();
  },

  getElementColumnForm(idCategory, id)  {
    let scope = this;
    return {
      localId: 'element-column-'+idCategory+'-'+id,
      rows:[{
        cols:[
          {
            view:'combo',
            name: idCategory+'.category.'+id+'.field',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Выберите колонку',
            value: '',
            options: this.table.config.columns
          },
          {
            view:'combo',
            name: idCategory+'.category.'+id+'.font-weight',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Стиль текста',
            value: 'normal',
            options: [{'id':'normal','value':'нормальный'},{'id':'500','value':'полужирный'},{'id':'700','value':'жирный'}]
          },
          {
            view:'combo',
            name: idCategory+'.category.'+id+'.text-align',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Выравнять текст',
            value: 'left',
            options: [{'id':'left','value':'по левому краю'},{'id':'center','value':'по середине'}, {'id':'right','value':'по правому краю'}]
          },
          {
            view:'colorpicker',
            name: idCategory+'.category.'+id+'.color',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Цвет текста',
            value: ''
          },
          {
            view:'colorpicker',
            name: idCategory+'.category.'+id+'.background-color',
            labelWidth: 150,
            labelPosition: 'top',
            label:'Цвет фона',
            value: ''
          },
          {
            view:'icon',
            icon: 'mdi mdi-close',
            css:'small',
            labelPosition: 'top',
            //labelWidth: 34,
            click: function() {
              scope.deleteElementColumnForm('element-column-'+idCategory+'-'+id, idCategory, id)
            }

          }
        ]
      },
        {
          height: 20
        }
      ]

    };
  },

  deleteCategoryColumnForm(idLayout, id) {
    let formRowLayout = this.winColumn.queryView({'localId': 'form-row-layout'});
    let element = this.winColumn.queryView({'localId': idLayout});
    if (id == this.selectColumnSettingId) {
      this.selectColumnSettingId = null;
    }
    // update css
    let columnSetting = JSON.parse(this.schemaColumnUserList);
    let elementDeleteCategory = (columnSetting[id]) ? columnSetting[id].category : {};
    for (let key in elementDeleteCategory) {
      this.table.getColumnConfig(elementDeleteCategory[key].field).cssFormat = '';

    }
    this.table.refreshColumns();

    formRowLayout.removeView(element);
  },

  deleteElementColumnForm(idLayout, idCategory, id) {
    let formRowLayout = this.winColumn.queryView({'localId': 'form-subrow-layout'+idCategory});
    let element = this.winColumn.queryView({'localId': idLayout});

    // update css
    let columnSetting = JSON.parse(this.schemaColumnUserList);
    if (columnSetting[idCategory]) {
      let elementDelete = columnSetting[idCategory]['category'][id];
      this.table.getColumnConfig(elementDelete.field).cssFormat = '';
      this.table.refreshColumns();
    }

    formRowLayout.removeView(element);
  },

  getHeaderColumnSetting() {
    let scope = this;
    return [
      {
        view:'form',
        borderless: true,
        complexData:true,
        localId: 'form-column',
        scroll: 'y',
        elements:[
          {
            localId: 'form-row-layout',
            rows:[
            ]
          },

          {
            cols: [
              {},
              {},
              {
                view: 'button',
                label: '+',
                localId: 'add-column-element',
                css: 'webix_primary',
                width: 40,
                click: function() {
                  let layout = this.getTopParentView().queryView({'localId':'form-row-layout'});
                  let count = "0";
                  if (layout.getChildViews().length > 0) {
                    count = scope.getLasCategoryId(this);
                  }
                  layout.addView(scope.getCategoryColumnForm(count));
                }
              },

            ]
          },
          {},

        ]
      },
    ]
  },

  doSaveColumnSettingClick(values) {
    let scope = this;
    if (this.selectTypeValue) {

      scope.schemaColumnUserList =  JSON.stringify(values);
      let url = this.state.apiRest.getUrl('put', "accounting/schema-table-user-lists",{},this.selectTypeValue);


      webix.ajax().put(url, {
        'column_setting': JSON.stringify(values)
      }, {
        error: function (text, data, response) {
          scope.showMessageError(data.json());
        },
        success: function (text, data, response) {
          webix.message({
            text: 'Данные успешно сохранены!',
            type: "info",
            expire: 4000,
          });
          scope.setColumnSettingForTable();

        }
      });

    }


  },


  doRefresh() {
    this.getDataTable();
  },

  doAddClick() {
    this.table.unselect();
    this.table.listId = this.state.params.id;
    this.state.formEdit.showForm(this.table);
  },

  doClickOpenAll() {
    let table = this.table;
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  },

  //setting export to excel
  showExportToExcelSetting() {

    let scope = this;
    let body = {
      localId: 'body-setting-print-layout',
      css: 'webix_primary',
      type: 'space',
      cols:[ {
        view:"menu",
        layout:"y",
        width:250,
        select:true,
        localId: 'menu-list-print',
        onContext:{},
        //data: this.app.config.apiRest.getCollection("accounting/schema-print-user-lists",{},'name'),
        url: this.state.apiRest.getUrl("get","accounting/schema-print-user-lists",{'per-page':-1,'filter':'{"list_id":"'+this.selectTypeValue+'"}'}),

        hidden: true,
        on:{
          onAfterLoad: function() {
            let scope = this;
            if (scope.data.count()>0) {
              scope.show();
            }
            scope.select(scope.data.getFirstId());
            scope.callEvent('onItemClick', [scope.data.getFirstId()]);
          },
          onItemClick:function (id) {
            let dataView = this.getTopParentView().queryView({'localId':'print-column-select'});
            let data = JSON.parse(this.getItem(id).setting);
            data.forEach(function(item) {
              dataView.data.each(function(itemView) {
                if (itemView.id == item.id) {
                  itemView.hidden = item.hidden;
                }
              })
            });
            dataView.refresh();
          }
        }
      },
        {
          type: 'form',
          rows:[

            {
              header:'Показывать',
              rows: this.getHeaderPrintColumns()
            },


          ]
        }

      ]
    }

    let winConfig = {
      view:"window",
      head:"Настройки экспорта в Excel",
      width: 950,
      height: 500,
      position: 'center',
      modal:true,
      close:true,
      move: true,
      resize:true,
      body: body
    };

    this.winPrint = webix.ui(winConfig);
    this.contentMenuPrint = this.$scope.ui(this.getContentMenuPrint(),scope);
    this.contentMenuPrint.attachTo(this.winPrint.queryView({'localId':'menu-list-print'}));
    this.winPrint.show();
  },

  getHeaderPrintColumns() {
    let scope = this;

    return [
      {
        view:"dataview",
        localId: 'print-column-select',
        select:true,
        type: {
          width:250,
          markCheckbox:function(obj,common){
            return "<span class='metadata_config_check webix_icon wxi-checkbox-"+(!obj.hidden?"marked":"blank")+" +square-o'></span>";
          },
        },

        onClick: {
          "metadata_config_check": function (e, id) {
            var item = this.getItem(id);
            item.hidden = item.hidden ? 0 : 1;
            this.updateItem(id, item);


          }
        },
        on:{
          onBeforeSelect: function(id){
            return !this.getItem(id).hidden; }
        },
        scheme:{
          $init:function(obj){
            if (obj.hidden)
              obj.$css = "metadata_list_item_disabled";
          }
        },
        //template:"{common.markCheckbox()}<div style='margin-top:5px;'>#header[0]#</div>",
        template: function(obj, common) {

          return common.markCheckbox(obj,common)+"<div style='margin-top:5px;'>"+obj.header[0].text+"</div>";
        },
        data: scope.table.config.columns,
        datatype:"json",

      },
      {
        cols: [
          {},
          {},
          {
            view: 'button',
            label: 'Сохранить настройки',
            localId: 'save-setting',
            css: 'webix_primary',
            //width: 400,
            click: function() {
              let columns = this.getTopParentView().queryView({'localId':'print-column-select'}).data.serialize();
              scope.doSavePrintSettingClick(columns)
            }
          },

          {
            view: 'button',
            label: 'Печать',
            localId: 'print-button',
            css: 'webix_primary',
            //width: 400,
            click: function() {
              let columns = this.getTopParentView().queryView({'localId':'print-column-select'}).data.serialize();
              scope.doClickToExcel(columns);
              this.getTopParentView().close();

            }
          },
          // {
          //   width: 10
          // },
        ]
      }
    ];

  },

  doSavePrintSettingClick(columnsCheck) {
    let scope = this;
    let url = this.state.apiRest.getUrl('get',"accounting/schema-print-user-lists");
    let columns = [];
    columnsCheck.forEach(function(item) {
      columns.push({'id': item.id, 'hidden' : (item.hidden) ? item.hidden : 0});
    });

    webix.ajax().post(url, {'model': this.model, 'setting':JSON.stringify(columns), 'name':'Печать','list_id':this.selectTypeValue},{
      error:function(text, data, response){
        scope.showMessageError(data.json());
      },
      success:function(text, data, response){
        webix.message({
          text: 'Данные успешно сохранены!',
          type: "info",
          expire: 4000,
        });
      }
    });


  },

  doClickToExcel(columnsCheck) {
    let table = this.table;

    let name = '';
    this.filter.filter.or.forEach(function(item) {
      for (let key in item) {
        name = name + '_'+key;
        if (typeof item[key] == 'object') {
          for (let keyItem in item[key]) {
            name = name + '_'+item[key][keyItem];
          }
        } else {
          name = name +'_'+item[key];
        }
      }
    });
    let columns = [];
    columnsCheck.forEach(function(item){
      if (!item.hidden) {
        columns.push(item)
      }

    });

    webix.toExcel(table, {
      filename: this.state.params.mode+name,
      styles: false,
      ignore: { "action-edit" : true},
      columns:columns
      // filter:function(obj){
      //   return obj.transaction_sum != 0;
      // }
    });

  },

  getContentMenuPrint() {
    let scope = this;
    return {
      view:"contextmenu",
      localId:"cmenu-print",
      editable:true,
      editor:"text",
      data:[

        { id:"rename",value:"Переименовать"},
        { id:"is_default",value:"По умолчанию"},
        { $template:"Separator" },
        { id:"delete",value:"Удалить"},
      ],
      on:{
        onItemClick:function(id){
          var context = this.getContext();
          var list = context.obj;
          var listId = context.id;

          if (id == 'delete') {
            scope.doDeleteMenuPrintClick(context.id, context.obj);
          }
          if (id == 'rename') {
            scope.doRenamePrintClick(context.id, context);
          }
          if (id == 'is_default') {
            scope.doDefaultMenuPrintClick(context.id, context);
          }

          //webix.message("List item: <i>"+list.getItem(listId).title+"</i> <br/>Context menu item: <i>"+this.getItem(id).value+"</i>");
        }
      }
    };
  },

  doDeleteMenuPrintClick(id, menu) {
    let url = this.app.config.apiRest.getUrl('delete',"accounting/schema-print-user-lists",{},id);
    let response = webix.ajax().sync().del(url);
    if (response.status == 204) {
      menu.remove(id);
      menu.select(menu.getFirstId());
      menu.callEvent('onItemClick', [menu.getFirstId()]);
    } else {
      webix.message("Ошибка! Данные не удалены!");
    }
  },

  doRenamePrintClick(id, context) {
    let url = this.app.config.apiRest.getUrl('put',"accounting/schema-print-user-lists",{},id);


    webix.prompt({
      //title: "Изменение названия",
      text: "Изменить название",
      ok: "Сохранить",
      cancel: "Отмена",
      input: {
        required:true,
        value: context.obj.getItem(id).value,
        placeholder:"Введите название",
      },
      width:350,
    }).then(function(result){
      let response = webix.ajax().sync().put(url,{'name':result});
      let dataJson = JSON.parse(response.responseText);
      if (response.status == 200) {
        let item = context.obj.getItem(context.id);
        item.name = result;
        item.value = result;
        context.obj.refresh();
      } else {
        webix.message("Ошибка! Данные не изменены!" + JSON.stringify(dataJson.errors));
      }
    }).fail(function(){
      // webix.alert({
      //   type: "alert-error",
      //   text: "Cancelled"
      // });
    });
  },

  doDefaultMenuPrintClick(id, context) {
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-print-user-list/set-default",{'id':id});
    let response = webix.ajax().sync().get(url);
    let dataJson = JSON.parse(response.responseText);
    if (dataJson.success == true) {
      //debugger;

      context.obj.data.each(function(item) {
        if (item.id == context.id) {
          item.icon = 'mdi mdi-flip-to-front';
          item.is_default = 1;
          item.editor = 'text';
        } else {
          item.icon = 'mdi mdi-flip-to-back';
          item.is_default = 0;
        }
      });

      // let item = context.obj.getItem(context.id);
      // item.icon = 'mdi mdi-menu-right';
      // item.is_default = 1;
      context.obj.refresh();
    } else {
      webix.message("Ошибка! Данные не изменены!" + JSON.stringify(dataJson.errors));
    }
  },

  //other
  showMessageError(dataJson) {
    if (dataJson['errors']) {
      for (var prop in dataJson.errors) {
        webix.message({
          text:prop+':'+dataJson.errors[prop],
          type:"error",
          expire: -1,
        });

      }
    }
    if (dataJson['success']) {
      webix.message({
        text: 'Данные успешно сохранены!',
        type: "info",
        expire: 2000,
      });
    }
  },

  beforeDropChangeData(record, date, context) {

    let table = this.table;
    let field = this.schemaTableSetting.group['group-by'].value;

    let sel = table.getSelectedId(true);
    context.source.forEach(item => {
      table.getItem(item)[field] = formatDateTimeDb(parserDateTimeGroup(date));
      table.refresh(item);
      table.updateItem(item, table.getItem(item))
    });
    return true;

  },

  putSelectTypeState(value) {
    webix.storage.local.put(this.state.params.mode+'_'+this.state.cachePrefix+"_select_type_state", {
      selectType: value
    });
  }

}, webix.ui.layout);