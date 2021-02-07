import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
//import {departments} from "models/department/departments";
//import {typeSalary} from "models/department/type-salary";

import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";


export default class OrderCalculationRuleEditView extends UpdateFormView{
  config(){
    let scope = this;
    this.apiRest = this.app.config.apiRest;
    this.win = {};
    return {
      localId: "winEdit",
      view: "window",
      position: function (state) {
        state.left = 44;
        state.top = 34;
        state.width = state.maxWidth / 1.5;
        state.height = state.maxHeight - 34;
      },
      head: "Редактирование",
      close: true,
      modal: true,
      body: {
        localId: "formEdit",
        view: 'form',
        scroll : "auto",
        elements: [
          {
            "borderless": false,
            "margin": 10,
            "type": "space",
            "rows" : [
              {
                cols: [
                  {
                    "id" : "order_field",
                    "label": "Свойство заказа",
                    "name" : "order_field",
                    "options": {data : scope.apiRest.getCollection('accounting/calculation-fields')},
                    "view": "combo",
                    "labelPosition": "top",

                  },
                  {
                    "id" : "index_order",
                    "label": "Порядок выполнения",
                    "name" : "index_order",
                    "view": "text",
                    "labelPosition": "top",

                  },
                  {
                    "id" : "process_id",
                    "label": "Процесс",
                    "name" : "process_id",
                    "view": "text",
                    "labelPosition": "top",

                  },
                  {},
                  {},
                  {},
                  {}
                ]
              },
              {
                "cols": [
                  {
                    "rows": [

                      {
                        "id" : "type",
                        "label": "Тип свойства",
                        "name" : "type",
                        "options": [{"id": "value", "value" :  "Значение"}, {"id": "dir", "value" :"Справочник"}],
                        "view": "combo",
                        "labelPosition": "top",

                      },
                      {
                        "hidden" : false,
                        "rows": [
                          {
                            "id" : "directory_id",
                            "label": "Справочник",
                            "name" : "directory_id",
                            "options": {data : scope.apiRest.getCollection('accounting/calculation-directories')},
                            "view": "combo",
                            "labelPosition": "top",

                          },
                          {
                            "id" : "directory_field",
                            "label": "Свойство справочника",
                            "name" : "directory_field",
                            "options": [],
                            "view": "combo",
                            "labelPosition": "top",

                          }
                        ]
                      },
                    ]
                  },

                  {
                    width: 40
                  },
                  {
                    "rows": [
                      {
                        "cols": [
                          {
                            "label": "Условие",
                            "name" : "rule",
                            "value": "=",
                            "options": ['=','>','<','>=','<='],
                            "view": "combo",
                            "labelPosition": "top",

                          },
                          {
                            "label": "Значение",
                            "name" : "value",
                            "value": "",
                            "view": "text",
                            "required" : true,
                            "labelPosition": "top"
                          }
                        ],

                      }
                    ]
                  },
                  {
                    width: 40
                  },
                  {
                    "rows": [
                      {
                        "id" : "result_type",
                        "label": "Тип результата",
                        "name" : "result_type",
                        "value": "1",
                        "options": [{"id": "value", "value" : "Значение"}, {"id": "dir", "value" : "Справочник"}],
                        "view": "combo",
                        "labelPosition": "top"
                      },
                      {
                        "hidden" : false,
                        "rows": [
                          //если выбран справочник то всегда будет Справочник продукции
                          { //всегда будет product_id
                            "label": "Свойство заказа для справочника",
                            "name" : "order_result_type",
                            "value": "product_id",
                            //"options": [{"id": 1, "value" : "product_id"}],
                            "view": "combo",
                            "labelPosition": "top",
                            "hidden" : true
                          },
                          {
                            "id" : "result_directory_id",
                            "label": "Справочник", "value": "1", // можно подключить любой справочник
                            "name" : "result_directory_id",
                            "options": {data : scope.apiRest.getCollection('accounting/calculation-directories')},
                            "view": "combo", "labelPosition": "top"
                          },
                          {
                            "id" : "result_directory_field",
                            "label": "Свойство справочника",
                            "name" : "result_directory_field",
                            "view": "combo",
                            "labelPosition": "top",
                            "options" : []

                          },

                        ]
                      },

                    ]
                  },

                  {
                    "hidden" : false,
                    "rows": [
                      {
                        "id" : "result_value_operation",
                        "label": "Операция со значением",
                        "name" : "result_value_operation",
                        "options": ["=","+","-", "+%", "-%","formula"],
                        "view": "combo",
                        "labelPosition": "top"
                      },
                    ]
                  },
                  {
                    "rows": [

                      {
                        "id" : "result_value",
                        "label": "Значение",
                        "hidden" : false,
                        "disabled" : false,
                        "name" : "result_value",
                        "value": "",
                        "view": "text",
                        "labelPosition": "top",

                      },
                      { "label": "Формула", "view": "text", "labelPosition": "top",
                        "name" : "result_formula",
                        "hidden" : true,
                      }
                    ]
                  }
                ],

              }
            ],


          },

          {
            "margin": 10,
            "cols": [
              { "view": "template", "template": " ", "role": "placeholder", "borderless": true },
              { "view": "button", "localId" : "btn_copy", "label": "Копировать", "css": "webix_transparent", "align": "right", "width": 120 },
              { "view": "button", "label": "Отмена", "css": "webix_transparent", "align": "right", "width": 120, click: () => this.doClickCancel() },
              { "view": "button", "localId" : "btn_save", "css": "webix_primary", "label": "Сохранить", "align": "right", "width": 120 }
            ]
          }
        ]
      },
    };
  }

