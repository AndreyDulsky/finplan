import {ApiRest} from "models/restModel";
let restObj = new ApiRest();

var url = restObj.getUrl('get',"accounting/employees", {'sort':'name', 'per-page': -1});
export const employees = new webix.DataCollection({
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