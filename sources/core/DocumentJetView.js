import {JetView} from "webix-jet";
export default class DocumentJetView extends JetView {
  constructor(app, name, config){
    super(app, name);
    this.grid_config = config;
    this.name = name;
  }
  config(){
    return {
      view:"datatable",
      localId: this.name+"-table",
      //urlEdit: 'time-work',
      css:"webix_header_border webix_data_border",
      leftSplit:2,
      rightSplit:3,
      select: true,
      //scroll: "auto",
      resizeColumn: { headerOnly:true },
      columns: this.grid_config.columns,
      url: this.grid_config.url,
      save: this.grid_config.save,
      editable:true,
      editaction: "dblclick",
      math: true,
      hover:"myhover",
      on:{
        "data->onStoreUpdated":function(){
          this.data.each(function(obj, i){
            obj.index = i+1;
          })
        },
        onItemClick:function(id, e, trg) {

          if (id.column == 'action-delete') {
            var table = this;
            webix.confirm("Удалить запись?").then(function(result){
              webix.dp(table).save(
                id.row,
                "delete"
              ).then(function(obj){
                webix.dp(table).ignore(function(){
                  table.remove(id.row);
                });
              }, function(){
                webix.message("Ошибка! Запись не удалена!");
              });
            });

          }
        },
        onAfterEditStop:function(state, editor, ignoreUpdate){
          var dtable = this;
          if(state.value != state.old){
            dtable.addCellCss(editor.row, editor.column, "highlight");
            setTimeout(function(){
              dtable.removeCellCss(editor.row, editor.column, "highlight");
            }, 3000)
          }
        },
        onBeforeLoad:function(){
          this.showOverlay("Loading...");
        },
        onAfterLoad:function(){
          if (!this.count())
            this.showOverlay("Sorry, there is no data");
          else
            this.hideOverlay();
        },
      }
    };
  }
}