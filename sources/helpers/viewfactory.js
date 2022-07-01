import {JetView} from "webix-jet";
export function viewFactory(config){
    class NewPageView extends JetView {
        config(){
            return config;
        }
    };

    return NewPageView;
}