import {JetView, plugins} from "webix-jet";

let formatMonthYear = webix.Date.dateToStr("%M %y");

export default class AdminView extends JetView {
  config() {


    firebase.initializeApp({
      databaseURL: "https://webix-demo.firebaseio.com/"
    });

    //create firebase connection, and assign it to webix
    var dbs = firebase.database();
    var proxy = webix.proxy("firebase", dbs.ref("tasks"));

    var placeholders = [
      { id: 1, value:"France", expense:[1,2,3], income: 842 },
      { id: 2, value:"Poland", expense:684, income:781 },
      { id: 3, value:"China",  expense:8142, income:7813 }
    ];


    const apiRoot = "//docs.webix.com/kanban/samples/server";


    var imagePath = "https://docs.webix.com/samples/63_kanban/common/imgs/";
    var users_set = [
      {id:1, value:"Rick Lopes", image:imagePath + "1.jpg"},
      {id:2, value:"Martin Farrell", image:imagePath + "2.jpg"},
      {id:3, value:"Douglass Moore", image:imagePath + "3.jpg"},
      {id:4, value:"Eric Doe", image:imagePath + "4.jpg"},
      {id:5, value:"Sophi Elliman", image:imagePath + "5.jpg"},
      {id:6, value:"Anna O'Neal"},
      {id:7, value:"Marcus Storm", image:imagePath + "7.jpg"},
      {id:8, value:"Nick Branson", image:imagePath + "8.jpg"},
      {id:9, value:"CC", image:imagePath + "9.jpg"}
    ];

    var text = ["Better late than never","Webix Jet tutorial","SpreadSheet NodeJS","Kanban tutorial","Take it easy"];


    return {
      localId: 'layout',
      cols:[
        {
          view: "form",
          rows:[
            { view: "label", label: "Select placeholder" },
            {
              view:"list",
              width: 200,
              borderless: true,
              autoheight: true,
              select:true,
              data:placeholders,
              on:{
                onAfterSelect:function(id){
                  var obj = this.getItem(id);
                  $$("ssheet").setPlaceholder(obj);
                }
              },
              ready: function(){
                this.select(1);
              }
            },
            {}
          ]

        },
        {
          view:"kanban",
          id:"kb",
          cols:[
            { rows:[
              { view:"kanbanheader", label:"Backlog", link:"new", on:{
                onBeforeCardAdd:function(obj,list){
                  obj.color = Math.floor(Math.random()*3) + 1;
                  obj.text = text[ Math.floor(Math.random()*5) ];
                }
              }},
              { id:"new", view:"kanbanlist", status:"new" }
            ]},
            { rows:[
              { view:"kanbanheader", label:"In Progress", link:"work" },
              { id:"work", view:"kanbanlist", status:"work" }
            ]},
            { rows:[
              { view:"kanbanheader", label:"Testing", link:"test" },
              { id:"test", view:"kanbanlist", status:"test" }
            ]},
            { rows:[
              { view:"kanbanheader", label:"Done", link:"done" },
              { id:"done", view:"kanbanlist", status:"done" }
            ]}
          ],
          //url: apiRoot + "/tasks/common",
          attachments: apiRoot + "/attachments",
          save:{
            url: "json->" + apiRoot + "/tasks/common",
            trackMove: true
          },
          data: JSON.parse('[{"status":"new","text":"Test new authentification service","tags":[1,2,3],"comments":[1,2,3],"attachments":[{"id":1,"link":"/kanban/samples/server/attachments/file003.xls","size":2702}],"id":"1"},{"status":"test","user_id":"9","text":"Portlets view","tags":["4","2"],"comments":[1],"attachments":[{"id":4,"link":"/kanban/samples/server/attachments/file004.txt","size":787},{"id":5,"link":"/kanban/samples/server/attachments/file001.rar","size":2702}],"id":"5","color":""},{"status":"work","user_id":3,"text":"SpreadSheet NodeJS","tags":[3],"id":"4"},{"status":"work","user_id":"7","text":"Webix Jet tutorial","tags":["4","6"],"attachments":[{"id":8,"link":"/kanban/samples/server/attachments/image004.jpg","size":84683}],"id":"6","color":"3"},{"status":"work","user_id":"5","text":"Performance tests","tags":["1"],"comments":[2,3],"attachments":[{"id":1621588830346,"link":"/kanban/samples/server/attachments/HR-Dashboard.pdf","size":30671}],"id":"2","color":""},{"status":"work","user_id":6,"text":"Kanban tutorial","tags":[2],"comments":[3],"id":"3"}]'),
          //tags: tags_set,
          users: users_set,
          //colors: colors_set,
          editor:true
        }


      ],
      // rows: [
      //   // {
      //   //   localId: "ssheet",
      //   //   view:"spreadsheet",
      //   //   menu:true,
      //   //   toolbar: "full",
      //   //   resizeCell: true,
      //   //  // url: this.app.config.apiRest.getUrl('get',"accounting/specifications", {'per-page' : 100})
      //   //   //data: []
      //   // },
      //   // {
      //   //   cols: [{
      //   //     view:"kanban", type:"space",
      //   //     cols:[
      //   //       { header:"Backlog",
      //   //         body:{ view:"kanbanlist", status:"new", type: "avatars" }},
      //   //       { header:"In Progress",
      //   //         body:{ view:"kanbanlist", status:"work", type: "avatars"}
      //   //       },
      //   //       { header:"Testing",
      //   //         body:{ view:"kanbanlist", status:"test", type: "avatars" }},
      //   //       { header:"Done",
      //   //         body:{ view:"kanbanlist", status:"done", type: "avatars" }}
      //   //     ],
      //   //     //url:proxy,
      //   //     //save:proxy
      //   //   }]
      //   //
      //   // }
      // ],

    };
  }

  init() {
    //debugger;
    $$("kb").waitData.then(function(){
      $$("kb").data.each(function(obj){
        if (obj.attachments){
          for (var i = 0; i < obj.attachments.length; i++){
            obj.attachments[i].link = "//docs.webix.com" + obj.attachments[i].link;
          }
          $$("kb").refresh();
        }
      });
    });
  }
}