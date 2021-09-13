import {JetView} from "webix-jet";
import {CoreEditClass} from "core/CoreEditClass";



webix.type(webix.ui.list, {
  name:"myUploader",
  //autoheight:true,

  template:function(f,type){

    var html = "<div class='overall'>";
    html += "<div class='name' ><a href='"+f.domain+f.folder+"/"+f.filename+"' target='_blank'><img id='"+f.name+"' src='"+f.domain+f.folder+"/"+f.filename+"' height='100' /></a></div>";
    html += "<div class='remove_file'><span style='color:#AAA' class='cancel_icon'></span></div>";
    html += "<div class='status'>";
    html += "<div class='progress "+f.status+"' style='width:"+(f.status == 'transfer'||f.status=="server"?f.percent+"%": "0px")+"'></div>";
    html += "<div class='message "+ f.status+"'>"+type.status(f)+"</div>";
    html +=	 "</div>";
    html += "<div class='size'>"+ f.sizetext+"</div></div>";
    return html;
  },
  status:function(f){
    var messages = {
      server: "Ok",
      error: "Ошибка",
      client: "",
      transfer:  f.percent+"%"
    };
    return messages[f.status]

  },
  on_click:{
    "remove_file":function(ev, id){
      $$(this.config.uploader).files.remove(id);
    }
  },
  height: 100
});

function uploadFiles(){
  $$("upl1").send();
}
function cancel(){
  var id= $$("upl1").files.getFirstId();
  while(id){
    $$("upl1").stopUpload(id);
    id = $$("upl1").files.getNextId(id);
  }
}




export default class CheckFormView extends JetView {
  constructor(app, name){
    super(app,name);
    this.state = new CoreEditClass(this);
  }

  config() {
    this.apiRest = this.app.config.apiRest;
    this.win = {};
    return {
      localId: "winEdit",
      view: "window",
      position: function (state) {
        state.left = 44;
        state.top = 34;
        state.width = state.maxWidth / 2;
        state.height = state.maxHeight - 38;
      },
      head: "Производственные процессы",
      close: true,
      modal: true,
      body: {
        localId: "formEdit",
        view: 'form',
        scroll : "auto",
        elements: []
      }
    }
  }

  init(view, url) {

  }



