import {JetView, plugins} from "webix-jet";
import UpdateFormView from "core/updateFormView";
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
    decimalSize:2
  });
};

webix.ui.datafilter.totalColumn = webix.extend({
  refresh: function (master, node, value) {
    var result = 0, _val;
    master.data.each(function (obj) {
      if (obj.$group) return;
      _val = /*implement your logic*/ parseFloat(obj[value.columnId]);// / obj.OTHER_COL;
      if (!isNaN(_val)) result = result+_val;
    });
    result = webix.i18n.numberFormat(result,{
      groupDelimiter:",",
      groupSize:3,
      decimalDelimiter:".",
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

webix.editors.$popup.text = {
  view:"popup",
  body:{
    view:"textarea",
    width:250,
    height:100
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

let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
var parserDate = webix.Date.strToDate("%Y-%m-%d");
var parserDateTime = webix.Date.strToDate("%Y-%m-%d %H:%i");



function custom_checkbox(obj, common, value){
  if (value)
    return "<div class='webix_table_checkbox checked'> YES </div>";
  else
    return "<div class='webix_table_checkbox notchecked'> NO </div>";
};

function columnGroupTemplate(obj, common, item){

  if (obj.$group) return common.treetable(obj, common) + obj.property_value;

  return item;
}


export default class AdminView extends JetView{
  config(){
    let hash = document.location.hash.split('/');
    let hashMode = hash[hash.length-1];
    let state = webix.storage.local.get(hashMode+"_filter_state");

    let scope = this;

    return {
      localId:'layout',
      rows:[
        {
          //type:"space",

          padding: 10,
          cols:[
            {
              type:"header",
              localId: 'table-title',
              template:"Таблица",
              width: 300,
              borderless:true
            },
            {
              localId: "show-filter-date-range",
              hidden: true,
              cols:[
                {
                  localId: "filter-date-range-field",
                  cols:[{
                    localId: 'filter-date-range-field-label',
                    label: '',
                    view: 'label',
                    width: 20
                  },
                    {
                      view:"datepicker",
                      localId: 'dateFrom',
                      inputWidth:120,
                      //label: 'Дата отгрузки',
                      //labelWidth:100,
                      width:130,
                      value: (state) ? state.dateFrom : webix.Date.monthStart(new Date())
                    },
                    {
                      label: 'по',
                      view: 'label',
                      width: 27
                    },
                    {
                      view:"datepicker",
                      localId: 'dateTo',
                      inputWidth:120,
                      //label: 'по',
                      //labelWidth:30,
                      width:120,
                      value: (state) ? state.dateTo :webix.Date.monthEnd(new Date())
                    }
                  ]
                },
                {
                  view:"icon",
                  icon:"mdi mdi-filter",
                  localId: "show-icon-setting",
                  width: 30,
                  css:'small',
                  click: function() {
                    scope.showFilterSetting();
                  }
                },
                {
                  view:"icon",
                  icon:"mdi mdi-sort",
                  localId: "show-icon-sort-setting",
                  width: 30,
                  css:'small',
                  click: function() {
                    scope.showSortSetting();
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
                      label: 'Отбор по',
                      view: 'label',
                      width: 60,
                      localId: 'filter-field-label'
                    },

                    {
                      view:"select",
                      labelWidth:100,
                      value: (state) ? state.dateFrom : '',
                      options:[],
                      hidden: false,
                      localId: 'filter-field'
                    },
                    {
                      //width: 200,
                      localId: 'filter-layout',
                      cols:[

                      ]
                    }

                  ]
                },
              ]
            },

            {},
            {
              view:"richselect",
              value:4,
              labelWidth:100,
              options: [],
              width: 200,
              hidden: false,
              localId: "select-type"
            },
            {
              view:"icon",
              icon:"mdi mdi-tools",
              localId: "show-icon-setting",
              width: 30,
              click: function() {
                scope.showSetting();
              }
            },


            //{ $subview:true }

          ]
        },
        {
          view:'toolbar',
          localId:'show-toolbar',
          height: 30,
          cols:[
            {
              view:"icon",
              icon:"mdi mdi-plus",
              localId: 'show-add-button',
              tooltip: 'Добавить',
              width: 30,
              click: () => this.doAddClick()
            },


            //{ view:"icon", icon: 'mdi mdi-printer', autowidth:true, click: () =>  this.doClickPrint()},
            { view:"icon", icon: 'mdi mdi-microsoft-excel', autowidth:true, click: () =>  this.showExportToExcelSetting()},
            {
              view:"toggle",
              type:"icon",
              icon: 'mdi mdi-file-tree',
              autowidth:true,
              value :true,
              hidden: false,
              click: function() { scope.doClickOpenAll() }

            },
            {
              view:"icon",
              //type:"icon",
              icon: 'mdi mdi-refresh',
              autowidth:true,
              value :true,
              click: function() { scope.doRefresh() }

            },
            {},
            {
              view:"icon",
              //type:"icon",
              icon: 'mdi mdi-undo',
              autowidth:true,
              value :true,
              click: function() { scope.doUndo() }

            },
          ]
        },
        {
          localId: 'body-layout',
          cols:[]
        }
      ],
    };
  }



  init(view) {
    this.use(plugins.UrlParam, ["mode"]);


    let mode = this.getParam('mode');
    this.mode = mode;
    this.model = this.capitalizeFirstLetter(this.mode);
    this.state = {};
    this.stateFilter =  webix.storage.local.get(this.mode+"_filter_state");
    this.state['urlTableUserLists'] = this.app.config.apiRest.getUrl('get',"accounting/schema-table-user-lists",
      {
        'per-page':-1,
        'sort':'sort_order'
      });

    let iconSetting = this.$$('icon-setting');
    let scope = this;


    this.setSelectType();
    this.schemaTableSetting = this.getSchemaTableSetting();
    this.setTableSetting();
    this.setFilterSetting();
    //this.filter = this.getFilterParams();



    this.getTable();
    this.getDataTable();
    this.attachToolBarEvents();

    this.formEdit = this.ui(UpdateFormView);

  }

  //general
  getTable() {
    let layout = this.$$("body-layout");
    let scope = this;
    let tableConfig = {
      view: "treetable",
      urlEdit: this.mode,
      css: "webix_header_border webix_data_border",
      leftSplit: (this.schemaTableSetting.datatable['leftSplit'].value) ? this.schemaTableSetting.datatable['leftSplit'].value : 0,
      rightSplit: (this.schemaTableSetting.datatable['rightSplit'].value) ? this.schemaTableSetting.datatable['rightSplit'].value : 0,
      select:"multiselect",
      resizeColumn: {headerOnly: true},
      localId: 'order-table',
      multiselect: true,
      scroll: true,
      clipboard: "selection",
      //blockselect: true,
      tooltip: true,
      editable:true,
      editaction: "dblclick",
      sort:"multi",
      drag:"order",
      dragColumn:true,
      save: "api->accounting/"+this.getModelName(this.mode),
      scheme:{
        $init:function(item) {
          item.index = (this.count())+1;
          if (item.B == 4)
            item.$css = "highlight";
          if (item.B == 3)
            item.$css = "highlight-blue";
          if (item.B == 2)
            item.$css = "highlight-green";
          if (item.B == 6)
            item.$css = "highlight-green";
          let dateComplite = parserDate(item.date_obivka);
          let dateToday = webix.Date.add(new Date(), -1, "day");

          if (webix.filters.date.greater(dateToday,dateComplite ) && item.B=='1') {
            item.$css = "highlight-red";
          }
        }
      },
      ready: function() {

      },
      on:{
        onAfterColumnDrop : function() {
          //webix.storage.local.put("start-table", this.getState());

        },
        onItemClick:function(id, e, trg) {

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

          }
          if (id.column == 'action-edit') {
            this.$scope.formEdit.showForm(this);
          }
        },
        onBeforeLoad:function(){

          //this.showOverlay("Loading...");
        },
        onAfterLoad:function(){
          //debugger;


          if (!this.count()) {
            //this.showOverlay("Нет данных");
          }
        },
        onSelectChange: function(id, e, trg){
          let table = this;
          let selected = table.getSelectedId(true);
          if (!this.rowSelect && selected.length > 0 && selected[0] && selected[0].column == 'index') {

            //var config = webix.copy(table);
            //if(val)


            //table.define('select','multiselect');
            //table.refresh();
            // let selected = table.getSelectedId(true).join().split(',');
            // let first = selected[0];
            // let last = selected[selected.length - 1];
            // this.rowSelect = true;
            // table.selectRange(first,'A',last,'T');
          } else {
            this.rowSelect = false;
            table.config.select = 'cell';
          }
        },
      }
    };

    let table = webix.ui(tableConfig);


    this.table = table;
    //webix.extend(this.table, webix.ProgressBar);
    layout.addView(table);

  }

  getDataTable() {
    let scope = this;
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

    scope.tableUrl = this.app.config.apiRest.getUrl('get',"accounting/"+this.getModelName(this.mode), params);

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
      scope.table.group({
        by: function (obj) {
          return eval(resultType);
        },
        map: {
          'property_value':[function (obj) {
            let per = eval(resultType);
            let configColumn = scope.table.getColumnConfig(scope.schemaTableSetting.group['group-by'].value);
            if (configColumn.collection) {
              return configColumn.collection.getItem(per).value;
            } else {
              return eval(resultType);
            }
          }],
          //'property_title':['A'],
          'index':['','string'],
          'I':['','string'],
          'G':['G','sum'],
          'L':['','string'],
          'N':['','string'],
          'O':['','string'],
          'P':['','string']
        },
      });
      scope.table.openAll();

    });
  }


  getSortParams() {
    let params = '';
    if (this.filterDateRangeField) {
      params = '[{"property":"'+this.filterDateRangeField+'","direction":"ASC"}]';
    }
    if (this.schemaSortUserList && this.schemaSortUserList[0]) {
      let sort = this.schemaSortUserList;
      params = [];
      for (let key in sort) {
        params.push({'property':sort[key].field, 'direction' : sort[key].direction});
      }
      params = JSON.stringify(params);
    }

    return params;
  }

  getFilterParams() {
    let scope = this;
    this.format = webix.Date.dateToStr("%Y-%m-%d");
    this.dateFrom = this.$$("dateFrom");
    this.dateTo = this.$$("dateTo");
    this.filterField = this.$$('filter-field');
    this.showFilterDateRange= this.$$('show-filter-date-range');
    this.filterInput = this.$$('filter-input');

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




    if (this.schemaFilterUserList && this.schemaFilterUserList[0]) {
      let setting = this.schemaFilterUserList;

      let filterSchema = {};
      let filterFirstLavel = {"or": []};
      let filter = setting;

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
      type[this.filterFieldValue] =  this.filterInputValue;
      filterParams["filter"]["or"] = [type];
    }
    //
    // if (type.length == 0 && date.length == 0) {
    //   filterParams["filter"]["or"] = [];
    // }




    //filterParams["filter"]["or"].push(type);

    console.log(filterParams);
    return filterParams;
  }

  setTableSetting() {
    let scope = this;
    let setting = this.schemaTableSetting;

    for (let key in setting.show) {
      if (scope.$$(key) !==null && setting.show[key].value ==='1') {
        scope.$$(key).show();
      }
    }

    for (let keyTemp in setting.template) {
      if (scope.$$(keyTemp) !==null ) {
        scope.$$(keyTemp).define({'template' : setting.template[keyTemp].value});
        scope.$$(keyTemp).refresh();
      }
    }

    for (var keyFilter in setting.filter) {
      if (scope.$$(keyFilter) !==null ) {
        if (keyFilter == 'filter-field') {
          scope.$$(keyFilter+'-label').define({'label': setting.filter[keyFilter].value});
          scope.$$(keyFilter+'-label').refresh();
        }
        if (keyFilter == 'filter-date-range-field') {

          // scope.$$(keyFilter+'-label').define({'label': setting.filter[keyFilter].property_title});
          // scope.$$(keyFilter+'-label').refresh();
          this.filterDateRangeField = setting.filter[keyFilter].value;
        }
      }
    }
  }

  setFilterSetting() {
    let scope = this;

    scope.$$('filter-field').data.options = [];
    scope.$$('filter-field').refresh();
    this.schemaTableUserFilter.forEach(function(item, key) {

        scope.$$('filter-field').data.options.push({'id': item.column_id, 'value': item.header});
        if (key==0 && !scope.$$('filter-input')) {
          scope.$$('filter-layout').addView({
            view:'search-close',
            name:'text',
            value: (scope.stateFilter) ? scope.stateFilter.filterInput: '',
            //width:200,
            localId: 'filter-input'
          })
        }

    });

    scope.$$('filter-field').refresh();
    if (scope.stateFilter) {
      scope.$$('filter-field').setValue(scope.stateFilter.filterField);
    }
  }

  getSchemaTableSetting() {

    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-setting-users", {'per-page' : -1,
      'sort':'[{"property":"type_property","direction":"ASC"},{"property":"property_title","direction":"ASC"}]'
    });
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
  }

  setSelectType() {
    let scope = this;
    this.selectType = this.$$("select-type");
    let response = webix.ajax().sync().get(this.state['urlTableUserLists'],{filter:{'model': this.model}, 'expand':'schemaTableUserFilter'});
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
          scope.schemaFilterUserList = JSON.parse(item.filter_setting);
          scope.schemaSortUserList = JSON.parse(item.sort_setting);

        }
      });
      if (idSelectType == '') webix.storage.local.remove(this.mode+"_select_type_state");
    }
    dataSelectType.data.forEach(function (item) {
      if (idSelectType =='' && item.is_default == 1) {
        idSelectType = item.id;
        scope.schemaTableUserFilter = item.schemaTableUserFilter;
        scope.schemaFilterUserList = JSON.parse(item.filter_setting);
        scope.schemaSortUserList = JSON.parse(item.sort_setting);

      }
    });




    if (length <= 1) {
      this.selectType.hide();
      this.selectTypeValue = idSelectType;
      return;
    }
    this.selectType.show();
    this.selectType.define('options', {
      body: {
        data: dataSelectType.data,
        on: {
          onItemClick: function (id) {
            let item = this.getItem(id);
            scope.selectTypeValue = id;
            scope.schemaTableSetting = scope.getSchemaTableSetting();
            scope.schemaTableUserFilter = item.schemaTableUserFilter;
            scope.schemaFilterUserList = JSON.parse(item.filter_setting);
            scope.schemaSortUserList = JSON.parse(item.sort_setting);
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

  }

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

    scope.table.attachEvent("onColumnResize", function(id,newWidth,oldWidth,user_action) {
      scope.eventSetColumnUserSize(id,newWidth,oldWidth,user_action);
    });

    scope.table.attachEvent("onAfterColumnDrop", function(sourceId, targetId, event) {
      scope.eventSetColumnUserSort(sourceId, targetId, event);
    });

  }

  eventSetColumnUserSize(id,newWidth,oldWidth,user_action) {
    let scope = this;
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-users");
    if (user_action) {
      let config = this.table.getColumnConfig(id);
      let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-users/"+config.rowId);
      webix.ajax().put(url, {"width":newWidth,"adjust":'', "id":config.rowId}, function(text, data, request) {
        scope.showMessageResult(data.json(), request, false)
      })
    }
  }

  eventSetColumnUserSort(sourceId, targetId, event) {
    let configSource = this.table.getColumnConfig(sourceId);
    let configTarget = this.table.getColumnConfig(targetId);
    let sengent = 1;
    if (configTarget.sort_order < configSource.sort_order) sengent = -1;
    configSource.sort_order = configTarget.sort_order+sengent*1;
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-users/"+configSource.rowId);
    webix.ajax().put(url, {"sort_order": configTarget.sort_order+sengent*1, "id":configSource.rowId}, function(text, data, request) {
      scope.showMessageResult(data.json(), request, false)
    });

  }

  showMessageResult(data, request, showSuccess) {

    if (data.errors ) {
      for (var prop in data.errors) {
        webix.message({
          text:prop+':'+data.errors[prop],
          type:"error",
          expire: -1,
        });
      }
    }

    if (request.status == 200  && !data.errors && showSuccess) {
      webix.message({
        text: 'Данные cохранены',
        type: 'info',
        expire: 1000,
      });
    }

    if (request.status == 204) {
      webix.message({
        text: 'Ошибка! Данные не сохранены',
        type: 'error',
        expire: -1,
      });
    }
  }

  //setting table and columns

  showSetting() {
    if (!this.win) {
      let scope = this;
      this.state = {
        'model' :this.capitalizeFirstLetter(this.mode),
        'urlTableUsers': this.app.config.apiRest.getUrl('get',"accounting/schema-table-users",{'per-page':-1,'sort':'[{"property":"sort_order","direction":"ASC"}]'}),
        'urlTableUserLists' : this.app.config.apiRest.getUrl('get',"accounting/schema-table-user-lists",{'per-page':-1,'sort':'sort_order'}),
        'urlTableSettingUsers' : this.app.config.apiRest.getUrl('get',"accounting/schema-table-setting-users",{'per-page':-1,'sort':'type-property'}),
        'dataList' : '',
        'urlTableUsersSave' : 'api->accounting/schema-table-users',
        'urlTableSettingUsersSave' : 'api->accounting/schema-table-setting-users',
        'listId' : '',
        'tableSetiingConfigColumn' : [],
        'tableSettingItems' : []
      };

      this.state['dataList'] = this.dataSelectType.data;
      this.state['listId'] = this.selectTypeValue;
      // let responseList = webix.ajax().sync().get(this.state.urlTableUserLists, {filter:{"model":this.state['model']}});
      // this.state['dataList'] = JSON.parse(responseList.responseText);
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
        cols:[

          {
          view:"menu",
          layout:"y",
          width:200,
          select:true,
          localId: 'menu-list',
          onContext:{},
          data: this.state['dataList'],
          ready:function(){
            this.select(scope.state.listId);
          },
          on:{
            onItemClick:function (id) {

              let response = webix.ajax().sync().get(scope.state.urlTableUsers, {filter:{"model": scope.state.model, 'list_id': id}});
              let dataUser = JSON.parse(response.responseText);
              scope.state['tableConfigColumn'] = dataUser.config.columns;
              scope.state['tableItems'] = (dataUser.data)? dataUser.data : dataUser.items;
              scope.state['listId'] = id;

              $$('showColumnsTab').define('rows',scope.getHeaderShowColumns());
              $$('showColumnsTab').reconstruct();
              $$('settingColumnsTab').define('rows',scope.getHeaderSettingColumns());
              $$('settingColumnsTab').reconstruct();

              let responseSetting = webix.ajax().sync().get(scope.state.urlTableSettingUsers, {filter:{"model":scope.state.model,"list_id":id}});
              let dataSetting = JSON.parse(responseSetting.responseText);
              scope.state['tableSetiingData'] = dataSetting;
              scope.state['tableSetiingConfigColumn'] =  dataSetting.config.columns;
              scope.state['tableSettingItems'] = (dataSetting.data)? dataSetting.data : dataSetting.items;

              $$('tablePropertyTab').define('rows',scope.getHeaderTableProperty());
              $$('tablePropertyTab').reconstruct();
            }
          }
        },
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
                  $$(this.getValue()).show();
                }
              }
            },
            {
              animate:false,
              width: 660,
              cells:[
                {
                  //header:'Показывать',
                  id: 'showColumnsTab',
                  type:"space",
                  // padding:{
                  //   top:5, bottom:0, left:0, right:0
                  // },
                  rows: this.getHeaderShowColumns()
                },
                {
                  //header:'Настройки',
                  id: 'settingColumnsTab',
                  type:"space",
                  rows: this.getHeaderSettingColumns()
                },
                {
                  id: 'tablePropertyTab',
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
      this.contentMenu = this.ui(this.getContentMenu(),scope);
      this.contentMenu.attachTo(this.win.queryView({'localId':'menu-list'}));
    }

    this.win.show();
  }

  getHeaderShowColumns() {
    let scope = this;

    return [

      {
        cols:[{
          view:"dataview",
          borderless:false,
          select:true,
          xCount:3,
          scroll: true,
          type: {
            width:210,
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
          template:"{common.markCheckbox()}<div style='margin-top:5px;'>#header#</div>",
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

  }

  getHeaderSettingColumns() {
    let optionsHeaderFilterType = [];
    let optionsHeaderTotalType = [];
    let optionsFormat = [];
    let optionsSortType = [];
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

    });
    return [{
      view:"datatable",
      css: "webix_header_border webix_data_border",
      select:'cell',
      editable:true,
      editaction: "click",
      tooltip: true,
      borderless:false,
      columns: [
        {'id':'index', 'header': '#', 'hidden': false, 'width':40, 'css':{'background-color': '#F4F5F9'}},
        {'id':'id', 'header': 'ID', 'hidden': true},
        {'id':'column_id', 'header': 'Колонка', 'hidden':true},
        {'id':'header', 'header': 'Колонка', 'adjust':'all', 'css':{'background-color': '#F4F5F9'},tooltip:'#column_id#'},
        {'id':'sort_order', 'header':'Порядок', editor:'text',  'adjust':'all'},
        {'id':'header_filter_type', 'header':'Тип фильтра', editor:'select', 'options':optionsHeaderFilterType, 'adjust':'all'},
        {'id':'header_total_type', 'header':'Тип итого', editor:'select', 'options':optionsHeaderTotalType, 'adjust':'all'},
        {'id':'format', 'header':'Формат колонки', editor:'select', 'options':optionsFormat, 'adjust':'all'},
        {'id':'sort_type', 'header':'Тип сорт.', editor:'select', 'options':optionsSortType, 'adjust':'all'},
        {'id':'width', 'header':'Ширина', editor:'text', 'adjust':'all'},
        {'id':'adjust', 'header':'Рег.ширины', editor:'text', 'adjust':'all'},
        {'id':'template', 'header':'Шаблон', editor:'text', 'adjust':'all'},
        {'id':'use_filter', 'header':'Исп. в фильтре', editor:'text', 'adjust':'all'},
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
  }

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
  }

  doSaveBaseSettingClick() {
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-user-list/save-to-base-setting");
    let response = webix.ajax().sync().get(url, {'listId': this.state.listId, 'model':this.state.model});
    let dataJson = JSON.parse(response.responseText);
    this.showMessageError(dataJson);
  }


  //content menu for setting table menu
  getContentMenu() {
    let scope = this;
    return {
      view:"contextmenu",
      id:"cmenu",
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
  }

  doSaveSettingClick() {
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-user/save-setting");
    let response = webix.ajax().sync().get(url, {'listId': this.state.listId, 'model':this.state.model});
    let dataJson = JSON.parse(response.responseText);
    let menu = this.win.queryView({'localId': 'menu-list'});
    menu.add(dataJson.data);
    menu.select(dataJson.data.id);
    menu.callEvent("onItemClick", [dataJson.data.id]);

  }

  doDeleteMenuClick(id, menu) {
    let url = this.app.config.apiRest.getUrl('delete',"accounting/schema-table-user-lists",{},id);
    let response = webix.ajax().sync().del(url);
    if (response.status == 204) {
      menu.remove(id);
      menu.select(menu.getFirstId());
      this.state['listId'] = menu.getFirstId();
    } else {
      webix.message("Ошибка! Данные не удалены!");
    }

  }

  doDefaultMenuClick(id, context) {
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-user-list/set-default",{'id':id});
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
  }

  doRenameClick(id, context) {

    let url = this.app.config.apiRest.getUrl('put',"accounting/schema-table-user-lists",{},id);


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
  }

  doCopyUsertMenuClick(id, context) {
    let scope = this;
    let url = this.app.config.apiRest.getUrl('get',"accounting/users");

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
              options:this.app.config.apiRest.getCollection("accounting/users", {"per-page": -1},'email'),
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
                  let url = scope.app.config.apiRest.getUrl('get',"accounting/schema-table-user/save-setting-for-user");
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


  }


  //state
  putFilterState() {
    webix.storage.local.put(this.mode+"_filter_state", {
      dateFrom:this.dateFrom.getValue(),
      dateTo:this.dateTo.getValue(),
      filterField: this.filterField.getValue(),
      filterInput:this.filterInput.getValue(),
    });
  }

  getSelectTypeState() {
    let state = webix.storage.local.get(this.mode+"_select_type_state");
    if (state)
      return state.selectType;
    return false;
  }

  putSelectTypeState(value) {
    webix.storage.local.put(this.mode+"_select_type_state", {
      selectType: value
    });
  }


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
  }

  doRefresh() {
    this.getDataTable();
  }

  getModelName(mode) {
    let end = mode[mode.length-1];
    if (end == 'y') {
      return mode.replace('y','ies');
    }
    return mode+'s';
  }

  doClickOpenAll() {
    let table = this.table;
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  capitalizeFirstLetter(string) {
    let names = string.split('-');
    let result = [];
    names.forEach(function(item) {
      result.push(item.charAt(0).toUpperCase() + item.slice(1));
    });
    return result.join('');
  }

  dataDriverJsonToObject(configColumns) {
    configColumns.forEach(function(item,key) {

      let myObj = {
        func: {}
      }

      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('formatDate') ==0) {
        eval(" myObj.func = (obj) => { try {formatDate(obj.trim())} catch (e) { debugger; } return  formatDate(obj.trim()); }");// + item.format);
        configColumns[key].format = myObj.func;//eval(item.format);
      }
      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('formatDateHour') ==0) {
        eval(" myObj.func = (obj) => { return formatDateHour(obj.trim()); }");// + item.format);
        configColumns[key].format = myObj.func;//eval(item.format);
      }
      if (item.format && typeof configColumns[key].format != 'function' && item.format.indexOf('formatDateShort') ==0) {
        eval(" myObj.func = (obj) => { return formatDateShort(obj.trim()); }");// + item.format);
        configColumns[key].format = myObj.func;//eval(item.format);
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
  }

  doAddClick() {
    this.table.unselect();
    this.formEdit.showForm(this.table);
  }


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
        url: this.app.config.apiRest.getUrl("get","accounting/schema-print-user-lists",{'per-page':-1,'filter':'{"list_id":"'+this.selectTypeValue+'"}'}),

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
    this.contentMenuPrint = this.ui(this.getContentMenuPrint(),scope);
    this.contentMenuPrint.attachTo(this.winPrint.queryView({'localId':'menu-list-print'}));
    this.winPrint.show();
  }

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

  }

  doSavePrintSettingClick(columnsCheck) {
    let scope = this;
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-print-user-lists");
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


  }

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
      filename: this.mode+name,
      styles: false,
      ignore: { "action-edit" : true},
      columns:columns
      // filter:function(obj){
      //   return obj.transaction_sum != 0;
      // }
    });

  }

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
  }

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
  }

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
  }

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
  }


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
  }

  setElementFilterForm() {
    if (this.schemaFilterUserList && this.schemaFilterUserList[0]) {

      let values = this.schemaFilterUserList;

      let formRowLayout = this.winFilter.queryView({'localId': 'form-row-layout'});
      for (let key in values) {
        formRowLayout.addView(this.getElementFilterForm(key));
      }
      this.winFilter.queryView('form').setValues(values);
    }
  }

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
            options: ['=','>=','<=','in']

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
  }

  deleteElementFilterForm(id) {
    let formRowLayout = this.winFilter.queryView({'localId': 'form-row-layout'});
    let element = this.winFilter.queryView({'localId': id});
    formRowLayout.removeView(element);
  }

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
  }

  doSaveFilterSettingClick(values) {
    let scope = this;
    if (this.selectTypeValue) {
      scope.schemaFilterUserList = values;
      let url = this.app.config.apiRest.getUrl('put', "accounting/schema-table-user-lists",{},this.selectTypeValue);


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


  }


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
  }

  setElementSortForm() {

    if (this.schemaSortUserList && this.schemaSortUserList[0]) {

      let values = this.schemaSortUserList;

      let formRowLayout = this.winSort.queryView({'localId': 'form-row-layout'});
      for (let key in values) {
        formRowLayout.addView(this.getElementSortForm(key));
      }
      this.winSort.queryView('form').setValues(values);
    }
  }

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
  }

  deleteElementSortForm(id) {
    let formRowLayout = this.winSort.queryView({'localId': 'form-row-layout'});
    let element = this.winSort.queryView({'localId': id});
    formRowLayout.removeView(element);
  }

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
  }

  doSaveSortSettingClick(values) {
    let scope = this;
    if (this.selectTypeValue) {
      scope.schemaSortUserList = values;
      let url = this.app.config.apiRest.getUrl('put', "accounting/schema-table-user-lists",{},this.selectTypeValue);


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


  }

}