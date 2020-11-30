import {JetView} from "webix-jet";

var small_film_set = [
  { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1, category:"Thriller"},
  { id:2, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2, category:"Crime"},
  { id:3, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3, category:"Crime"},
  { id:4, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4, category:"Western"},
  { id:5, title:"Pulp fiction", year:1994, votes:533848, rating:8.9, rank:5, category:"Crime"},
  { id:6, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6, category:"Western"}
];

export default class StartView extends JetView{


	config(){
    let url = this.app.config.apiRest.getUrl('get',"accounting/orders", {"per-page": "10", sort: '[{"property":"A","direction":"DESC"}]'});

		return {
			rows:[
				{ type:"header", template:"Dashboard"},
				/*wjet::Settings*/
        {
          view:"datatable",
          css:"webix_header_border webix_data_border",
          //leftSplit:1,
          //rightSplit:2,
          select: true,
          resizeColumn: { headerOnly:true },
          localId: 'start-table',
          columns:[
             {
              id:"A", header:"#",	width:50
              // template:function(obj, common, value, config){
              //   if (obj.$level == 1) return common.treetable(obj, common) + obj.A ;
              //   return obj.I;
              // }
            },
            // {
            //   id:"created", header:"Date"
            // },
            { id:"B", header:"B", width:100 },
            { id:"C", header:"C", width:100 },
            { id:"D", header:"D", width:100 },

            { id:"I", header:"I", width:300 },
            { id:"J", header:"J", width:100 },
            { id:"K", header:"K", width:50 },
            { id:"L", header:"L", width:50 },
            { id:"M", header:"M", width:100 },
            { id:"N", header:"N", width:100 },
            { id:"O", header:"O", width:100 },
            { id:"P", header:"P", width:100 },
            { id:"Q", header:"Q", width:100 },
            { id:"R", header:"R", width:100 },
            { id:"S", header:"S", width:100 },
            //{ id:"T", header:"T", width:100 },
            { id:"U", header:"U", width:100 },
            { id:"V", header:"V", width:100 },
            { id:"W", header:"W", width:100 },
            { id:"X", header:"X", width:100 },
            { id:"Y", header:"Y", width:100 },
            { id:"Z", header:"Z", width:100 }
          ],
          scheme:{
            // $group:{
            //   by:"A", // 'company' is the name of data property
            //   // row:function(obj){
            //   //   return "#"+obj.A+", Клиент: "+obj.F+", Тип:"+obj.E+" Сумма:"+obj.G;
            //   // },
            //   missing:false,
            //   map:{
            //     B:["B"],
            //     C:["C"],
            //     D:["D"],
            //     F:["F"],
            //     E:["E"],
            //     G:["G"],
            //     H:["H"],
            //
            //
            //   }
            // },
            //$sort:{ by:"value", dir:"desc" },

            $init:function(item) {
              if (item.B == 4)
                item.$css = "highlight";
              if (item.B == 3)
                item.$css = "highlight-blue";
              if (item.B == 2)
                item.$css = "highlight-green";
            }
          },
          ready:function(){
            var state = webix.storage.local.get("treetable_state");
            if (state)
              this.setState(state);
          },
          scroll: true,
          url: function(){

            return webix.ajax(url).then(function(data) {
              return  data.json().items;
            });


          },

          on: {
            "onColumnResize" : function() {
              webix.storage.local.put("treetable_state", this.getState());
            },
            onBeforeLoad:function(){
              this.showOverlay("Loading...");
            },
            onAfterLoad:function(){
              this.hideOverlay();
            }
          }

        }
			]
		}
	}

	init(view) {
    // let table = this.$$("start-table");
    // let tableUrl = this.app.config.apiRest.getUrl('get',"accounting/orders", {"per-page": "10", sort: '[{"property":"A","direction":"DESC"}]'});
    //
    // let scope =this;
    // webix.ajax(tableUrl).then(function(data) {
    //   let result = data.json().items;
    //   table.parse(result);
    //
    // });

    //scope.changeColumns(dateFrom, dateTo);
    //table.clearAll();
    //table.load(tableUrl);
  }
}