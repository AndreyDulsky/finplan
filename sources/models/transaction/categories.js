import {ApiRest} from "models/restModel";
let restObj = new ApiRest();

let url = restObj.getUrl('get',"accounting/categories", {'sort':'name', 'per-page': -1});
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
