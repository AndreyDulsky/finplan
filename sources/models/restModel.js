export class ApiRest {

  constructor(){
    let $scope = this;
    //let wjetUser = webix.storage.local.get("wjet_user");
    if (location.host == 'localhost:8080') {
      this.urlBase = "http://admin.startsellshop.local/api";
      this.urlDomain = "http://greensofa.startsellshop.local";
    } else {
      this.urlBase = "http://admin.startsell.biz/api";
      this.urlDomain = "http://greensofa.net";
    }
    this.authKeyName = 'auth_token';

    //this.authKey = (wjetUser) ? wjetUser.token : '';//'7110eda4d09e062aa5e4a390b0a572ac0d2c022066';
    this.dataCollection = {};
  }
  setAuthKey(key) {
    this.authKey = key;
  }
  getAuthKey() {
    //if (!this.authKey) {
      let wjetUser = webix.storage.local.get("wjet_user");

      this.authKey =  (wjetUser) ? wjetUser.token : '';
    //}
    return this.authKey;
  }

  getUrl(type, model, params = {}, id = '') {
    let url = this.urlBase+'/'+model;
    let paramKey = '?'+this.authKeyName+'='+this.authKey;

    params[this.authKeyName] = this.getAuthKey();
    let out = [];
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        out.push(key + '=' + encodeURIComponent(params[key]));
      }
    }
    params = out.join('&');
    const urls = {
      'get': url+'?'+params,
      'create': url+'?'+params,
      'put':  url+'/'+id+'?'+params,
      'delete': url+'/'+id+'?'+params,
    };
    return urls[type];
  }

  get(model, params ) {
    let url = this.getUrl('get', model, params);
    return this.getData(url, model);

  }

  post(model, params) {
    return this.getUrl('create', model, params);
  }

  put(model, params) {
    if (!params['id']) return alert("You need fill params[id]");
    let url = this.getUrl('put', model, params, params['id']);
    return webix.ajax().put(url, params, {
      error:function(text, data, XmlHttpRequest){
        //webix.storage.local.remove("wjet_user")
      }
    });
  }

  delete(model, params) {
    if (!params['id']) return alert("You need fill params[id]");
    let url = this.getUrl('delete', model, params, params['id']);
    return webix.ajax().del(url, params, {
      error:function(text, data, XmlHttpRequest){
        //webix.storage.local.remove("wjet_user")
      }
    });
  }

  getData(url, model, callback) {
    //debugger;
    //let scope = this;
    // if (!this.dataCollection[model]) {
    //   //webix.ajax(url, callback);
    //
    //
    //   return webix.ajax(url, callback);
    // }
    this.dataCollection[model] = webix.ajax(url, callback);

    return  this.dataCollection[model];//this.dataCollection[model];
  }

  getLoad(url, params, callback) {
      return webix.ajax(url, params, {
        error:function(text, data, XmlHttpRequest){
          //webix.storage.local.remove("wjet_user")
        }
      });
  }

  getCollection(model, params, field = 'name') {
    let url = this.getUrl('get', model, params);
    if (!this.dataCollection[model]) {
      this.dataCollection[model] = new webix.DataCollection({
        url: url,
        scheme: {
          $init: function (obj) {
            obj['value'] = obj[field];
          }
        }
      });
    }
    return this.dataCollection[model];
  }

}