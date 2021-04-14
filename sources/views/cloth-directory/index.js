import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

webix.UIManager.addHotKey("enter", function(view){
  var pos = view.getSelectedId();
  view.edit(pos);
}, $$("cloth-table"));

export default class ClothDirectoryView extends JetView{
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
                  "label": "Ткани",
                  "width": 150
                },

                {},
                { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("cloth-table");
                  }
                },
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
              view: "datatable",
              localId: "cloth-table",
              urlEdit: 'cloth',
              //autoConfig: true,
              css:"webix_header_border webix_data_border",
              //leftSplit:1,
              //rightSplit:2,
              select: 'cell',
              //datafetch:100,
              //datathrottle: 500,
              //loadahead:100,
              resizeColumn: { headerOnly:true },
              editable:true,
              editaction: "dblclick",
              clipboard:"selection",
              multiselect:true,
              math: true,
              sort:"multi",

              columns:[
                { id:"index", header:"#", sort:"int", width:50},
                { id:"id", header:"ID",	width:50, sort: "int" },
                { id:"image", header:"",	width:60, template:function(obj) {
                  if (!obj.image) return '';
                  return '<img src="'+scope.app.config.apiRest.urlBase+'/'+obj.image.folder+'/'+obj.image.file+'" width="35" height="35" />';

                } },

                { id:"provider",  header:[ "Поставщик", { content:"selectFilter" }], width: 120, edit: 'text', sort: "text" },
                { id:"full_name", header:[ "Полн. наимен.", { content:"textFilter" }], width: 380, sort: "text" },
                { id:"name",  header:[ "Название", { content:"textFilter" }], width: 120,  edit: 'text', sort: "text" },
                { id:"color",  header:[ "Цвет", { content:"textFilter" }], width: 120,  edit: 'text', sort: "text" },
                { id:"price",  header:[ "Цена", { content:"numberFilter" }], width: 120, edit: 'text', sort: "int" },
                { id:"category",  header:[ "Категория", { content:"selectFilter" }], width: 120,  edit: 'text', sort: "int" },
                { id:"qty",  header:[ "К-во", { content:"numberFilter", format: webix.i18n.numberFormat }], width: 120,  edit: 'text', editor:"text", sort: "int"},
                { id:"sum", header:[ "Сумма", { content:"summColumn" ,  css: {"text-align": "right",  "font-weight": 300}}], format: webix.i18n.numberFormat,
                  css: {"text-align": "right",  "font-weight": 300}, sort: "int",
                  width: 120,  edit: 'text',   math:"[$r,price] * [$r,qty]"},


                {
                  "id": "action-delete",
                  "header": "",
                  "width": 50,
                  "template": "{common.trashIcon()}"
                },
                {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/cloths", {'sort':'provider+name+color', 'per-page': '-1', 'expand': 'image'}),//"api->accounting/contragents",
              save: "api->accounting/cloths",
              // scheme: {
              //    $sort:{ by:"name", dir:"asc" },
              //  },


              ready:function(){
                // apply sorting
                this.sort([{by:"provider", dir:"asc"}, {by:"name", dir:"asc"}, {by:"color", dir:"asc"}]);
                // mark columns
                this.markSorting("provider", "asc");
                this.markSorting("name", "asc", true);
                this.markSorting("color", "asc", true);
              },
              on:{
                "data->onStoreUpdated":function(){
                  this.data.each(function(obj, i){
                    obj.index = i+1;
                  })
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
                    this.$scope.cashEdit.showForm(this);
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

    let form = this.$$("form-search");
    let table = this.$$("cloth-table");
    //table.markSorting("name", "asc");
    let scope = this;
    let win = {
      view:"window",
      id:"tmpWin",
      position:"center",
      head:"Preview",
      close:true,
      move: true,
      body:{
        id:"tmp",
        view:"template",
        template:"<img src='#src#' style='width: 500px;' class='fit_parent'></img>",
        width:500,
        autoheight:true
      }
    };
    this.win = this.ui(win);

    form.attachEvent("onChange", function(obj){

      let filter = {'search':form.getValue()};
      let objFilter = { filter: filter, 'sort':'color' };

      webix.extend(table, webix.ProgressBar);

      table.clearAll(true);
      table.showProgress({
        delay:2000,
        hide:false
      });

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/cloths', {'sort':'provider+name+color', 'per-page': '-1'}), objFilter).then(function(data) {
        table.parse(data);
      });


      // table.loadNext(0, 0, 0, 0, 1).then(function (data) {
      //     table.clearAll(true);
      //     table.parse(data);
      // });

    });

    this.cashEdit = this.ui(UpdateFormView);


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
        let image = scope.state.tableRecord.image;
        if (image) {
          //for (let key in images) {
          data.push({id: image.id, name: image.name, sizetext: image.size, status: "server"},)
          //}
        }
        uploader.files.clearAll();
        uploader.files.parse(data);
        let mode = 'insert-save';
        let id = scope.state.tableRecord.id;
        if (uploader.files.count() > 0) {
            mode = 'update';
            id = image.id;
        }
        let url = scope.app.config.apiRest.getUrl('get','accounting/images', {'type':'image', 'model':'cloth','mode':mode, 'id': id});

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
              scope.state.tableRecord.image = '';
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
        //uploader.files.add({ id: upload.data.id, name:upload.data.name, sizetext:upload.data.size, status:"server" });
        scope.state.tableRecord.image = data.data;
       //return true;
      });

    };


  }

  doAddClick() {
    this.$$('cloth-table').unselect();
    this.cashEdit.showForm(this.$$('cloth-table'));
  }

}