import {JetView} from "webix-jet";
import {CoreEditClass} from "core/CoreEditClass";






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
        state.width = state.maxWidth / 3;
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

    let departmentName = '';
    state.works = table.$scope.app.config.apiRest.getCollection('accounting/works',{'per-page': -1, sort: 'department_id', 'expand': 'department'});
    state.works.waitData.then(function() {

      if (state.works.data.count() != 0) {
        departmentName = state.works.data.getItem(state.works.data.getFirstId()).department.name;
      }
      let fields = [];
      let i=0;

      state.works.data.each(function(obj){
        i++;

        if (obj.department.name != departmentName && i!= state.works.data.count()) {
          fieldSet = {
            view: "fieldset",
            label:departmentName,

            body: {
              rows: fields
            }
          };
          state.formConfig.push(fieldSet);
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

        //console.log(obj);

      });

      fieldSet = {
        view: "fieldset",
        label: departmentName,
        body: {
          rows: fields
        }
      };
      state.formConfig.push(fieldSet);

      state.formConfigBase = [
          {
            view:"tabview",
            tabbar:{ options:["Описание","Производственные процессы"]},
            animate:false,
            paddingY:10,
            cells:[
              { id:"Описание", paddingY: 30, labelWidth : 250, rows:[

                {
                  view: 'text',
                  label : "№",
                  name: "A",


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
              { id:"Производственные процессы", paddingY: 30, rows:state.formConfig}
            ]
          },
          {
            "margin" : 10,
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


