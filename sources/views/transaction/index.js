import {JetView} from "webix-jet";
import CashEditView from "views/transaction/cashEdit";

import {accounts} from "models/transaction/accounts";
import localViews from  "helpers/localviews";
import {promise} from "helpers/promise";
//import {cashes} from "models/cashes";
import CashView from "views/transaction/cashes";
//import CashesView from "views/transaction/cashes";

export default class TransactionView extends JetView{
    config(){
        var url = "http://admin.startsellshop.local/api/accounting/transaction/table?auth_token=7110eda4d09e062aa5e4a390b0a572ac0d2c02206";
        //debugger;
        //if (localViews["table"]) {
        localViews["table"] = new CashView(this.app, "table1", url);

        //}

        return {
            id: "layout",
            //type:"wide",
            cols:[
                {
                    rows: [
                        localViews["table"]
                    ]
                },

            ]
        };
    }




}