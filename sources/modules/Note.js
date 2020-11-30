wxPIM.moduleClasses.Notes = class {

    getUIConfig() {
        const cssListItem = `
             color : #000000;
             height : 66px;
             border : 1px solid #000000;
             border-radius : 8px;
             margin : 8px 10px 12px 4px;
             overflow : hidden;
             padding : 6px 6px 20px 6px;
             box-shadow : 4px 4px #aaaaaa;
             cursor : hand;
             `;
        newHandler() {
            wxPIM.isEditingExisting = false;
            wxPIM.editingID = new Date().getTime();
            $$("moduleNotes-details").show();
            $$("moduleNotes-detailsForm").clear();
            $$("moduleNotes-detailsForm-text").setValue("");
            $$("moduleNotes-detailsForm-color").setValue("#ffd180");
            $$("moduleNotes-deleteButton").disable();
        }

        refreshData() {
            const dataItems = wxPIM.getModuleData("Notes");
            const itemsAsArray = wxPIM.objectAsArray(dataItems);
            wxPIM.sortArray(itemsAsArray, "id", "D");
            $$("moduleNotes-items").clearAll();
            $$("moduleNotes-items").parse(itemsAsArray);
        }
}