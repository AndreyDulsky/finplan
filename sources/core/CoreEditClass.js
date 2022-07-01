import {getRestUrl} from "models/rest";

export class CoreEditClass {
    // this: Get url from config
    // this: Get config for form
    // this: Define collections for advince datas
    // get from view: Define create or Edit Form
    // view: define work instance
    // Get record for bind form
    // in view: Define events and login change elements
    // this: Define save methods

    constructor(owner) {
        this.$scope = owner;
        this.tableId = null;
        this.isUpdate = null;
        this.formEdit = null;
        this.formUrl = null;
        this.formConfig = {};
        this.formData = {};



    }

    actionUpdate(params) {

    }

    actionCreate(params) {

    }

    actionSave(params) {

    }


}

