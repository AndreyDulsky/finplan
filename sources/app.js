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
let formatDateTime = webix.Date.dateToStr("%Y-%m-%d %H:%i:%s");
export default class App extends JetApp {

	constructor(confrestig) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			debug: true,//!PRODUCTION,
			start: "/top/start",
      access: "reader",
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
      //params: { "per-page":"-1"},
      //rest: this.config.apiRest,
      load: function(view, params) {
        return webix.ajax().get(restObj.getUrl('get',this.source), this.params);
      },
      save:function(view, update, dp) {

        let id = update.data.id;
        let editor;

      	if (update.operation === "update") {
          let dataChange = {};

          if (view._in_edit_mode == 1)
            editor = dp.config.master.getEditor();

          dataChange = update.data;
          return webix.ajax().put(restObj.getUrl('put', this.source, this.params, id), dataChange, {
            error:function(text, data, XmlHttpRequest){
              if (view._in_edit_mode == 1) {
                let selectedCell = dp.config.master.getSelectedId();
                let selectedChange = (editor) ? editor.column : selectedCell.column;
                view.addCellCss(id, selectedChange, "webix_invalid_cell");
              } else {
                webix.message({
                  text: 'Данные  не сохранены',
                  type: "error",
                  expire: -1,
                });
              }
            },
            success:function(text, data, XmlHttpRequest){

              let result = data.json();
              if (result.errors) {

                for (var prop in result.errors) {
                  webix.message({
                    text:"Запись не сохранена!",
                    type:"error"
                  });
                  webix.message({
                    text:prop+':'+result.errors[prop],
                    type:"error",
                    expire: -1,
                  });

                }

              } else {


                let record = view.getItem(id);
                if (result['updated']) {
                  record['updated'] = result['updated'];
                  record = view.getItem(id)
                }
                //if (view._in_edit_mode == 1) {

                  let selectedCell = dp.config.master.getSelectedId();
                  let selectedChange = (editor) ? editor.column : selectedCell.column;
                  if (selectedChange) {
                    view.addCellCss(id, selectedChange, "webix_editing_cell");
                  }
                //}

              }
              if (result.changeData) {
                for (var prop in result.changeData) {
                  webix.message({
                    text:prop+':  '+result.changeData[prop]['old']+' Изменено на: '+result.changeData[prop]['new']+' User:'+result.changeData[prop]['user'],
                    type:"error",
                    expire: -1,
                  });

                }
              }

            }
          });
        }
        if (update.operation === "insert") {
      	  delete update.data['id'];
          return webix.ajax().post(restObj.getUrl('create', this.source, this.params), update.data);
        }
        if (update.operation === "delete")
          return webix.ajax().del(restObj.getUrl('delete',this.source,this.params, id), update.data);
      }
    };




    this.use(plugins.User, { model: session });
		this.use(plugins.Locale, {
			lang: "ru",
				webix:{
					ru:"ru-RU",
					//en:"en-EN",
					// ...other locales
				},
			storage: webix.storage.prefix(this.config.id, webix.storage.local)
		});
/*wjet::plugin*/
	}

}

export {App};