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
            { "view": "label", height:50, css: { 'font-size':'22px', 'padding': '5px 0px 10px 15px', 'font-weight': 700}, template:"<div>Операции</div>", borderless: true, width:130},
            { view:"button", id:"LoadBut", value:"Load", width:100, align:"left" },
            { view:"button", value:"Save", width:100, align:"center" },
            { view:"button", value:"Info", width:100, align:"right" }
          ]
        },
        {
          cols:[
            {
              view: 'datatable',
              width: 400,
              columns:[
                {id: 'name', header: 'Наименование'}
              ]
            },
            {
              view: 'datatable',
              columns:[
                {id: 'name', header: 'Наименование'}
              ]
            }
          ]
        }
      ]

    };
  }

  init(view) {

  }

}