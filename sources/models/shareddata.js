
export function sharedData(name){
    return webix.ajax(name).then(a => a.json());
}