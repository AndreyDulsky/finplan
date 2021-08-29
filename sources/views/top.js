import {JetView, plugins} from "webix-jet";
import FormCommnetView from "views/comment/index";

let formatDate = webix.Date.dateToStr("%d.%m.%y");
let formatDateTime = webix.Date.dateToStr("%d.%m.%y %H:%i");
let formatTime = webix.Date.dateToStr("%H.%i");

export default class TopView extends JetView{
	config(){

		const locale = this.app.getService("locale");
		const _ = locale._;
		const logout = [{
        view:"label",
        label:webix.storage.local.get("wjet_user").user,
        width: 180,
        css:{'font-weight' : 'normal'}

      },
		  {
        view:"button", label:"Выход", width: 120,
        click: () => this.show("/logout")
		  }
    ];
    let scope = this;



		const header = {
			view:"toolbar",
			css:"webix_dark",
			localId: 'toolbar',
			elements:[
        {
          view: "icon", icon:"mdi mdi-menu",
          click: function(id,obj,owner) {

            scope.$$("top:menu").toggle();
            // if( $$("menu").config.hidden){
            //   $$("menu").show();
            // }
            // else
            //   $$("menu").hide();
          	}
        },
				{ view:"label", label:"ФинПлан"}, // label:this.app.config.name }
				{
          width: 380,
					cols: [
            { view:"label",
              localId: "totalAccountsLabel",
              label: "",

              // template: "<div class='webix_el_box' ><a href='javascript: void(0);' style='line-height:32px; color: #color#; font-size: 12px; font-weight: normal; text-decoration: none; padding-right:0px;'>На счетах:  #label#</a><span class='webix_icon wxi-menu-down'></span> </div>",
							itemClick: this.doClickBalance
            },
            // {
            //   view:"icon", icon: 'mdi mdi-arrow-down',
            //   width: 150,
            //   localId: "totalAccounts",
            //   color: 'white',
            //   hover: "myhover",
            //   //template: "<button>#label#</button>",
            //   click: this.doClickBalance
            // },

					]
				},
        {
          cols: logout
        },
				{
						view:"icon", icon: 'widget_icon wxi-drag',
						//badge:12,
            localId: "commentLabel",
						popup: "commentPopup"
				}
			]
		};


		let menu = {
			view:"sidebar",
			localId:"top:menu",
      id: "top:menu",
			css:"webix_sidebar webix_dark",
			//layout:"y",


      select:true,
      collapsed: true,
      //collapsedWidth:76,
			//activeTitle: false,
      //position:"right",
      multipleOpen: true,
        //template:"<span  class='mdi #icon#' style='font-size:30px;'></span><br>#value#",
			//template: "<i class='material-icons md-36 md-light'>#icon#</i>",
      //template: '<i class="webix_icon mdi-24px #icon#" style="color:#ccc;padding:10px 10px 5px 15px;"></i>',
			data:[
        //{ value:"Firebase", id:"firebase",  icon:"mdi  mdi-puzzle" },

			],
      


		};

		let menuPermissions = webix.storage.local.get("wjet_permission");
		(menuPermissions) ? menu['data'] = menuPermissions :  menu['data'] = {};

		//menu['data'].push({ value:"Настройки", id:"settings",  icon:"mdi mdi-tools" },)
    //menu['data'].push({ value:"Открытые отчеты", id:"info", icon:"mdi mdi-folder-open", data:[], hidden: true })



		const ui = {

			rows:[
				header,
				{
					//type:"wide",
					cols:[
            menu,
            { $subview:true }
					]
				}
			],
		};

		return ui;
	}

