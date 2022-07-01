import {ApiRest} from "models/restModel";
let restObj = new ApiRest();

let url = restObj.getUrl('get',"accounting/projects", {'sort':'name', 'per-page': -1});
export const projects = new webix.DataCollection({
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
