import {JetView, plugins} from "webix-jet";


let formatDate = webix.Date.dateToStr("%d.%m.%y");
let formatTime = webix.Date.dateToStr("%H.%i");
export default class TopView extends JetView{
	config(){
		const locale = this.app.getService("locale");
		const _ = locale._;
		const logout = {
			view:"button", label:"Выход", width: 120,
			click: () => this.show("/logout")
		};
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
				logout,
				{
						view:"icon", icon: 'widget_icon wxi-drag',
						//badge:12,
            localId: "commentLabel",
						popup: {
								view: 'list',
                //scroll: true,
                //width :300,
								data: [
										//{ value: 'Profile', href: '#profile' },
										//{ value: 'Сообщения', id: 'settings', badge:12 },
										//{ value: 'Dummy' },
										//{ id: 'logout', value: 'Logout' },
								],
								on: {
										onMenuItemClick(id) {
												if (id === 'logout')
														webix.message('Loging out...');
										}
								}
						}
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

		menu['data'].push({ value:"Настройки", id:"settings",  icon:"mdi mdi-tools" },)
    menu['data'].push({ value:"Открытые отчеты", id:"info", icon:"mdi mdi-folder-open", data:[] })



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
    let urlSummaryAccount = this.app.config.apiRest.getUrl('get','accounting/transaction/summaryaccount');
    // webix.ajax().get( urlSummaryAccount).then(function(data) {
    //   scope.setTotalAccounts(data.json());
    // });
    let user = webix.storage.local.get("wjet_user");
    let userId = user.user_id;
    let urlMessage = this.app.config.apiRest.getUrl('get','accounting/comment/comment-view'
      );
    webix.ajax().get( urlMessage).then(function(data) {
      scope.setComments(data.json());
    });

    this.$$('totalAccountsLabel').attachEvent("onItemClick", function(id, e){
      scope.doClickBalance();
      // code
    });


	}

  setComments(data) {
    let commentLabel = this.$$('commentLabel');
    (data.total > 0) ? commentLabel.config.badge = data.total : commentLabel.config.badge= '';
    let commentData = [];
    // data.data.forEach( function(row) {
    //   commentData.push({
    //     'title': formatDate(row['time_comment']),
    //     'id' : formatDate(row['time_comment'])+'_'+row['id']
    //   });
    //   commentData.push({
    //     'title': formatTime(row['time_comment'])+': №'+row['order_no']+' '+row['comment'],
    //     'id' : row['id']
    //   });
    // });

    let scope = this;
    commentLabel.config.popup = {
      view:"popup",
      width:500,
      localId: 'commentPopup',
      body: {
        view:"list",
        type:{
          height: 67,
          template:"#time_comment#<br/> №#order_no# - #comment#",
        },
        data: data.data,
        on: {
          onItemClick:function (id, e, trg) {
            let urlMessage = scope.app.config.apiRest.getUrl('get','accounting/comment/comment-view-ok', {'id' : id});
            this.hide();
            webix.ajax().get( urlMessage).then(function(data) {

              scope.setComments(data.json());

            });

          }
        }
      }
    };

    commentLabel.refresh();
  }

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