  showWindow(obj, table) {

    let scope = this;
    let state  = this.state;
    let record = table.getSelectedItem();
    let isUpdate = (record);
    let fieldSet;
    state.isUpdate = isUpdate;
    state.table = table;
    state.formEdit =  this.$$("formEdit");
    state.win = this.$$("winEdit");
    state.formConfig = [];
    state.formProcessConfig = [];


    let departmentName = '';
    state.works = table.$scope.app.config.apiRest.getCollection('accounting/works',{'per-page': -1, sort: 'department_id', 'expand': 'department'});
    state.works.waitData.then(function() {

      if (state.works.data.count() != 0) {
        departmentName = state.works.data.getItem(state.works.data.getFirstId()).department.name;
      }
      let fields = [];
      let works = [];
      let i=0;

      state.works.data.each(function(obj){
        i++;

        if (obj.department.name != departmentName && i!= state.works.data.count()) {
          // fieldSet = {
          //   view: "fieldset",
          //   label:departmentName,
          //
          //   body: {
          //     rows: fields
          //   }
          // };
          // state.formConfig.push(fieldSet);
          departmentName = obj.department.name;
          fields = [];
        }
        fields.push(
          {
            view: 'checkbox',
            label: obj.name,
            name: 'work'+'['+obj.id+'].name',
            labelWidth : 250,
            value: 0
          }
        );
        works.push(
          {
            id: obj.id,
            value: obj.name
          }
        );

        //console.log(obj);

      });

      // fieldSet = {
      //   view: "fieldset",
      //   label: departmentName,
      //   body: {
      //     rows: fields
      //   }
      // };
      //state.formConfig.push(fieldSet);
      state.formConfig.push({
        view:"dbllist",
        list:{ autoheight: true },
        labelLeft:"Рабочие процессы",
        labelRight:"Выбранные",
        name: 'works',
        value: [1,6],
        data:works
      });
      state.formProcessConfig.push({
        view:"datatable",
        css:"webix_header_border webix_data_border",
        editable:true,
        editaction: "dblclick",
        resizeColumn: { headerOnly:true },
        // columns:[
        //   { id:"id", header:"ID", width: 50},
        //   // { id:"sort_order", header:"№ пор.", width: 50, editor:"text"},
        //   { id:"name", header:"Наименование", width: 150,
        //     // template: function(obj, common) {
        //     //   if (obj.$group) return common.treetable(obj, common) + obj.department.name;
        //     //   return common.icon(obj)+obj.name;
        //     // }
        //   },
        //   // { id:"department_id", header:"Подразделение", width: 100,
        //   //   //collection: state.table.$scope.app.config.apiRest.getCollection('accounting/departments',{'per-page': -1})
        //   // },
        //   // { id:"employee_name", header:"Исполнитель", width: 100, editor:"text"},
        //   // { id:"status", header:"Статус", width: 50, editor:"text"},
        //   // { id:"date_fact_start", header:"Дата.факт.старт", width: 120},
        //   // { id:"date_fact_end", header:"Дата.факт.оконч.", width: 120},
        //   //
        //   // { id:"time_work", header:"Время", width: 80},
        //   // { id:"description", header:"Описание", width: 80, editor:"text"},
        //   // {
        //   //   "id": "action-delete",
        //   //   "header": "",
        //   //   "width": 50,
        //   //   "template": "{common.trashIcon()}"
        //   // },
        // ],
        url: state.table.$scope.app.config.apiRest.getUrl('get',"accounting/order-works", {
          'filter':'{"order_id":"'+record['id']+'"}',
          'expand' : 'department',
          'sort' : 'sort_order'
        }),
        save: "api->accounting/order-works",
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

      });


      state.formConfigBase = [
          {
            view:"tabview",
            tabbar:{ options:["Описание","Фото","Работы","Процессы"]},
            animate:false,
            paddingX:20,
            paddingY:0,

            cells:[
              { id:"Описание", paddingY: 30, labelWidth : 250, rows:[
                { "template":"Параметры товара", "type" :"section"},
                {
                  view: 'text',
                  label : "№",
                  name: "A",
                  labelWidth : 150,

                },
                {
                  view: 'text',
                  label : "Клиент",
                  name: "F",
                  labelWidth : 150,

                },
                {
                  view: 'text',
                  label : "Тип",
                  name: "E",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Наименование",
                  name: "I",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Ткань",
                  name: "L",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Ножки",
                  name: "N",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Размер мет.рамы",
                  name: "J",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Пуговицы",
                  name: "O",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Отстрочка",
                  name: "P",
                  labelWidth : 150
                },
                { "template":"Коэффициенты", "type" :"section"},
                //{ "template":"Время, мин", "type" :"section"},

                {
                  view: 'text',
                  label : "Коэф.обивки",
                  name: "AA",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Коэф.столярки",
                  name: "AG",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Коэф.пошив",
                  name: "CH",
                  labelWidth : 150
                },
                {
                  view: 'text',
                  label : "Коэф.крой",
                  name: "CI",
                  labelWidth : 150
                },
                { "template":"Примечания", "type" :"section"},
                {
                  view: 'textarea',
                  name: 'T',
                  labelWidth : 150,
                  label : "Примечание продажи",
                  height :60,
                },
                {
                  view: 'textarea',
                  name: 'desc_sawcut',
                  label : "Примечание распил",
                  labelWidth : 150,
                  height :60,
                },
                {
                  view: 'textarea',
                  name: 'desc_carpenter',
                  label : "Примечание столярка",
                  labelWidth : 150,
                  height :60,
                },
                {
                  view: 'textarea',
                  name: 'desc_cut',
                  label : "Примечание крой",
                  labelWidth : 150,
                  height :60,
                },
                {
                  view: 'textarea',
                  name: 'desc_sewing',
                  label : "Примечание пошив",
                  labelWidth : 150,
                  height :60,
                },
                {
                  view: 'textarea',
                  name: 'desc_upholstery',
                  label : "Примечание обивка",
                  labelWidth : 150,
                  height :60,
                },
                {
                  view: 'textarea',
                  name: 'desc_packaging',
                  label : "Примечание упаковка",
                  labelWidth : 150,
                  height :60,
                },
                {
                  view: 'textarea',
                  name: 'desc_shipment',
                  label : "Примечание отгрузка",
                  labelWidth : 150,
                  height :60,
                },


                {}
              ]},
              { id:"Фото", paddingY: 30, rows:[{
                padding: 5,
                view: "form", type: "line", rows: [
                  { view: "uploader",
                    id:"upl1",
                    height:37,
                    align:"center",
                    type:"iconButton",
                    icon:"plus-circle",
                    label:"Добавить файл" ,
                    datatype: null,
                    autosend:false,
                    inputName : 'uploader',
                    link:"mylist",
                    upload:scope.app.config.apiRest.getUrl('get','accounting/images', {'type':'image', 'model':'order','mode':'insert-save', 'id': record.id}),
                    on:{
                      onAfterFileAdd: function(upload){
                        //debugger;
                        var file = upload.file;

                        var reader = new FileReader();
                        reader.onload = function(event) {
                          // console.log(event.target.result);
                          //debugger;
                          document.getElementById(file.name).src = event.target.result;
                          //$$(file.name).src = event.target.result;
                          //$$("tmpWin").getBody().setValues({src:event.target.result});
                          //$$("tmpWin").show()
                        };
                        reader.readAsDataURL(file)
                        return true;
                      },
                      onBeforeRender: function(upload, data){
                        //debugger;
                        //var file = upload.file;


                        return true;
                      }
                    }
                  },
                  // {
                  //   localId:"uploadAPI",
                  //   id:"upl1",
                  //   name: 'uploader',
                  //   inputName : 'uploader',
                  //   view:"uploader",
                  //   datatype: null,
                  //   link:"mylist",
                  //   type:"iconButton", icon:"plus-circle", label:"Add files",
                  //   upload: scope.app.config.apiRest.getUrl('get','accounting/images', {'type':'image', 'model':'Order','mode':'insert', 'id': record.id}),
                  //   apiOnly:true
                  // },
                  {
                    borderless: true,
                    view:"list",  id:"mylist", type:"myUploader",
                    autoheight: true,

                  },
                  {
                    id: "uploadButtons",
                    cols:[
                      {view:"button", label: "Загрузить", type:"iconButton", icon: "upload", click:uploadFiles, align: "center"},
                      {width:5},
                      {view:"button", label: "Отмена", type:"iconButton", icon: "cancel-circle",  align: "center"}

                    ]
                  }
                ]
              }]},

              { id:"Работы", paddingY: 30, rows:state.formConfig},
              { id:"Процессы", paddingY: 30, rows:state.formProcessConfig},

            ]
          },
          {
            "margin" : 10,
            "padding" : 20,
            "cols" : [
              {
                "view": "template",
                "template": " ",
                "role": "placeholder",
                "borderless": true
              },
              // {
              //   "view": "button",
              //   "label": "Отмена",
              //   "localId": "btn_cancel",
              //   "css": "webix_transparent",
              //   "align": "right",
              //   "width": 120
              // },
              {
                "view" : "button",
                "localId" : "btn_save",
                "css" : "webix_primary",
                "label" : "Сохранить",
                "align" : "right",
                "width" : 120
              }
            ]
        }
      ];

      webix.ui(
        state.formConfigBase,
        state.formEdit
      );
      state.formEdit.setValues(record);

      let data = [];

      let images = record.images;

      if (images) {
        for (let key in images) {
          data.push({id: images[key].id, name: images[key].name, sizetext: images[key].size, status: "server", folder: images[key].folder,
            filename: images[key].file, 'domain': scope.app.config.apiRest.urlBase
          },)
        }
      }
      $$('upl1').files.clearAll();
      $$('upl1').files.parse(data);

      $$('upl1').files.attachEvent("onBeforeDelete", function(id) {
        let item = $$('upl1').files.getItem(id);
        let idRemote = id;
        if (item.newId) {
          idRemote = item.newId;
        }
        scope.app.config.apiRest.delete('accounting/images', {'id': idRemote}).then(function() {
          let i=0;
          for (let key in record.images) {
            if (record.images[key]['id'] == idRemote) {
              record.images.splice(key, 1);
              break;
            }
            i++;
          }
          //scope.state.tableRecord.images.push(data.data);
        });
      });

      $$('upl1').attachEvent('onFileUpload', function(item, data, obj1){

        //let item = $$('upl1').files.getItem($$('upl1').files.getLastId());
        //item['status'] = "local";
        item['folder'] = data.data.folder;
        item['filename'] = data.data.file;
        item['domain'] = scope.app.config.apiRest.urlBase;

        //uploader.files.remove(uploader.files.getLastId());
        //uploader.files.add({ id: upload.data.id, name:upload.data.name, sizetext:upload.data.size, status:"server" });
        record.images.push(data.data);
        //return true;
      });



      scope.attachFormEvents();

      state.win.show();
    });
  }





  attachFormEvents() {

    let scope = this;
    let state = this.state;
    let btnSave = this.$$("btn_save");
    let btnCopy = this.$$("btn_copy");

    btnSave.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave();
    });
    // btnCopy.attachEvent("onItemClick", function(newValue) {
    //   scope.doClickSave(true);
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
      state.win.hide();
    }, function(){
      webix.message("Ошибка! Данные не сохранены!");
    });
  }


}


