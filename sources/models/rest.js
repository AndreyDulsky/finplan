export  function getRestUrl(type, url, id){
    const authKey = '7110eda4d09e062aa5e4a390b0a572ac0d2c02206';
    const authKeyName = 'auth_token';
    const urls = {
        'get': url+'&'+authKeyName+"="+authKey,
        'create': url+'?'+authKeyName+"="+authKey,
        'put':  url+'/'+id+'?'+authKeyName+"="+authKey,
        'delete': url+'/'+id+'?'+authKeyName+"="+authKey,
    };
    return urls[type];
}