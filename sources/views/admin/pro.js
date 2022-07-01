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
          view:"spreadsheet",
          id:"ssheet",
          toolbar: "full",
          data:{
            "styles": [
              ["top","#FFEFEF;#6E6EFF;center;'PT Sans', Tahoma;17px;"],
              ["subtop","#818181;#EAEAEA;center;'PT Sans', Tahoma;15px;;;bold;;;0-0-0-0,;"],
              ["count","#818181;#EAEAEA;center;'PT Sans', Tahoma;15px;;;;;;0-0-0-0,;"],
              ["calc-top","#818181;#EAEAEA;;'PT Sans', Tahoma;15px;;;bold;;;0-0-0-0,;"],
              ["calc-other","#818181;#EAEAEA;;'PT Sans', Tahoma;15px;;;bold;;;0-0-0-0,;"]
            ],
            "data": [
              [1, 1, "Report 2015", "top"],
              [2, 1, "Countries:", "subtop"],
              [3, 1, "={{value}}", "count"],
              [2, 2, "Expense", "count"],
              [3, 2, "={{expense}}"],
              [2, 3, "Income", "count"],
              [3, 3, "={{income}}"],
              [2, 6, "Total:", "calc-top"],
              [3, 6, "=B3-C3"],
              [2, 7, "Std Deviation:", "calc-top"],
              [3, 7, "=STDEVP(B3:C3)"]
            ],
            "spans": [
              [1, 1, 3, 1]
            ],
            "sizes":[
              [0, 7, 130],
              [0, 8, 200],
              [0, 5, 20],
              [0, 4, 20]
            ]
          }
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
    let scope = this;

    $$('ssheet').hideGridlines(true);
    $$("ssheet").hideHeaders(true);

    this.tableUrl = this.app.config.apiRest.getUrl('get',"accounting/employee-salaries", {'sort' : 'sort: date_salary', 'expand':'documentSalaryAccrual, employee,transactionPart', 'per-page': -1});
    let filter = {
      filter: {'employee_id' : 24}
    };
    webix.ajax().get(this.tableUrl, filter ).then(function(data) {
      //scope.$$('ssheet').clearAll();
      let items = data.json();
      let values = [];

      items.data.forEach((row, rowKey) => {
        let keyRow = rowKey+1;
        if (rowKey == 0) {
          items.config.columns.forEach((itemCol, colKey) => {
            let cell = [1, colKey + 1, itemCol.header[0], 'subtop'];
            values.push(cell);
          });
        }
        items.config.columns.forEach((itemCol, colKey) => {
          let cell = [keyRow + 1, colKey + 1, row[itemCol.id]];
          values.push(cell);
        });

      });
      let styles = [["subtop","#818181;#EAEAEA;center;'PT Sans', Tahoma;13px;;;bold;;;0-0-0-0,;"]];
      let sizes = [
        [0, 7, 130],
        [0, 1, 200],
        [0, 5, 20],
        [0, 4, 20]
      ];


      $$('ssheet').parse(/*<data>*/[{"name":"Sheet1","content":{ data:values, styles: styles, sizes: sizes }}]/*</data>*/);
      $$('ssheet').hideGridlines(true);
      //$$("ssheet").hideHeaders(true);

    });
  }
}