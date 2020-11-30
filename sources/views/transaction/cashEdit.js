import {JetView} from "webix-jet";
import {accounts} from "models/transaction/accounts";
import {contragents} from "models/transaction/contragents";
import {projects} from "models/transaction/projects";
import {categories} from "models/transaction/categories";
//import {cashes} from "models/cashes";
import "components/comboClose";

class User {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }

}



export default class CashEditView extends JetView {
    config(){
        return {
            view: "window",
            //css:{"background":"#ccc !important"},
            position: function(state){
                state.left = 52;
                state.top = 41;
                state.width = state.maxWidth/3;
                state.height = state.maxHeight-41;
            },
            head:"Редактирование операции",
            close: true,
            modal:true,
            body:{
                "view": "form",
                "localId":"my_form1",
                "margin": 40,
                scroll : "auto",
                "elements": [
                    {
                        "margin": 10,
                        "rows": [
                            { view:"text", name: "id", width:150, hidden: true },
                            { view:"segmented", "name":"type_operation", value: 1, inputWidth:320, options:[
                                    { id:1, value:"Поступление" },
                                    { id:2, value:"Расход"},
                                    { id:3, value:"Перемещение"}
                                ],
                                align:"center"
                            },

                            { "localId": "label_move_from","label": "Откуда", "view": "label", "height": 38, "css" : {"text-align": "center"}, hidden: true },

                            {
                                "cols": [
                                    {
                                        "label": "Дата оплаты",
                                        "value": new Date(),
                                        "view": "datepicker",
                                        "labelWidth": 100,
                                        "name":"date_operation" ,
                                        "timepicker":true,
                                        "stringResult":true
                                    },
                                    { "name":"is_committed", "view": "checkbox", "width": 40, value: true, checkValue:1, uncheckValue: 2 },
                                    { "label": "Подтвердить оплату", "view": "label" }
                                ]
                            },
                            {
                                "label": "Счет",
                                "name":"account_id",
                                "localId" : "account",
                                "value": "",
                                "options" : accounts ,
                                "placeholder" : "Выберите счет",
                                "view": "combo",
                                "height": 38,
                                "labelWidth": 100,
                                required: true,
                                invalidMessage:"Значение не может быть пустым!"
                            },

                            {
                                "height": 38,

                                "cols": [
                                    {
                                        "name":"value",
                                        "label": "Сумма",
                                        "view": "text",
                                        "height": 0,
                                        "labelWidth": 100,
                                        "value":0,
                                        "placeholder" : "0.00",
                                        format:"1 111.00",
                                        validate: webix.rules.isNumber,
                                        invalidMessage:"Field can not be empty",
                                        required: true
                                    },
                                    {
                                        "label": "UAH (Украинская гривна)",
                                        "view": "label",
                                        "height": 36
                                    }
                                ]
                            },
                            {
                                "localId": "label_value_break",
                                "template": "<a class='show-combo-value-break' href='javascript:void(0);'>Разбить сумму</a>",
                                "height": 20,
                                "css" : {"padding-left": "100px", "margin-top": "0px !important"},
                                "hidden": false,
                                onClick:{
                                    "show-combo-value-break":function(e, id){
                                        var combo = this.$scope.$$("combo_value_break");
                                        if (combo.isVisible()) {
                                            this.$scope.$$("combo_value_break").hide();
                                        } else {
                                            this.$scope.$$("combo_value_break").show();
                                        }
                                    }
                                },
                            },
                            {
                                "hidden":  true ,
                                "name":"type_part_id",
                                "localId" : "combo_value_break",
                                "value": "",
                                "options" : [
                                    {"id": 1, "value" : "Выберите как разбить сумму" },
                                    {"id": 2, "value" : "Контрагент" },
                                    {"id": 3, "value" : "Статья" },
                                    {"id": 4, "value" : "Проект" },
                                    {"id": 5, "value" : "Контрагент, Статья" },
                                ] ,
                                "placeholder" : "Выберите как разбить сумму",
                                "view": "combo",
                                "height": 38,
                                "css" : {"padding-left": "100px", "margin-top": "0px !important"},
                                "width" : 230,
                                "on": {
                                    onChange:function(newv){
                                        this.$scope.$$("table_part_value").showColumnBatch(newv);
                                        if (newv > 1) {
                                            this.$scope.$$("layout_part_value").show();
                                        } else {
                                            this.$scope.$$("layout_part_value").hide();
                                            this.$scope.$$("table_part_value").clearAll();
                                        }
                                    }
                                }
                            },
                            {
                                "localId" : "layout_part_value",
                                "padding" : 30,
                                "css" : {"background" : "#f7fafb"},
                                "hidden" : true,
                                rows: [
                                    {
                                        "localId": "table_part_value",
                                        "view": "datatable",
                                        "css": "webix_header_border webix_data_border",
                                        "columns":[
                                            { id:"id", header: "", hidden: true },
                                            { id:"index", header: "#", width :20 },
                                            {
                                                id:"contragent_id",
                                                editor:"combo",
                                                header:"Контрагент" ,
                                                options: contragents,
                                                fillspace : true
                                            },
                                            { id:"category_id", editor:"combo", options: categories,	header:"Статья",adjust: true, hidden : true,  batch:'3'},
                                            { id:"project_id",	editor:"combo", options: projects, header:"Проект" , adjust: true,  hidden : true,  batch:'4'},
                                            { id:"value",	editor:"text", header:"Сумма", 	width:100,	sort:"int", "css" : {"text-align" : "right"}},
                                            { id:"part_procent",	header:"Доля,%", 	width:70, "css" : {"text-align" : "right", math:"[$r,value]"}},
                                            { id:"action-delete-part", 	header:"", 	width:40, "template" : '{common.trashIcon()}'  },
                                        ],
                                        "editable":true,
                                        "headerRowHeight": 25,
                                        "rowHeight": 25,
                                        "scroll": false,
                                        "width": 300,
                                        //"minHeight" : 60,
                                        "autoheight":true,
                                        math: true,

                                        scheme:{
                                            $init:function(obj){ obj.index = this.count()+1; }
                                        },
                                        on:{
                                            onItemClick: function(id, e, trg) {
                                                if (id.column == 'action-delete-part') {
                                                    this.remove(id);
                                                }
                                            }
                                        },
                                    },{

                                        cols: [{
                                            "borderless": true,
                                            "localId": "label_add_row_table",
                                            "template": "<a class='add-to-table' href='javascript:void(0);'>Добавить...</a>",
                                            "height": 20,
                                            "css" : {"margin-top": "0px !important", "background" : "#f7fafb"},
                                            "hidden": false,
                                            onClick:{
                                                "add-to-table":function(e, id){
                                                    var table = this.$scope.$$("table_part_value");
                                                    table.add({"contragent_id" : "", "category_id" : "", "project_id" : "", "value" : "0.00" });
                                                }
                                            },
                                        },
                                            {
                                                "borderless": true,
                                                "localId": "label_add_row_table",
                                                "template": "<strong>Итого</strong>",
                                                "height": 20,
                                                "width" : 100,
                                                "css" : {"text-align": "right", "background" : "#f7fafb"},
                                            },
                                            {
                                                "borderless": true,
                                                "localId": "label_add_row_table",
                                                "template": "0.00",
                                                "height": 20,
                                                "width" : 100,
                                                "css" : {"text-align": "right", "background" : "#f7fafb"},
                                            },

                                            {
                                                "borderless": true,
                                                "localId": "label_add_row_table",
                                                "template": "0.00",
                                                "height": 20,
                                                "width" : 70,
                                                "css" : {"text-align": "right", "background" : "#f7fafb"},
                                            },
                                            {
                                                "borderless": true,
                                                "localId": "label_add_row_table",
                                                "template": "",
                                                "height": 20,
                                                "width" : 40,
                                                "css" : {"text-align": "right", "background" : "#f7fafb"},
                                            },

                                        ]

                                    }
                                ]


                            },
                            {
                                "label": "Контрагент1",
                                "name":"contragent_id",
                                "localId" : "contragent",
                                "value": "1",
                                "options" : contragents,
                                "view": "combo-close",
                                "height": 38,
                                "labelWidth": 100,
                                "placeholder" : "Выберите контрагента1",
                            },
                            {
                                "label": "Статья1",
                                "name":"category_id",
                                "localId" : "category",
                                "value": "1",
                                "options" : categories,
                                "view": "combo",
                                "height": 38,
                                "labelWidth": 100,
                                "placeholder" : "Выберите статью",
                            },
                            // moved
                            { "localId": "label_move_to", "label": "Куда", "view": "label", "height": 38, "css" : {"text-align": "center"}, hidden: true },
                            {
                                "label": "Счет",
                                "name":"account_move_id",
                                "localId" : "account",
                                "value": "",
                                "options" : accounts ,
                                "placeholder" : "Выберите счет",
                                "view": "combo",
                                "height": 38,
                                "labelWidth": 100,
                                hidden: true,
                                required: true,
                                invalidMessage:"Значение не может быть пустым!"
                            },
                            // end moved
                            {
                                "label": "Проект",
                                "name":"project_id",
                                "localId" : "project",
                                "value": "1",
                                "options" : projects,
                                "view": "combo",
                                "height": 38,
                                "labelWidth": 100,
                                "placeholder" : "Выберите проект",
                            },
                            {
                                "name":"comment",
                                "label": "Назначение платежа1",
                                "view": "text",
                                "height": 52,
                                "labelWidth": 100 ,
                                "placeholder" : "Введите комментарий",
                            }
                        ]
                    },
                    {
                        "margin": 10,
                        "cols": [
                            { "view": "template", "template": " ", "role": "placeholder", "borderless": true },
                            { "view": "button", "label": "Отмена", "css": "webix_transparent", "align": "right", "width": 120 },
                            { "view": "button", "css": "webix_primary", "label": "Сохранить", "align": "right", "width": 120, click: () => this.doClickSave() }
                        ]
                    }
                ],
                // on:{
                //     "onChange" : function(newv, oldv) {
                //         webix.message("Value changed from: "+oldv+" to: "+newv);
                //     }
                // },
            },
        };
    }

