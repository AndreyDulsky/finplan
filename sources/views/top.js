import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView{
	config(){
		const locale = this.app.getService("locale");
		const _ = locale._;
		const logout = {
			view:"button", label:"Выход", width: 120,
			click: () => this.show("/logout")
		};




		const header = {
			view:"toolbar",
			css:"webix_dark",
			elements:[
        {
          view: "icon", icon:"mdi mdi-menu",
          click: function() {
            $$("top:menu").toggle();
          }
        },
				{ view:"label", label:"Finance"}, // label:this.app.config.name }
				{
          width: 380,
					cols: [
            { view:"label",
              id: "totalAccountsLabel",
              label: "",

              template: "<div class='webix_el_box' ><a href='javascript: void(0);' style='line-height:32px; color: #color#; font-size: 12px; font-weight: normal; text-decoration: none; padding-right:0px;'>На счетах:  #label#</a><span class='webix_icon wxi-menu-down'></span> </div>",
							itemClick: this.doClickBalance
            },
            {
              view:"icon", icon: 'mdi mdi-arrow-down',
              width: 150,
              id: "totalAccounts",
              color: 'white',
              hover: "myhover",
              //template: "<button>#label#</button>",
              click: this.doClickBalance
            },

					]
				},
				logout,
				{
						view:"icon", icon: 'widget_icon wxi-drag',
						badge:12,
						popup: {
								view: 'contextmenu',
								data: [
										{ value: 'Profile', href: '#profile' },
										{ value: 'Settings', href: '#settings' },
										{ value: 'Dummy' },
										{ id: 'logout', value: 'Logout' },
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


		const menu = {
			view:"sidebar",
			id:"top:menu",
			css:"webix_sidebar webix_dark",
			//layout:"y",
      width: 200,
			select:true,
      collapsed: true,
      //collapsedWidth:43,
      activeTitle: true,
      //position:"right",
      multipleOpen:true,

      //template:"<span  class='mdi #icon#' style='font-size:24px;'></span>#value#",
			//template: "<i class='material-icons md-36 md-light'>#icon#</i>",
			data:[
				{ value:"Главная", id:"start", icon:"mdi mdi-view-dashboard" },
				{ value:"Операции", id:"transaction",  icon:"mdi mdi-table" },
        { value:"Проводки", id:"register",  icon:"mdi mdi-calendar" },

				{ value:"Справочники",  icon:"mdi mdi-puzzle",
					data: [{ value:"Контрагенты", id:"contragents-directory",  icon:"mdi  mdi-puzzle" }]
				},
        { value:"Отчеты",  icon:"mdi mdi-puzzle",
          data: [
          	{ value:"Движение денег", id:"report-cash-flow",  icon:"mdi  mdi-puzzle" },
            { value:"Движение денег (График)", id:"report-cash-flow-chart",  icon:"mdi  mdi-puzzle" },
            { value:"ОСВ", id:"report",  icon:"mdi mdi-puzzle" },
          	]
        },
        //{ value:"Firebase", id:"firebase",  icon:"mdi  mdi-puzzle" },
        { value:"Настройки", id:"settings",  icon:"mdi mdi-settings" },
        { value:"Открытые отчеты", id:"info", icon:"wxi-pencil", data:[] },
			]

		};

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
    webix.ajax().get( urlSummaryAccount).then(function(data) {
      scope.setTotalAccounts(data.json());
    });

    $$('totalAccountsLabel').attachEvent("onItemClick", function(id, e){
      scope.doClickBalance();
      // code
    });
	}

  setTotalAccounts(data) {

    let totalAccountsLabel = $$('totalAccountsLabel');

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
        localId: "win1",
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