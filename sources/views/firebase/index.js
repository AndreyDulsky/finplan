import {JetView} from "webix-jet";



export default class FirebaseView extends JetView {
  config() {
    //var db = firebase.firestore();
    //db.settings({ timestampsInSnapshots:true });

    //webix.firestore = db;

    //webix.firebase = firebase.database();
    //var proxy = webix.proxy("firebase", db.ref("transaction"));

    return {
      localId: 'firebase-table',
      view:"treetable",
      autoConfig:true,
      select: "row",
      editable: true,
      editaction: "dblclick",

      // columns: [
      //   {id: 'id', header: ['ID']},
      //   {id: 'name', header: ['Name'], editor: "text"},
      //   {id: 'value', header: ['Value'], editor: "text"}
      // ],


      // load data from "books" collection
      url: "firebase->transaction",
      //save data to "books" collection
      save:"firebase->transaction/data"
    }
  }

  init(view){
    let table = this.$$('firebase-table');

    // let refConfig = webix.firebase.ref("configTableUser/transaction/config/columns");
    // debugger;
    // refConfig.get().then(function(data) {
    //   table.define('columns', data.val());
    //   let ref = webix.firebase.ref("transaction");
    //   table.sync(ref);
    // });



  }
}