var url = "http://admin.startsellshop.local/api/accounting/transactions?expand=parts&page=1&start=0&per-page=15&auth_token=7110eda4d09e062aa5e4a390b0a572ac0d2c02206&sort=%5B%7B\"property\"%3A\"id\"%2C\"direction\"%3A\"DESC\"%7D%5D";
export const cashes = new webix.DataCollection({
    //url: url,
	data: webix.ajax(url).then(function(data){
	    console.log(data.json());
	    return data.json().items;
	}),


    scheme:{
        // $init:function(obj){
        //     obj['account'] = obj.parts[0].account.name;
        //     obj['contragent'] = obj.parts[0].contragent.name;
        //     obj['category'] = obj.parts[0].category.name;
        //     if (obj.parts[0].project) {
        //         obj['project'] = obj.parts[0].project.name;
        //     }
        // }
    },

    update: function() {
        webix.ajax(url).then(function (data) {
            console.log(data.json());
            this.data = data.json().items;
        })
    }
});
