import {JetView} from "webix-jet";

export default class RegisterView extends JetView{
  config(){
    return {
      id: "layout",
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
                  "label": "Проводки",
                  "width": 150
                },
                {
                  "view": "label",
                  "label": "c",
                  "align" :"left",
                  "width": 30

                },
                {
                  "view": "datepicker",
                  "name": "date_from",
                  "align" :"left",
                  "width": 120
                },
                {
                  "view": "label",
                  "label": "по",
                  "align" :"left",
                  "width": 30
                },
                {
                  "view": "datepicker",
                  "name": "date_to",
                  "align" :"left",
                  "width": 120
                },
                {},
                { "label": "", "view": "search", "width": 300,  "align" :"right"  },
                {
                  view:"button",
                  value:"fs",
                  width: 30,
                  click: function() {
                    webix.fullscreen.set("table-register");
                  }
                },
              ]
            },
            {
              view: "datatable",
              id: "table-register",
              autoConfig: true,
              css:"webix_header_border webix_data_border",
              //leftSplit:1,
              //rightSplit:2,
              select: true,
              resizeColumn: { headerOnly:true },
              columns:[
                { id:"id", header:"#",	width:50 },
                { id:"date_document", header:"Дата",	width:90, format: webix.i18n.dateFormatStr },
                { id:"document_id", header:"Док.",	width:50 },
                { id:"account_debet", header:"Дебет" },
                { id:"subconto1_debet_name", header:"Субконто1" },
                { id:"subconto2_debet_name", header:"Субконто2" },
                { id:"account_credit", header:"Кредит" },
                { id:"subconto1_credit_name", header:"Субконто1" },
                { id:"subconto2_credit_name", header:"Субконто2" },
                { id:"sum", header:"Сумма", format: webix.Number.format, css:{"text-align": "right"} },
              ],
              url: this.app.config.apiRest.getUrl('get',"accounting/registers", {"per-page": "-1"})
            }
          ]
        },

      ]
    };
  }

}