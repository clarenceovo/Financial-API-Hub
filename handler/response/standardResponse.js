function getBody(body){
    let ret = body ?? []
    var ts = Date.now();

    let res ={
        "ts":ts,
        "data":ret
    };
    return  res
}

module.exports={
    
    res:(body)=>{
        return getBody(body)

    },
    voidParam:()=>{
        return this.res('Invalid Parameter');
    }
}