export class ApiRest {

  constructor(){
    let $scope = this;
    if (location.host == 'localhost:8080') {
      this.urlBase = "http://admin.startsellshop.local/api";
    } else {
      this.urlBase = "http://admin.startsell.biz/api";
    }
    this.authKeyName = 'auth_token';
    this.authKey = '7110eda4d09e062aa5e4a390b0a572ac0d2c02206';
    this.dataCollection = {};
  }

  getUrl(type, model, params = {}, id = '') {
    let url = this.urlBase+'/'+model;
    let paramKey = '?'+this.authKeyName+'='+this.authKey;
    params[this.authKeyName] = this.authKey;
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
    if (!params[id]) return alert("You need fill params[id]");
    return this.getUrl('put', model, params);
  }

  delete(model, params) {
    if (!params[id]) return alert("You need fill params[id]");
    return this.getUrl('delete', model, params);
  }

  getData(url, model, callback) {
    if (!this.dataCollection[model]) {
      this.dataCollection[model] = webix.ajax(url, callback);
    }
    return this.dataCollection[model];
  }

  getCollection(model, params) {
    let url = this.getUrl('get', model, params);
    if (!this.dataCollection[model]) {
      this.dataCollection[model] = new webix.DataCollection({
        url: url,
        scheme: {
          $init: function (obj) {
            obj['value'] = obj.name;
          }
        }
      });
    }
    return this.dataCollection[model];
  }

}