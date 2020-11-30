var url = "http://admin.startsellshop.local/api/accounting/categories?expand=parts&page=1&start=0&per-page=-1&auth_token=7110eda4d09e062aa5e4a390b0a572ac0d2c02206&sort=%5B%7B\"property\"%3A\"name\"%2C\"direction\"%3A\"ASC\"%7D%5D";
export const categories = new webix.DataCollection({
    //url: url,
    data: webix.ajax(url).then(function(data){
        return data.json().data;
    }),
    scheme:{
        $init:function(obj){
            obj['value'] = obj.name;
        }
    }
});
