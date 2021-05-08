import {JetView} from "webix-jet";



export default class HomeView extends JetView{



	config(){
    return {};
	}

	init(view) {

    let user = this.app.getService("user").getUser();
    if (user.type == 20) {
      if (user.start_page) {
        this.show(user.start_page);
      } else {
        this.show('/top/inproduce/order');
      }
    } else {
      this.show('/top/inproduce/order');
    }
  }


}