    init(view){

        if ($$('table1')) {
            this.$$('my_form1').bind('table1');
        }
        this.attachFormEvents();

    }

    attachFormEvents() {
        var typeOperation = this.$$('my_form1').elements["type_operation"];
        //change type_operation
        //if type_operation = move =3
        const TYPE_OPERATION_MOVE = 3;
        typeOperation.attachEvent("onChange", function(newv, oldv){
            //show label_move_from, label_move_to, account_move_id
            //hide contragent_id, category_id, label_value_break
            if (newv === TYPE_OPERATION_MOVE) {
                this.$scope.$$("label_move_from").show();
                this.$scope.$$("label_move_to").show();
                this.getFormView().elements["account_move_id"].show();
                this.getFormView().elements["contragent_id"].hide();
                this.getFormView().elements["category_id"].hide();
                this.$scope.$$("label_value_break").hide();

            } else {
                this.$scope.$$("label_move_from").hide();
                this.$scope.$$("label_move_to").hide();
                this.getFormView().elements["account_move_id"].hide();
                this.getFormView().elements["contragent_id"].show();
                this.getFormView().elements["category_id"].show();
                this.$scope.$$("label_value_break").show();
            }
        });

    }

    showParts(selectedItem) {
        var tableParts = this.$$("table_part_value");
        tableParts.clearAll();
        if (!selectedItem) {
            return;
        }

        for (var key in selectedItem.data) {
            tableParts.add(selectedItem.data[key]);
        }


    }

