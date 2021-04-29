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
let formatDateShort = webix.Date.dateToStr("%d.%m");

let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
var parserDate = webix.Date.strToDate("%Y-%m-%d");

function custom_checkbox(obj, common, value){
  if (value)
    return "<div class='webix_table_checkbox checked'> YES </div>";
  else
    return "<div class='webix_table_checkbox notchecked'> NO </div>";
};


export default class AdminView extends JetView{
  config(){


    let scope = this;
    return {
      localId:'layout',
      rows:[
        {
          //type:"wide",
          view: 'toolbar',
          cols:[
            {
              view: 'label',
              localId: 'table-title',
              template: 'Заказы',
              css: {'font-size':'19px','font-weight':'normal','padding-left':'10px'}
            },
            {},
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

            {}
          ]
        },
        {
          localId: 'body-layout',
          cols:[]
        }
      ],
    };
  }

  urlChange(){
    const url = this.getUrlString();

    // "details/myview"
  }

  init(view) {
    this.use(plugins.UrlParam, ["mode"]);
    let layout = this.$$("body-layout");
    let mode = this.getParam('mode');
    this.mode = mode;
    let iconSetting = this.$$('icon-setting');
    let scope = this;

    let url = this.app.config.apiRest.getUrl('get',"accounting/"+mode+'s', {'per-page' : 200});

    this.schemaTableSetting = this.getSchemaTableSetting();

    scope.$$('table-title').define({'template' : this.schemaTableSetting['table-title']});

    if (this.schemaTableSetting['show-add-button'] == 1) {
      scope.$$('show-add-button').show();
    } else {
      scope.$$('show-add-button').hide();
    }
    if (this.schemaTableSetting['show-toolbar'] == 1) {
      scope.$$('show-toolbar').show();
    } else {
      scope.$$('show-toolbar').hide();
    }
    if (this.schemaTableSetting['show-icon-setting'] == 1) {
      scope.$$('show-icon-setting').show();
    } else {
      scope.$$('show-icon-setting').hide();
    }

    let tableConfig = {
      view: "datatable",
      urlEdit: mode,
      css: "webix_header_border webix_data_border",
      leftSplit: (this.schemaTableSetting['leftSplit']) ? this.schemaTableSetting['leftSplit'] : 0,
      rightSplit: (this.schemaTableSetting['rightSplit']) ? this.schemaTableSetting['rightSplit'] : 0,
      select: "cell",
      resizeColumn: {headerOnly: true},
      localId: 'order-table',
      multiselect: true,
      scroll: true,
      clipboard: "selection",
      blockselect: true,
      tooltip: true,
      editable:true,
      editaction: "dblclick",
      sort:"multi",
      save: "api->accounting/"+mode+'s',
      //url: url, //path to a json file. See the file contents below
      scheme:{
        $init:function(item) {

          item.index = (this.count()-1)+1;
        }
      },
      on:{
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
          this.showOverlay("Loading...");
        },
        onAfterLoad:function(){
          if (!this.count())
            this.showOverlay("Sorry, there is no data");
          else
            this.hideOverlay();
        },
      }
    };




    let table = webix.ui(tableConfig);
    this.table = table;
    layout.addView(table);

    //table.refresh();
    this.columns = [];
    webix.ajax().get(url).then(function(data){
      table.clearAll();
      let items = data.json();
      scope.columns = items.config.columns;
      let dataItem = (items.data)?items.data:items.items;

      items.config.columns = webix.DataDriver.json.toObject(items.config.columns);
      // items.config.columns.forEach(function(item,key) {
      //
      //   if (item.format && item.format.indexOf('formatDate') ==0) {
      //     items.config.columns[key].format = eval(item.format);
      //   }
      //   if (item.template && item.template.indexOf('custom_checkbox') ==0) {
      //     items.config.columns[key].template = eval(item.template);
      //   }
      // });

      table.config.columns = items.config.columns;
      table.parse(dataItem);

    });