	init(){
    this.use(plugins.Menu, "top:menu");
		let scope = this;
    let isLogged = 'http://admin.startsell.biz/api/users/is-logged';
    let urlSummaryAccount = this.app.config.apiRest.getUrl('get','accounting/transaction/summaryaccount');
    webix.ajax().get( isLogged).then(function(data) {
      //debugger;
      //scope.setTotalAccounts(data.json());
    });
    let user = webix.storage.local.get("wjet_user");
    let userId = user.user_id;

    let winComment = {};

    let userService = this.app.getService("user").getUser();

    let refConfig = webix.firebase.ref('accounting/comment').orderByChild('users_view/'+userService.user_id).equalTo(null).limitToLast(50);

    //let refConfig = webix.firebase.ref('messages/'+userService.firebase_uid+'/Jgy8bWLyxQWUX81tL7Pb');

    let dataList = [];
    webix.proxy.firebase['params'] = {
      'orderByChild' : 'users_view/'+userService.user_id,
      'equalTo' : null,
      'limitToLast' : 50
    };
    webix.proxy.firestore['params'] = {
      'orderBy' : {'field':'createdAt','direction' : 'desc'},
      'where' : {'field':'isMessageRead', 'operator':'==', 'value':false},
      'limit' : 50
    };
    //webix.proxy.firestore.source = webix.firestore.ref('messages/'+userService.firebase_uid+'/Jgy8bWLyxQWUX81tL7Pb')
    if (userService.firebase_uid !='') {
      winComment = {
        view: "popup",
        width: 500,
        id: "commentPopup",
        body: {
          rows: [

            {
              view: "list",
              localId: 'commentList',
              type: {
                height: 67,
                template: function (obj) {
                  return formatDateTime(new Date(obj.createdAt)) + ' ' + obj.finPlanUserName + '<br/>' + '№' + obj.finPlanOrderNo + ' - ' + obj.message;
                },
                // template: function(obj) {
                //   return formatDate(obj.time_comment)+' '+formatTime(obj.time_comment)+' '+obj.user_name+'<br/>'+ '№'+((obj.order_no) ? obj.order_no : '')+' - '+obj.comment;
                // },
              },
              //data: data,
              url: webix.proxy("firestore", 'messages/' + userService.firebase_uid + '/Jgy8bWLyxQWUX81tL7Pb'),//'firestore->messages/'+userService.firebase_uid+'/Jgy8bWLyxQWUX81tL7Pb',//webix.proxy("firebase", 'accounting/comment'),//'firebase->accounting/comment',
              on: {
                onAfterAdd: function (data, params) {

                  scope.setCommentsFireBase(this.count());
                },
                onAfterLoad: function (data, params) {
                  scope.setCommentsFireBase(this.count());
                },
                onAfterDelete: function (data, params) {
                  scope.setCommentsFireBase(this.count());
                },
                onSelectChange: function () {
                  debugger;
                  scope.setCommentsFireBase(this.count());
                },
                onItemClick: function (id, e, trg) {

                  let item = this.getItem(id);
                  //let urlMessage = scope.app.config.apiRest.getUrl('get', 'accounting/comment/comment-view-ok', {'id': id});
                  this.getParentView().hide();
                  //webix.firebase.ref("accounting/comment/"+item.uid+"/users_view/"+userService.user_id).set(true);

                  webix.firestore.collection('messages').doc(userService.firebase_uid).collection('Jgy8bWLyxQWUX81tL7Pb').doc(id).set({isMessageRead: true});
                  scope.setComments(item, -1);
                  // this.remove(item.id);
                  // for (let key in dataList) {
                  //   if (dataList[key]['uid'] == item['uid']) {
                  //     dataList.splice(key, 1);
                  //   }
                  // }
                  // webix.ajax().get(urlMessage).then(function (data) {
                  //   //scope.setComments(data.json());
                  // });

                }
              }
            },
            {
              height: 30,
              cols: [
                {
                  view: "button",
                  label: "Показать все",
                  hidden: ((userService.type == 0 || userService.type == 10)) ? false : true,
                  css: 'webix_primary',
                  click: function () {
                    scope.formComment.showForm(this);
                    scope.winComment.hide();
                  },

                },
                {},
                {}
              ]
            }

          ]

        }

      };
      this.winComment = this.ui(winComment);
      let commentPopup = $$('commentPopup');
      let commentList = commentPopup.queryView('list');
    } else {

        winComment = {
          view: "popup",
          id: "commentPopup",
          body: {}
        };
      this.winComment = this.ui(winComment);





    }




    //let proxy = webix.proxy('firebase', refConfig);
    // webix.firebase.ref('accounting/comment').orderByChild('users_view/'+userService.user_id).equalTo(true).limitToLast(50).on('child_changed', function(data, id, params){
    //   debugger;
    //   if (id == null) return;
    //   var obj = data.val();
    //   // dataList.unshift(obj);
    //   for (let key in dataList) {
    //     if (dataList[key]['uid'] == obj['uid']) {
    //       dataList.splice(key, 1);
    //     }
    //
    //   }
    //   commentList.clearAll();
    //   commentList.parse(dataList);
    //   //debugger;
    //   //obj.id = data.key();
    //   scope.setComments(obj, -1);
    //
    //   //place Webix API
    //   //someView.add(obj);
    // });


    if (userService.type == 0 || userService.type == 10) {
      refConfig.on('child_added', function(data){
        var obj = data.val();
        obj['uid'] = data.key;
        // dataList.unshift(obj);
        // commentList.clearAll();
        // commentList.parse(dataList);
        //debugger;
        //obj.id = data.key();
        //scope.setComments(obj,  1);

        //place Webix API
        //someView.add(obj);
      });
      //let urlMessage = this.app.config.apiRest.getUrl('get', 'accounting/comment/comment-view');
      // webix.ajax().get(urlMessage).then(function (data) {
      //   scope.setComments(data.json());
      // });

      this.$$('totalAccountsLabel').attachEvent("onItemClick", function (id, e) {
        ///scope.doClickBalance();
        // code
      });
    }

    this.formComment = this.ui(FormCommnetView);







	}

