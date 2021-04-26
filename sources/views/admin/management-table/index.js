import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import {productTypes} from "models/product/product-type";
import ClothDirectoryView from "views/cloth-directory/index";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

let formatDate = webix.Date.dateToStr("%d.%m.%y");

export default class ProductsBedView extends JetView{
  config(){
    let scope = this;
    return {
      localId: "layout",
      rows: []

    };
  }

  init(view) {
    let scope = this;
    let layout = this.$$("layout");
    let format = webix.Date.dateToStr("%d.%m.%y");


    webix.extend(layout, webix.ProgressBar);
    // let url = this.app.config.apiRest.getUrl('get',"accounting/order/client-order",
    //   { 'per-page': -1}
    // );
    let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", {
      "per-page": "1200",
      sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"A","direction":"ASC"}]',
      //filter: '{"B":"'+selectTypeValue+'"}',
      //filter: '{"AE":{">=":"'+dateToValue+'"}}'
    });

    let url = this.app.config.apiRest.getUrl('get',"accounting/order/client-order",
      { 'per-page': -1}
    );
    webix.ajax(url, function(text){
      let text1 =eval(text);
      let win = scope.ui({view: 'client-order'});
      layout.addView(win);
      let table = win.queryView('treetable');
      let dateFrom = win.queryView({"localId":"dateFrom"});
      let dateTo = win.queryView({"localId":"dateTo"});
      let dateFromValue = format(dateFrom.getValue());
      let dateToValue = format(dateTo.getValue());
      let filter = {
        filter: {
          "or":[
            {"B": {"in":[3,1,2,5,6]}},
            {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
          ]
        }
      };

      dateFrom.attachEvent("onChange", function(id) {
        dateFromValue = format(dateFrom.getValue());
        dateToValue = format(dateTo.getValue());
        //selectTypeValue = selectType.getValue();
        let filter = {};// {filter:{"B": {"in":[selectTypeValue]}}};

        //if (selectTypeValue == 4) {
        //filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
        filter = {
          filter: {
            "or":[
              {"B": {"in":[3,1,2,5,6]}},
              {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
            ]
          }
        };
        //}

        let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
          "per-page": "1200",
          sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"A","direction":"ASC"}]',
          //filter: '{"B":"'+selectTypeValue+'"}',
          //filter: '{"AE":{">=":"'+dateToValue+'"}}'
        });
        webix.ajax().get(tableUrl, filter).then(function(data){
          table.clearAll();
          table.parse(data.json().items);
        });

      });

      dateTo.attachEvent("onChange", function(id) {

        dateFromValue = format(dateFrom.getValue());
        dateToValue = format(dateTo.getValue());
        //selectTypeValue = selectType.getValue();

        //if (selectTypeValue == 4) {
        //filter = {filter: {"B": {"in":[3,4]}, "date_shipment":{">=":dateFromValue}}};
        filter = {
          filter: {
            "or":[
              {"B": {"in":[3,1,2,5,6]}},
              {"date_shipment":{">=":dateFromValue, '<=':dateToValue}, "B":4}
            ]
          }
        };
        //}

        let tableUrl = scope.app.config.apiRest.getUrl('get',"accounting/orders", {
          "per-page": "1200",
          sort: '[{"property":"B","direction":"DESC"}, {"property":"date_shipment","direction":"ASC"}, {"property":"A","direction":"ASC"}]',
          //filter: '{"B":"'+selectTypeValue+'"}',
          //filter: '{"AE":{">=":"'+dateToValue+'"}}'
        });

        webix.ajax().get(tableUrl, filter).then(function(data){
          table.clearAll();
          table.parse(data.json().items);
        });
      });

      webix.ajax().get(tableUrl,filter).then(function(data){
        table.clearAll();
        table.parse(data.json().items);
      });
      //debugger;

      //layout.refresh();
    });


    // let tableConfig = {
    //   view: "datatable",
    //   css: "webix_header_border webix_data_border",
    //   leftSplit: 3,
    //   select: "row",
    //   resizeColumn: {headerOnly: true},
    //   localId: 'order-table',
    //   multiselect: true,
    //   scroll: true,
    //   clipboard: "selection",
    //   blockselect: true,
    //   tooltip: true,
    //   url: url, //path to a json file. See the file contents below
    //   scheme:{
    //     $sort:{ by:"B", dir:"desc", as: "int" },
    //     $init:function(item) {
    //       if (item.B == 4)
    //         item.$css = "highlight";
    //       if (item.B == 3)
    //         item.$css = "highlight-blue";
    //       if (item.B == 2)
    //         item.$css = "highlight-green";
    //       if (item.B == 6)
    //         item.$css = "highlight-green";
    //       let dateComplite = parserDate(item.date_obivka);
    //       let dateToday = webix.Date.add(new Date(), -1, "day");
    //
    //
    //       //debugger;
    //
    //       if (webix.filters.date.greater(dateToday,dateComplite ) && item.B=='1') {
    //         item.$css = "highlight-red";
    //       }
    //       item.index = this.count()+1;
    //     }
    //
    //   },
    // };
    // let table = webix.ui(tableConfig);
    // layout.addView(table);
    //
    // table.refresh();
    //
    // webix.ajax().get(tableUrl).then(function(data){
    //   table.clearAll();
    //   table.parse(data.json().items);
    // });


  }





}