export function promise(name) {
    return webix.ajax(name).then(res => {
        return res.json()
    });

}