  init() {
    // в базовом класе будет не срабатывать если форма не подгружается удаленно
    this.attachFormEvents();
  }

  attachFormEvents() {
    let scope = this;
    let state = this.state;
    let btnSave = this.$$("btn_save");
    let btnCopy = this.$$("btn_copy");
    let comboDirectoryId = this.$$("directory_id");
    let comboDirectoryField = this.$$("directory_field");
    let comboType = this.$$("type");
    let comboResultType = this.$$("result_type");
    let comboResultDirectoryId = this.$$("result_directory_id");
    let comboResultDirectoryField = this.$$("result_directory_field");
    let comboResultValue = this.$$("result_value");
    let comboResultValueOperation = this.$$("result_value_operation");


    let api = this.apiRest;

    btnSave.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave();
    });
    btnCopy.attachEvent("onItemClick", function(newValue) {
      scope.doClickSave(true);
    });

    comboDirectoryId.attachEvent("onChange", function(newValue) {
      if (newValue == '') return;
      comboDirectoryField.setValue();
      let collection = new webix.DataCollection({
        data: comboDirectoryId.getList().getItem(comboDirectoryId.getValue()).fields,
      });
      comboDirectoryField.getPopup().getList().sync(collection);

    });
    comboType.attachEvent("onChange", function(newValue) {
      //debugger;
      if (newValue != "dir") {
        //comboDirectoryId.setValue();
        comboDirectoryId.hide();
        //comboDirectoryField.setValue();
        comboDirectoryField.hide();
      } else {
        comboDirectoryId.show();
        comboDirectoryField.show();
      }


    });

    comboResultDirectoryId.attachEvent("onChange", function(newValue) {

      if (newValue == '') return;
      comboResultDirectoryField.setValue();
      let collection = new webix.DataCollection({
        data: comboResultDirectoryId.getList().getItem(comboResultDirectoryId.getValue()).fields,
      });
      comboResultDirectoryField.getPopup().getList().sync(collection);

    });

    comboResultType.attachEvent("onChange", function(newValue) {

      if (newValue != "dir") {
        //comboDirectoryId.setValue();
        comboResultDirectoryId.hide();
        //comboDirectoryField.setValue();
        comboResultDirectoryField.hide();
        comboResultValue.show();
      } else {
        comboResultDirectoryId.show();
        comboResultDirectoryField.show();
        comboResultValue.hide();


      }
    });

    comboResultValueOperation.attachEvent("onChange", function(newValue) {
      if (newValue == 'formula' && comboResultType.getValue() == 'dir') { comboResultValue.show(); };
    });

  }

}