    showWindow(action){
        this.showParts($$('table1').getSelectedItem());
        this.$$('my_form1').clearValidation();
        this.$$("my_form1").attachEvent("onBindApply", function(){
            // makes the preview template empty
            if ($$('table1').getCursor() == null) {
                this.setValues({
                    id: null,
                    date_operation: new Date(),
                    is_committed : 1,
                    type_operation: 2
                });
            }
        });

        if (action == 'create') {
            //this.$$("my_form1").reconstruct();
        } else {
            var typeOperation = $$('table1').getSelectedItem().type_operation;
            if (typeOperation == 4) {
                return;
            }

            if ($$('table1').getSelectedItem() && $$('table1').getSelectedItem().data) {
                this.$$("combo_value_break").show();
                //this.$$("combo_value_break").setValue($$('table1').getSelectedItem().type_part_id);

            } else {
                this.$$("combo_value_break").setValue(1);
                this.$$("combo_value_break").hide();
            }
        }
        this.getRoot().show();
    }

    doClickSave() {

        //dp.define('updateFromResponse', true);

        if (this.$$('my_form1').validate()) {

            var values = this.$$('my_form1').getValues();
            var id = values['id'];
            var myformat = webix.Date.dateToStr("%Y-%m-%d");
            //values['date_operation'] = myformat(values['date_operation']);

            var url = "http://admin.startsellshop.local/api/accounting/transactions";
            var key = "auth_token=7110eda4d09e062aa5e4a390b0a572ac0d2c02206";
            //debugger;
            var record = {
                "type_operation": values['type_operation'],
                "date_operation": values['date_operation'],
                "is_committed": values['is_committed'],
                "value": values['value'],
                "comment": values['comment'],
                "value_in_user_currency" : values['value'],
                "currency_id" :1,
                "account_id" : values['account_id'],
                "account_move_id" : values['account_move_id'],
                "category_id" : values['category_id'],
                "contragent_id" : values['contragent_id'],
                "project_id" : values['project_id'],
                "account" : { name: this.$$("account").getText() },
                "category" : { name: this.$$("category").getText() },
                "contragent" : { id: values['contragent_id'],name: this.$$("contragent").getText() },
                "project" : { name: this.$$("project").getText()},
                "type_part_id" : values['type_part_id'],
                "id" : values['id']
            };
            //values = JSON.stringify(record);

            var view = this;
            if (id) {
                record = {
                    "type_operation": values['type_operation'],
                    "date_operation": values['date_operation'],
                    "is_committed": values['is_committed'],
                    "value": values['value'],
                    "comment": values['comment'],
                    "value_in_user_currency" : values['value'],
                    "currency_id" :1,
                    "account_id" : values['account_id'],
                    "account_move_id" : values['account_move_id'],
                    "category_id" : values['category_id'],
                    "contragent_id" : values['contragent_id'],
                    "project_id" : values['project_id'],
                    "account" : this.$$("account").getText(),
                    "category" : this.$$("category").getText(),
                    "contragent" : this.$$("contragent").getText(),
                    "project" :  this.$$("project").getText(),
                    "type_part_id" : values['type_part_id'],
                    "id" :  parseInt(id)
                };
                var parts = this.getParts();
                record['data'] = parts;

                webix.dp($$("table1")).save(
                    id,
                    "update",
                    record
                ).then(function(obj){
                    webix.dp($$("table1")).ignore(function(){
                        $$("table1").updateItem(id, record);
                        //$$("table1").sort("date_operation", "desc", "string");
                        //$$("table1").markSorting("date_operation", "desc");
                    });
                    view.getRoot().hide();
                }, function(){
                    webix.message("Data were not saved");
                });


                view.getRoot().hide();

            } else {
                var parts = this.getParts();
                record['data'] = parts;
                webix.dp($$("table1")).save(
                    webix.uid(),
                    "insert",
                    record
                ).then(function(obj){
                    webix.dp($$("table1")).ignore(function(){
                        record.id = obj.id;
                        $$("table1").add(record,0);
                        $$("table1").select(record.id);
                        $$("table1").scrollTo(0, 0);
                        //$$("table1").sort("date_operation", "desc", "string");
                        //$$("table1").markSorting("date_operation", "desc");
                     });
                    view.getRoot().hide();
                }, function(){
                    webix.message("Data were not saved");
                });
            }
        }

    }

    getParts() {
        var tableParts = this.$$("table_part_value");
        var records = tableParts.serialize();
        var parts = [];
        for (var key in records) {
            parts.push(records[key]);
        }
        return parts;
    }


}
