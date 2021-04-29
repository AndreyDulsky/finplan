import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import {productTypes} from "models/product/product-type";
import ClothDirectoryView from "views/cloth-directory/index";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

let formatDate = webix.Date.dateToStr("%d.%m.%y");

export default class ManagementTableView extends JetView{
  config(){
    let scope = this;
    return {
      localId: "layout",
      rows: [
        {
          view: 'toolbar',
          cols:[
            { "view": "label", height:40, css: { 'font-size':'17px', 'padding': '5px 0px 10px 15px', 'font-weight': 'normal'}, template:"<div>Управление таблицами</div>", borderless: true, width:250 },

          ]
        },
        {
          cols:[
            {
              view: 'datatable',
              width: 200,
              select: true,
              localId: 'table-model',
              columns: [
                {id: 'name', header: 'Модели', width: 400},
              ],
              url: scope.app.config.apiRest.getUrl('get','accounting/user/get-tables'),
            },
            {
              rows:[
                {
                  view: 'datatable',
                  css:"webix_header_border webix_data_border my_style",
                  editable:true,
                  editaction: "dblclick",
                  select: true,
                  resizeColumn: { headerOnly:true },
                  localId: 'table-schema'

                },
                {
                  view: 'toolbar',
                  cols:[
                    {},
                    {
                      view: 'button',
                      localId: 'btn-save',
                      label: 'Сохранить',
                      width: 200
                    }
                  ]
                }

              ]
            }

          ]
        }
      ]

    };
  }

  init(view) {
    let scope = this;
    let tableModel = this.$$('table-model');
    let tableSchema = this.$$('table-schema');
    let btnSave =  this.$$('btn-save');

    tableModel.attachEvent("onSelectChange", function() {
      // define your pasting logic here

      let selectName = tableModel.getSelectedItem().name;
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/user/get-schema-table",{
        name: selectName
      });

      webix.ajax().get(tableUrl).then(function(data){
        tableSchema.clearAll();
        tableSchema.parse(data.json());
      });

    });

    btnSave.attachEvent("onItemClick", function() {
      let data = [];
      let selectName = tableModel.getSelectedItem().name;
      tableSchema.data.each(function(obj){
        data.push(obj);

      });
      let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/user/set-schema-table",{
        name: selectName
      });

      webix.ajax().post(tableUrl, {'data' :data}).then(function(data){
        //tableSchema.clearAll();
        //tableSchema.parse(data.json());
      });

    });
  }

}