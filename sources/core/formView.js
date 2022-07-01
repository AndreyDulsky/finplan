import {JetView} from "webix-jet";
import InproduceView from "views/inproduce";

export default class FormView extends JetView {

  config() {
      this.apiRest = this.app.config.apiRest;
      this.win = {};
      return {
          localId: "winView",
          view: "window",
          resize: true,
          position: function (state) {
              state.left = 64;
              state.top = 54;
              state.width = state.maxWidth / 1-84;
              state.height = state.maxHeight - 74;
          },
          head: "Таблица",
          close: true,
          modal: true,
          body: {
            localId: "formView",
            cols:[]
          }
      }
  }

  init(view, url) {

  }

  showWindow(url) {

    this.win = this.$$("winView");

    this.app.statusView =  url;
    this.$$('formView').addView(InproduceView);
    this.win.show();

  }




}


