import {JetView, plugins} from "webix-jet";

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

              template: "<div class='webix_el_box' ><a href='javascript: void(0);' style='line-height:32px; color: #color#; font-size: 12px; font-weight: normal; text-decoration: none; padding-right:0px;'>На счетах:  #label#</a><span class='webix_icon wxi-menu-down'></span> </div>",
							itemClick: this.doClickBalance
            },
            {
              view:"icon", icon: 'mdi mdi-arrow-down',
              width: 150,
              localId: "totalAccounts",
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
                scroll: true,
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
				{ value:"Производство", icon:"mdi mdi-view-dashboard",
          data: [
            { value:"План производства", id:"start", icon:"mdi mdi-circle-outline" },
            { value:"План результат", id:"order-result", icon:"mdi mdi-circle-outline" },
            { value:"План столярка", id:"order-carpenter", icon:"mdi mdi-circle-outline" },
            { value:"План швейка+крой", id:"order-sewing-cut", icon:"mdi mdi-circle-outline" },
            { value:"План швейка", id:"order-sewing", icon:"mdi mdi-circle-outline" },
            { value:"План крой", id:"order-cut", icon:"mdi mdi-circle-outline" },
            { value:"Заказы", id:"order", icon:"mdi mdi-circle-outline" },
            { value:"Посещения", id:"time-work-by-day", icon:"mdi mdi-circle-outline" },

          ]
        },
				{ value:"Операции", id:"transaction",  icon:"mdi mdi-table" },
        { value:"Проводки", id:"register",  icon:"mdi mdi-account" },

				{ value:"Справочники",  icon:"mdi mdi-cube",
					data: [
					  { value:"Контрагенты", id:"contragents-directory",  icon:"mdi mdi-circle-outline" },
            { value:"Ставки по выработке", id:"product-work-salary", icon:"mdi mdi-circle-outline" },
            { value:"Продукция", id:"products-bed", icon:"mdi mdi-circle-outline" },
            { value:"Ткани", id:"cloth-directory", icon:"mdi mdi-circle-outline" },
            { value:"Сотрудники", id:"employee-directory", icon:"mdi mdi-circle-outline" },
            { value:"Отделы", id:"department-directory", icon:"mdi mdi-circle-outline" },
            { value:"Типы зарплат", id:"employee-salary-type-directory", icon:"mdi mdi-circle-outline" },
            { value:"Настройки", id:"setting-directory", icon:"mdi mdi-circle-outline" },

          ]
				},
        { value:"Отчеты",  icon:"mdi mdi-chart-bar",
          data: [
          	{ value:"Движение денег", id:"report-cash-flow",  icon:"mdi mdi-circle-outline" },
            { value:"Движение денег (График)", id:"report-cash-flow-chart",  icon:"mdi mdi-circle-outline" },
            { value:"ОСВ", id:"report",  icon:"mdi mdi-circle-outline" },
            { value:"ЗП", id:"report-salary",  icon:"mdi mdi-circle-outline" },

          ]
        },
        { value:"Зарплата",  icon:"mdi mdi-cube",
          data: [
            { value:"Начисление зарплаты", id:"list-salary-accrual", icon:"mdi mdi-circle-outline" },
            { value:"Зарплатная ведомость", id:"report-salary-total", icon:"mdi mdi-circle-outline" },
          ]
        },

        //{ value:"Firebase", id:"firebase",  icon:"mdi  mdi-puzzle" },
        { value:"Настройки", id:"settings",  icon:"mdi mdi-tools" },
        { value:"Открытые отчеты", id:"info", icon:"mdi mdi-database", data:[] },
			],
      


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

    this.$$('totalAccountsLabel').attachEvent("onItemClick", function(id, e){
      scope.doClickBalance();
      // code
    });


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