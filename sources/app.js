import session from "models/session";
import {plugins} from "webix-jet";
import "./styles/app.css";
import { JetApp } from "webix-jet";
import localViews from  "helpers/localviews";
import {ApiRest} from "models/restModel";

var config = {
  apiKey: "AIzaSyDAIceh55czzBRgGdNyxS6tA4UJHjGK2II",
  //authDomain: "fluttershare-e36c3.firebaseio.com",
  projectId: "fluttershare-e36c3",
  //databaseURL: "https://fluttershare-e36c3.firebaseio.com",
  //storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(config);

var db = firebase.firestore();
db.settings({ timestampsInSnapshots:true });

webix.firestore = db;
let restObj = new ApiRest();

export default class App extends JetApp {

	constructor(confrestig) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			debug: !PRODUCTION,
			start: "/top/start",
      apiRest: restObj,
			views: function(name) {
				return localViews[name] || name;
			}
		};



		super({ ...defaults, ...config });

    //webix.proxy("api", "server/datatable_rest.php");
    webix.Date.startOnMonday = true;
    webix.proxy.api = {
      $proxy:true,
      params: {"expand":"data,contragent,category,project,account", "per-page":"-1"},
      //rest: this.config.apiRest,
      load: function(view, params) {
        return webix.ajax().get(restObj.getUrl('get',this.source), this.params);
      },
      save:function(view, update, dp) {

        let id = update.data.id;
      	if (update.operation === "update")
          return webix.ajax().put(restObj.getUrl('put', this.source, this.params, id), update.data);
        if (update.operation === "insert")
          return webix.ajax().post(restObj.getUrl('create',this.source,this.params), update.data);
        if (update.operation === "delete")
          return webix.ajax().del(restObj.getUrl('delete',this.source,this.params, id), update.data);
      }
    };




    this.use(plugins.User, { model: session });
		this.use(plugins.Locale, {
			lang: "ru",
				webix:{
					ru:"ru-RU",
					en:"en-EN",
					// ...other locales
				},
			storage: webix.storage.prefix(this.config.id, webix.storage.local)
		});
/*wjet::plugin*/
	}

}

export {App};