  setCommentsFireBase(count) {
    let commentLabel = this.$$('commentLabel');
    commentLabel.config.badge = (count == 0) ? '' : count;
    commentLabel.refresh();
  }

  setComments(data, i) {
    let commentLabel = this.$$('commentLabel');
    let commentPopup = $$('commentPopup');
    let commentList = commentPopup.queryView('list');
    let count = (!commentLabel.config.badge) ? 1 : parseInt(commentLabel.config.badge)*1+i;
    (data) ? commentLabel.config.badge = (count==0) ? '' : count: commentLabel.config.badge= '';
    commentLabel.refresh();
  }
  // setComments(data) {
  //   let commentLabel = this.$$('commentLabel');
  //   let commentPopup = $$('commentPopup');
  //   let commentList = commentPopup.queryView('list');
  //
  //   (data.total > 0) ? commentLabel.config.badge = data.total : commentLabel.config.badge= '';
  //   commentList.clearAll();
  //   commentList.parse(data);
  //   commentLabel.refresh();
  // }

  setTotalAccounts(data) {
    let totalAccountsLabel = this.$$('totalAccountsLabel');
    totalAccountsLabel.setValue(data.total);
    (data.total >= 0) ? totalAccountsLabel.define("color","white") : totalAccountsLabel.define("color","red");
    totalAccountsLabel.refresh();
  }

	doClickBalance(id, view) {
		//debugger;
		let scope = this;
    if (!this.win) {
      this.win = webix.ui({
        view: "window",
        modal:true,
        head:{
          cols:[
            {template:"Остатки на счетах", type:"header", borderless:true},
            {view:"icon", icon:"mdi mdi-fullscreen", tooltip:"enable fullscreen mode", click: function(){
              if(scope.win.config.fullscreen){
                webix.fullscreen.exit();
                this.define({icon:"mdi mdi-fullscreen", tooltip:"Enable fullscreen mode"});
              }
              else{
                webix.fullscreen.set(scope.win);
                this.define({icon:"mdi mdi-fullscreen-exit", tooltip:"Disable fullscreen mode"});
              }
              this.refresh();
            }},
            {view:"icon", icon:"wxi-close", tooltip:"Close window", click: function(){
              scope.win.hide();
            }}
          ]
        },
        localId: "win2",
        height: 550,
        width: 500,
        position:"center",
        body: {
          rows: [
						{
							view: "datatable",
              scrollX: false,
              hover: "myhover",
              scheme: {
                $sort:{ by:"name", dir:"asc" },

              },
							columns: [
								{'id' : 'name', 'header' : 'Счета', "fillspace": true},
								{'id' : 'balance', 'header': {content: "summColumn", css: {"text-align": "right"}}, css: {"text-align": "right"}, format: webix.Number.format, "adjust": false},

							],
              url: "api->accounting/transaction/summaryaccount",
							//url: scope.app.config.apiRest.getUrl('get','accounting/transaction/summaryaccount')
						}
					]
        }
      });
    }

		if (!this.win.isVisible()) {
			this.win.show();
		} else {
      this.win.hide();
		}
	}


}