    this.formEdit = this.ui(UpdateFormView);

  }

  getSchemaTableSetting() {
    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-settings", {'per-page' : -1});
    let response = webix.ajax().sync().get(url, {filter:{"model": this.capitalizeFirstLetter(this.mode)}});
    let data = JSON.parse(response.responseText);
    let setting = {};
    data.data.forEach(function(item)  {
      setting[item.property] = item.value;
    });

    return setting;
  }

  capitalizeFirstLetter(string) {
    let names = string.split('-');
    let result = [];
    names.forEach(function(item) {
      result.push(item.charAt(0).toUpperCase() + item.slice(1));
    });
    return result.join('');
  }

  showSetting() {
    let model = this.capitalizeFirstLetter(this.mode);
    let urlList = this.app.config.apiRest.getUrl('get',"accounting/schema-table-user-lists",{'per-page':-1,'sort':'sort_order'});
    let responseList = webix.ajax().sync().get(urlList, {filter:{"model":model}});
    let dataList = JSON.parse(responseList.responseText);

    let listId = (dataList.data[0]) ? dataList.data[0]['id'] : 0;

    let url = this.app.config.apiRest.getUrl('get',"accounting/schema-table-users",{'per-page':-1,'sort':'sort_order'});
    this.saveApiShowColumn = "api->accounting/schema-table-users";
    let urlUser = this.app.config.apiRest.getUrl('get',"accounting/schema-table-users",{'per-page':-1,'sort':'sort_order'});
    let response = webix.ajax().sync().get(url, {filter:{"model":model,"list_id":listId}});

    let data = JSON.parse(response.responseText);
    let scope = this;



    this.tableConfigColumn = data.config.columns;


    this.tableItems =  (data.data)? data.data : data.items;


    let body = {
      localId: 'body-setting-layout',
      css: 'webix_primary',
      //type:"space",
      cols:[ {
        view:"menu",
        layout:"y",
        width:200,
        select:true,
        // data:[
        //   //{ id:"1",value:"Общие настройки", select: true, 'url' : url, 'saveUrl':"api->accounting/schema-tables"},
        //   { id:"1",value:"Пользовательские 1", 'url' : urlUser, 'saveUrl':"api->accounting/schema-table-users"}
        // ],
        data: dataList,
        //url: this.app.config.apiRest.getUrl('get',"accounting/schema-table-user-lists",{'per-page':-1,'sort':'sort_order'}),
        ready:function(){
          this.select(this.getFirstId());
        },
        scheme: {
          $init: function() {
            //this.select(1);
          },
        },

        on:{
          onMenuItemClick:function(id){

            let item = this.getItem(id);
            let response = webix.ajax().sync().get(item.url, {filter:{"model": model}});
            let dataUser = JSON.parse(response.responseText);
            scope.tableConfigColumn = dataUser.config.columns;
            scope.tableItems =  (dataUser.data)? dataUser.data : dataUser.items;
            scope.saveApiShowColumn = item.saveUrl;
            $$('showColumnsTab').define('rows',scope.getHeaderShowColumns());
            $$('showColumnsTab').reconstruct();
            $$('settingColumnsTab').define('rows',scope.getHeaderSettingColumns());
            $$('settingColumnsTab').reconstruct();
          }
        }
      },
      {
        rows:[

          { view:"segmented",
            value:"showColumnsTab",
            inputWidth:550,
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
            cells:[
              {
                //header:'Показывать',
                id: 'showColumnsTab',

                rows: this.getHeaderShowColumns()
              },
              {
                //header:'Настройки',
                id: 'settingColumnsTab',
                rows: this.getHeaderSettingColumns()
              },
              {
                id: 'tablePropertyTab',
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
      head:"Настройки таблицы",
      width: 950,
      height: 500,
      position: 'center',
      modal:true,
      close:true,
      move: true,
      resize:true,
      body: body
    };
    if (!this.win) {
      this.win = webix.ui(winConfig);
    }

    this.win.show();
  }

  getHeaderShowColumns() {
    let scope = this;
    return [
      { view:"template", template:"Настройка видимости колонок", type:"section",
      },
      {
        padding:{
          top:10, bottom:0, left:0, right:0
        },

        cols:[{
          view:"dataview",
          //width: 850,
          padding:{
            top:10, bottom:10, left:10, right:10
          },
          select:true,
          xCount:3,
          scroll: true,
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
          data: this.tableItems,
          datatype:"json",
          save: this.saveApiShowColumn
        }

        ]
      },
      {
        view: 'toolbar',
        padding:{
          top:10, bottom:10, left:10, right:10
        },

        cols: [
          {},
          {
            view: 'button',
            label: 'Копировать настройки',
            css: 'webix_primary',
            width: 400
          },
          {
            width: 10
          },
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



    this.tableItems.forEach(function(item) {
      if (item.hidden == 0) {
        filterData.push(item);
      }

    });
    this.tableConfigColumn.forEach(function(item) {
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
      view:"toolbar",
      padding:{
        top:10, bottom:10, left:0, right:0
      },
      cols:[
        {
          view:"datatable",
          css: "webix_header_border webix_data_border",
          select:'cell',
          editable:true,
          editaction: "click",
          tooltip: true,
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
            {'id':'', 'header':'', 'fillspace':true},

          ],
          data: filterData,
          datatype:"json",
          save: this.saveApiShowColumn,
          scheme:{
            $init:function(item) {

              item.index = (this.count()-1)+1;
            }
          },
        }
      ]
    }];
  }

  getHeaderTableProperty() {
    let propertyTable = [];
    let items = this.table.config;
    for(let key in items) {
      let value = items[key];

      if (typeof items[key] != 'object' ) {
        propertyTable.push({'label':key, 'id':key, 'value':items[key], 'type' : 'text'});
      }


    }
    return [{
      padding:{
        top:10, bottom:10, left:0, right:0
      },
      rows:
        [{
          view: "property",
          id: "sets",
          scroll: true,
          //width:300,
          elements: propertyTable,
          //template: ''
        },
        {
          view: 'toolbar',
          padding: 10,
          cols: [
            {},
            {
              view: 'button',
              label: 'Сохранить',
              css: 'webix_primary',
              width: 200
            }]
        }]
    }];
  }

  doAddClick() {
    this.table.unselect();
    this.formEdit.showForm(this.table);
  }

}