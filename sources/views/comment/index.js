import {JetView} from "webix-jet";
import UpdateFormView from "core/updateFormView";
import "components/comboClose";
import "components/comboDateClose";
import "components/searchClose";

var mentionedData = [
  {id:1, user_id:1, date:"2018-06-10 18:45", text:"Greetings, fellow colleagues. I would like to share my insights on this task. I reckon we should deal with at least half of the points in the plan without further delays. I suggest proceeding from one point to the next and notifying the rest of us with at least short notices. This way is best to keep track of who is doing what."},
  {id:2, user_id:2, date:"2018-06-12 19:40", text:"Hi, @\"Corvo Attano\". I am sure that that's exactly what is thought best out there in Dunwall. Let's just do what we are supposed to do to get the result."},
  {id:3, user_id:3, date:"2018-06-12 20:16", text:"@\"Daisy Fitzroy\". @\"Corvo Attano\" is right, though I must admit, he is often way too serious and lacks a good healthy sense of humour.<br>I'd also like to add that half of the points in the plan (btw who wrote it? I would like a long thoughtful conversation in person with the guy / lady in question. Maybe over a chessboard as well) Well, most of the points can be omitted if we rationally split the subtasks between all the parties and optimize the whole line of work."},
  {id:4, user_id:4, date:"2018-06-14 21:57", text:"Whatever you say, guys. (And @\"Glenn Crake\", I don't like chess. Though a blithesome conversation in the cafeteria is highly appreciated)."},
  {id:5, user_id:5, date:"2018-06-14 22:01", text:"There are things that you cannot solve by jumping in an X-wing and blowing something up, Daizy)))<br>Okay, guys, let's meet in person, discuss the final details of the plan and let's begin at last."},
  {id:6, user_id:4, date:"2018-06-14 22:31", text:"One more question, guys. Did you see Webix latest Kanban update? I think it can help us in planning our own work..  https://docs.webix.com/media/kanban/kanban_front.png"},
  {id:7, user_id:3, date:"2018-06-14 22:43", text:"Wow great, could you please share a link to this tool? Cannot wait for playing around with it."},
  {id:8, user_id:4, date:"2018-06-14 23:01", text:"Looks really cool. Here you are :) \nhttps://docs.webix.com/desktop__kanban_board.html"},
  {id:9, user_id:3, date:"2018-06-14 23:15", text:"Thanks a million ;)"}
];
var path =  "https://docs.webix.com/samples/30_comments/";

var usersData = [
  {"value":"Corvo Attano","image":path+"/common/imgs/corvo.jpg","id":1},
  {"value":"Daisy Fitzroy","image":path+"/common/imgs/daisy.jpg","id":2},
  {"value":"Glenn Crake","image":path+"/common/imgs/glenn.jpg","id":3},
  {"value":"Me","image":path+"/common/imgs/tomek.jpg","id":4},
  {"value":"Leia Organa","image":path+"/common/imgs/leia.jpg","id":5}
];

let user = webix.storage.local.get("wjet_user");

export default class CommnetView extends JetView{
  config(){
    return {
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
              currentUser: user.user_id,
              url: this.app.config.apiRest.getUrl('get',"accounting/comments", {'sort':'-time_comment', 'fields': 'text,date,user_id'}),
              users: this.app.config.apiRest.getUrl('get',"accounting/users", {'sort':'id', 'per-page': -1}),
              mentions:true,
              on:{
                onUserMentioned:function(userId, id){
                  var user = this.getUsers().getItem(userId).value;
                  webix.message(user+" was mentioned in comment "+id);
                }
              }
            },
            // {
            //   view: "datatable",
            //   localId: "comment-table",
            //   urlEdit: 'comment',
            //   hidden: true,
            //   //autoConfig: true,
            //   css:"webix_header_border webix_data_border",
            //   //leftSplit:1,
            //   //rightSplit:2,
            //   select: true,
            //   //datafetch:100,
            //   //datathrottle: 500,
            //   //loadahead:100,
            //   resizeColumn: { headerOnly:true },
            //
            //   columns:[
            //     { id:"id", header:"#",	width:50 },
            //     { id:"comment", header:"Комментарий", width: 280, sort: "string" },
            //     { id:"time_comment", header:"Время", width: 280, sort: "string" },
            //     { id:"user_name", header:"Кто", width: 280, sort: "string" },
            //
            //
            //
            //     {
            //       "id": "action-delete",
            //       "header": "",
            //       "width": 50,
            //       "template": "{common.trashIcon()}"
            //     },
            //     {"id": "action-edit", "header": "", "width": 50, "template": "{common.editIcon()}"}
            //   ],
            //   url: this.app.config.apiRest.getUrl('get',"accounting/comments", {'sort':'name'}),//"api->accounting/contragents",
            //   save: "api->accounting/comments",
            //   // scheme: {
            //   //    $sort:{ by:"name", dir:"asc" },
            //   //  },
            //
            //   on:{
            //     onItemClick:function(id, e, trg) {
            //
            //       if (id.column == 'action-delete') {
            //         var table = this;
            //         webix.confirm("Удалить запись?").then(function(result){
            //           webix.dp(table).save(
            //             id.row,
            //             "delete"
            //           ).then(function(obj){
            //             webix.dp(table).ignore(function(){
            //               table.remove(id.row);
            //             });
            //           }, function(){
            //             webix.message("Ошибка! Запись не удалена!");
            //           });
            //         });
            //
            //       } else {
            //         this.$scope.cashEdit.showForm(this);
            //       }
            //     },
            //     onBeforeLoad:function(){
            //       this.showOverlay("Loading...");
            //     },
            //     onAfterLoad:function(){
            //       if (!this.count())
            //         this.showOverlay("Sorry, there is no data");
            //       else
            //         this.hideOverlay();
            //     },
            //   }
            // }
          ]
        },

      ]
    };
  }

  init(view){

    let form = this.$$("form-search");
    let table = this.$$("comment-table");
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

}