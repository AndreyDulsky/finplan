import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";



let user = webix.storage.local.get("wjet_user");

export default class CommnetView extends JetView{

  config(){
    let scope = this;
    return {
      view:"window",
      position: function (state) {
        state.left = 44;
        state.top = 34;
        state.width = state.maxWidth / 3+70;
        state.height = state.maxHeight - 42;
      },
      head: "Комментарии",
      close: true,
      modal: true,
      body: {
        localId: "layout",
        type:"wide",
        cols:[
          {
            rows: [


              {
                "view": "toolbar",
                height: 40,
                paddingY:2,
                cols: [
                  {
                    "view": "label",
                    "label": "Комментарии",
                    "width": 150
                  },

                  {},
                  { "label": "", "view": "search-close", "width": 300,  "align" :"right", localId: 'form-search'  },

                ]
              },

              {
                view:"comments",
                localId: 'comments',
                currentUser: user.user_id,
                url: this.app.config.apiRest.getUrl('get',"accounting/comments", {'sort':'-time_comment', 'fields': 'id,text,date,user_id, order_no'}),
                users: this.app.config.apiRest.getUrl('get',"accounting/users", {'sort':'id', 'per-page': -1,'fields': 'value,id,username'}),
                save: 'api->accounting/comments',
                mentions:true,
                sendAction:"enter",
                width: 600,


                listItem:{
                  // templateUser:function(obj){
                  //   var user = scope.$$("comments").getUsers().getItem(obj.user_id).value;
                  //   return "<span class='user'>"+user+"</span>";
                  // },
                  templateMenu: function(obj, common){
                    var html = "<span class = 'webix_comments_icons'>";
                    // html += "<span class='star mdi mdi-star"+(obj.star?"":"-outline")+"'></span>";
                    if(scope.$$("comments").config.currentUser == obj.user_id)
                      html += "<span class='webix_comments_menu mdi mdi-chevron-down'></span>";
                    html += "</span>";
                    return html;
                  },
                  // templateDate: function(){
                  //   return "";
                  // },
                  templateText: function(obj, common){
                    let orderNo = '';
                    if (obj.order_no) orderNo = '#'+obj.order_no+': ';
                    return "<div class = 'comment'>"+orderNo+common.templateLinks(obj)+"</div>"
                  },
                  // templateAvatar: function(obj, common){
                  //   var user = $$("comments").getUsers().getItem(obj.user_id);
                  //   var parts = user.value.split(" ");
                  //   var letters = parts[0][0].toUpperCase()+(parts[1]?parts[1][0].toUpperCase():"");
                  //   return "<span class='avatar'>"+letters+"</span>";
                  // },
                  //menuPosition:{pos:"bottom", x:0}
                },
                scheme:{
                  $init:(obj) => {
                    if(obj.date)
                      obj.date = webix.i18n.parseFormatDate(obj.date);
                  }
                },
                on:{
                  onUserMentioned:function(userId, id){
                    var user = this.getUsers().getItem(userId).value;
                    webix.message(user+" был отмечен получателем комментария "+id);
                  }
                }
              },

            ]
          },

        ]
      }
    };
  }

  init(view){

    let form = this.$$("form-search");
    let table = this.$$("comments");
    //table.markSorting("name", "asc");
    let scope = this;


    form.attachEvent("onChange", function(obj){

      let filter = {'search':form.getValue()};
      let objFilter = { filter: filter };

      webix.extend(table, webix.ProgressBar);

      table.clearAll(true);
      table.showProgress({
        delay:2000,
        hide:false
      });

      webix.ajax().get( scope.app.config.apiRest.getUrl('get','accounting/comments'), objFilter).then(function(data) {
        table.parse(data);
      });

    });

    this.cashEdit = this.ui(UpdateFormView);
  }

  doAddClick() {
    this.$$('comment-table').unselect();
    this.cashEdit.showForm(this.$$('comment-table'));
  }

  showForm(table, id) {
    //debugger;
    if (id) {
      let form = this.$$("form-search");
      form.setValue(id.toString());
    }
    this.getRoot().show();

  }

}