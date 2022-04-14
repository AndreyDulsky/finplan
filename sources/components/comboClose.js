import {JetView} from "webix-jet";

webix.protoUI({
  name:"combo-close",
  $cssName:"search custom",
  $init:function(){

    this.attachEvent("onTimedKeyPress", this.toggleDeleteIcon);
    this.attachEvent("onChange", this.toggleDeleteIcon);
    this.attachEvent("onItemClick", this.onItemClick);
    this.$ready.push(this.toggleDeleteIcon);
  },
  $renderIcon:function(){
    var config = this.config,
      icons = [ "menu-down","close"],
      height = config.aheight - 2*config.inputPadding,
      padding = (height - 18)/2 -1,
      html = "",
      pos = 2;

    for (var i = 0; i < icons.length; i++){
      html += "<span style='right:"+pos+"px;height:"
        +(height-padding)+"px;padding-top:"+padding
        +"px;' class='webix_input_icon wxi-"+icons[i]+"'></span>";

      pos+=18;
    }
    return html;

    return "";
  },
  onItemClick(e, node) {
    //debugger;
    var name = node.target.className.substr(node.target.className.indexOf("wxi-")+4);
    if(name == "close") {
      this.setValue("");
      this.getPopup().hide(this.getInputNode());
    }


  },
  toggleDeleteIcon(){
    if(!this.getValue())
      webix.html.addCss(this.$view, "no-delete", true);
    else
      webix.html.removeCss(this.$view, "no-delete");

  },
  on_click:{
    "webix_input_icon":function(e, id, node){
      var name = node.className.substr(node.className.indexOf("wxi-")+4);
      //debugger;
      if(name == "close"){ //delete icon
        //this.setValue("");
        //this.getInputNode().blur();
        //this.getPopup().hide(this.getInputNode());

      }
      //this.callEvent("on" + name + "IconClick", [e]);

      this.getInputNode().focus();

    }
  },
}, webix.ui.combo);