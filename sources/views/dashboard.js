import {JetView} from "webix-jet";
import FormCoreDocumentWindow from "core/service/CoreDocumentWindow";
import FormCoreCharacteristicWindow from "core/service/CoreCharacteristicWindow";

import FormEditView from "core/service/FormDocumentEditView";
import FormCommnetView from "views/comment/index";
import FormViewView from "views/order/check-work";
import UpdateFormOrderView from "core/updateFormOrderView";
import WindowDirectoryView from "core/window/WindowDirectoryView";
import FormDocumentTableWindow from "core/service/FormDocumentTableWindow";


//import FormTransactionEditView from "core/service/formTransactionEditView";
import FormTransactionSchemaEditView from "core/service/FormTransactionSchemaEditView";

import FormDocumentEditView from "core/service/FormDocumentEditView";
import TableDynamic from  "components/tableService";
import formFilterView from "core/service/FormFilterView";

import FormView from "core/formView";

import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";
import "components/comboDirectory";

export default class HomeView extends JetView{


	config(){
    function goTo(){
      $$("data").add({
        "month":"April", "data":[{ "income": 5894, "count":4 }, { "income": 1458, "count":2 }]
      });
    };
    let buttons = {
      cols:[
        { view:"button", value:"Add item to the end", width:160, click:goTo },
        { view:"button", value:"Update last item", width:150, click:goTo },
        { view:"button", value:"Remove first item", width:150, click:goTo }
      ]
    };


    return {

      cols:[
        {
          view:"scrollview",
          body:{
            localId: 'menuDashboard',
            rows:[]
          }
        },
        {}
        // more cells
      ]
    };
	}

	init(view) {
    this.formDocumentTableWindow = this.ui(FormDocumentTableWindow);
    this.formCoreDocumentWindow = this.ui(FormCoreDocumentWindow);
    let menu = webix.storage.local.get("wjet_permission");
    let menuDashboard = this.getRoot().queryView({'localId':'menuDashboard'});
    let scope = this;
    menu.forEach(function(item, key) {
      if (item.is_dashboard == 1) {
        menuDashboard.addView({name: item.id,borderless:true, type:'header', template: item.value});
        let templateArray = [];
        item.data.forEach( function(itemMenu, keyMenu) {
          if (itemMenu.is_dashboard == 1) {
            //var listMenu = { localId: '', view: "list", autoheight: true, select:true, template: "#value#", data: item.data};
            //var button = { view:"button", label: itemMenu.value, css: 'webix_transparent', labelAlign:"right" };
            //var template = { view:"template", template: '<a href="">'+itemMenu.value+'</a>', type: "selection" };
            templateArray.push('<div style="margin-left: 5px; line-height: 20px;  float:left;">' +
              '<span class="link" ref="' + itemMenu.id + '" icon="' + itemMenu.icon + '"style="font-size: 13px;color:#1CA1C1;cursor: pointer; text-decoration:underline;">' + itemMenu.value + '</span></div>');
          }

          //menuDashboard.addView(button);
        });
        let template = {
          //type: "clean",
          autoheight: true,
          borderless:true,
          margin: 20,
          template: templateArray.join(''),

          onClick: {
            "link":function(ev, id){
              let ref = ev.target.getAttribute('ref').replace('service/','');
              ref = ref.replace('inproduce/','');

              if (scope.app.config.localViews[ref]) {
                //scope.app.config.localViews[ref]['win'].show();
                $$('tabbar').setValue(ref);
              } else {
                let objConfig = {
                  'view': {
                    formDocumentTableWindow: scope.ui(FormDocumentTableWindow),
                    formCoreDocumentWindow: scope.ui(FormCoreDocumentWindow),
                    formCoreCharacteristicWindow: scope.ui(FormCoreCharacteristicWindow),
                    formTransactionSchemaEditView: scope.ui(FormTransactionSchemaEditView),
                    formEdit: scope.ui(FormEditView),
                    // formFilter: this.formFilterView,
                    // formView: this.formView,
                    // formComment: this.formComment,
                    // formUpdateOrderView: this.formUpdateOrderView,
                    formDocumentEditView: scope.ui(FormDocumentEditView),
                    // windowDirectory: this.windowDirectory,
                  },
                  //'table' : {},
                  'window_width': 'max',
                  'window_head' : false,
                  'window_modal': false,
                  'window_layout_type' : 'line',
                  'type': 'directory',
                  'editor': {},
                  'options_url': ev.target.getAttribute('ref').replace('service/', '').replace('inproduce/',''),
                  'options_url_edit': ev.target.getAttribute('ref').replace('service/', '').replace('inproduce/',''),
                  'header': [{'text': ev.target.getInnerHTML(), 'icon' : ev.target.getAttribute('icon')}],
                  'filter': {}
                };
                scope.formCoreDocumentWindow.showWindow(objConfig);
              }
            }
          }
        };
        menuDashboard.addView(template);
      }
    });
    //debugger;

    // if (user.type == 20) {
    //   if (user.start_page) {
    //     this.show(user.start_page);
    //   } else {
    //     this.show('/top/inproduce/order');
    //   }
    // } else {
    //   if (user.start_page) {
    //     this.show(user.start_page);
    //   } else {
    //     this.show('/top/inproduce/order');
    //   }
    // }
  }


}