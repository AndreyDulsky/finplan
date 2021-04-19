import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import {productTypes} from "models/product/product-type";
import ClothDirectoryView from "views/cloth-directory/index";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class ProductsBedView extends JetView{
  config(){
    let scope = this;
    return {
      localId: "layout",
      type:"wide",
      cols:[
        {
          rows: [


            {
              "view": "toolbar",
              height: 40,
              paddingY:2,
              cols: [
                {
                  "view": "label",
                  "label": "Продукция",
                  "width": 150
                },

                {},
                {
                  view:"icon",
                  //type:"icon",
                  icon: 'mdi mdi-refresh',
                  autowidth:true,
                  value :true,
                  click: function() { scope.doRefresh() }

                },
                {
                  view:"toggle",
                  type:"icon",
                  icon: 'mdi mdi-file-tree',
                  autowidth:true,
                  value :true,
                  click: function() { scope.doClickOpenAll() }

                },
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  }
              ]
            },
            {
              "view": "toolbar",
              "height": 40,
              "paddingY":2,
              "cols": [
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


              ]
            },

            {
              view: "treetable",
              localId: "product-bed-table",
              urlEdit: 'product-bed',
              //autoConfig: true,
              css:"webix_header_border webix_data_border",
              leftSplit:2,
              //rightSplit:2,
              select: true,
              //datafetch:100,
              //datathrottle: 500,
              //loadahead:100,
              resizeColumn: { headerOnly:true },

              columns:[

                { id:"name", header:"Наиименование", width: 280, sort: "string",
                  template: function(obj, common) {
                    let types = scope.app.config.apiRest.getCollection('accounting/product-bed-types',{'per-page': -1});
                    if (obj.$level==1) return common.treetable(obj, common) + ((obj.value) ? types.getItem(obj.value).name : obj.name);
                    return common.icon(obj) +common.folder(obj)+' '+obj.name;
                  }
                },
                { id:"id", header:"#",	width:50, template: function(obj, common) {
                    if (!obj.$group) return obj.id;
                    return '';
                  }
                },
                //{ id:"name_bitrix", header:"Битрикс", width: 180, sort: "string" },
                { id:"type_id", header:"Тип", width: 180, sort: "string", collection: scope.app.config.apiRest.getCollection('accounting/product-bed-types',{'per-page': -1}) },
                // { id:"expense_cloth_120", header:"Рас. тк. 120", width: 120, sort: "string", edit: 'text' },
                // { id:"expense_cloth_140", header:"Рас. тк. 140", width: 120, sort: "string", edit: 'text' },
                // { id:"expense_cloth_160", header:"Рас. тк. 160", width: 120, sort: "string", edit: 'text' },
                // { id:"expense_cloth_180", header:"Рас. тк. 180", width: 120, sort: "string", edit: 'text' },
                // { id:"expense_cloth_200", header:"Рас. тк. 200", width: 120, sort: "string", edit: 'text' },

                { id:"price", header:"Кат. 0",	width:100 },
                { id:"price_1", header:"Кат. 1" },
                { id:"price_2", header:"Кат. 2." },
                { id:"price_3", header:"Кат. 3." },
                { id:"price_4", header:"Кат. 4",	width:100 },
                { id:"price_5", header:"Кат. 5",	width:100 },
                { id:"price_6", header:"Кат. 6",	width:100 },
                //
                //
                // { id:"price_7", header:"Кат. 7",	width:110 },
                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"},
                {"id": "action-image", "header": "", "width": 50, "template": "<i class='mdi mdi-image hover'></i>"},
                {"id": "action-image-table", "header": "", "width": 50, "template": "<i class='mdi mdi-table hover'></i>"},
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/product-beds", {'sort':'name', 'per-page': -1, 'expand':'images'}),//"api->accounting/contragents",
              save: "api->accounting/product-beds",
              // scheme: {
              //    $sort:{ by:"name", dir:"asc" },
              //  },
              scheme:{
                $group:{
                  by:function(obj){ return obj.type_id}, // 'company' is the name of a data property
                  map:{
                    value:["type_id"],
                  },
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
                    this.$scope.cashEdit.showForm(this);
                  }
                  if (id.column == 'action-image') {
                    let url = scope.app.config.apiRest.getUrl('get',"accounting/image-param/form-image-list",
                      { 'per-page': -1, 'product_id':id.row}
                    );
                    webix.ajax(url, function(text){
                      let text1 =eval(text);
                      let win = scope.ui({view: 'form-image-param-list'},scope.$$('layout'));
                      win.show();
                    });
                  }
                  if (id.column == 'action-image-table') {
                    let url = scope.app.config.apiRest.getUrl('get',"accounting/image-param/form-image-table",
                      { 'per-page': -1, 'product_id':id.row}
                    );
                    webix.ajax(url, function(text){
                      let text1 =eval(text);
                      let win = scope.ui({view: 'form-image-param-table'},scope.$$('layout'));
                      win.show();
                    });
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
            }
          ]
        },

      ]
    };
  }

  init(view){
    let table = this.$$("product-bed-table");
    let form = this.$$("form-search");
    let scope = this;
    webix.extend(table, webix.ProgressBar);

    form.attachEvent("onChange", function(obj){
      scope.getData();
    });

    this.cashEdit = this.ui(UpdateFormView);
    this.uploader = webix.ui({
      localId:"uploadAPI",
      name: 'uploader',
      inputName : 'uploader',
      view:"uploader",
      datatype: null,
      //upload:'',
      apiOnly:true
    });

    this.cashEdit.attachFormEvents = function(newValue) {
      let scope = this;
      let state = this.state;
      let btnSave = this.$$("btn_save");
      let btnCopy = this.$$("btn_copy");
      let uploader = this.$$('uploader');

      btnSave.attachEvent("onItemClick", function(newValue) {
        scope.doClickSave();
      });
      btnCopy.attachEvent("onItemClick", function(newValue) {
        scope.doClickSave(true);
      });
      this.$$("formEdit").elements["id"].attachEvent("onChange", function(newv, oldv, config){


        let data = [];
        let images = scope.state.tableRecord.images;

        if (images) {
          for (let key in images) {
            data.push({id: images[key].id, name: images[key].name, sizetext: images[key].size, status: "server"},)
          }
        }
        uploader.files.clearAll();
        uploader.files.parse(data);
        let mode = 'insert-save';
        let id = scope.state.tableRecord.id;
        // if (uploader.files.count() > 0) {
        //   mode = 'update';
        //   id = image.id;
        // }
        let url = scope.app.config.apiRest.getUrl('get','accounting/images', {'type':'image', 'model':'product-bed','mode':mode, 'id': id});

        uploader.define({
          'upload' : url
        });

      });

      uploader.files.attachEvent("onBeforeDelete", function(id) {
        let item = uploader.files.getItem(id);
        let idRemote = id;
        if (item.newId) {
          idRemote = item.newId;
        }
        scope.app.config.apiRest.delete('accounting/images', {'id': idRemote}).then(function() {
          let i=0;
          for (let key in scope.state.tableRecord.images) {
            if (scope.state.tableRecord.images[key]['id'] == idRemote) {
              scope.state.tableRecord.images = '';
              break;
            }
            i++;
          }
          //scope.state.tableRecord.images.push(data.data);
        });
      });


      uploader.attachEvent('onBeforeFileAdd', function(upload,data, obj1){

        // var file = upload.file;
        // var reader = new FileReader();
        // reader.onload = function(event) {
        //   // console.log(event.target.result);
        //   $$("tmpWin").getBody().setValues({src:event.target.result});
        //   $$("tmpWin").show()
        // };
        // reader.readAsDataURL(file);
        // return true;
      });
      uploader.attachEvent('onFileUpload', function(item, data, obj1){
        //let item = uploader.files.getItem(upload.id);
        //item['status'] = "local";
        item['newId'] = data.data.id;

        //uploader.files.remove(uploader.files.getLastId());
        uploader.files.add({ id: upload.data.id, name:upload.data.name, sizetext:upload.data.size, status:"server" });
        scope.state.tableRecord.images.push(data.data);
        //return true;
      });

    };

    let winTable = {
      localId: "winTable",
      view: "window",
      scope: this,
      head: "Список",
      position: 'center',
      width: 800,
      height: 600,
      close: true,
      modal: true,
      move:true,
      body: ClothDirectoryView
    };
    this.winTable =  this.ui(winTable);
  }

  getData() {

    let table = this.$$("product-bed-table");
    let form = this.$$("form-search");
    let scope = this;
    let filter = {'search':form.getValue()};
    let objFilter = { filter: filter };

    webix.extend(table, webix.ProgressBar);

    table.clearAll(true);
    table.showProgress({
      delay:2000,
      hide:false
    });

    webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/product-beds', {'sort':'name', 'per-page': -1}), objFilter).then(function(data) {
      table.parse(data);
      table.enable();
      table.openAll();
    });
  }

  doAddClick() {
    this.$$('product-bed-table').unselect();
    this.cashEdit.showForm(this.$$('product-bed-table'));
  }

  doClickOpenAll() {
    let table = this.$$("product-bed-table");
    if (table.getOpenItems().length >0 ) {
      table.closeAll();
    } else {
      table.openAll();
    }
  }

  doRefresh() {
    let table = this.$$("product-bed-table");
    table.disable();
    table.showProgress({
      type:"icon",
      hide:false
    });
    this.getData()();

  }

}