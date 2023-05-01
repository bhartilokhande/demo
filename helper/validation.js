
const validate = function (ReqKeyes, body) {
    let error = ""
    let errorExist = false;
    for(let i=0; i<ReqKeyes.length; i++){
        if(!body[`${ReqKeyes[i]}`] || body[`${ReqKeyes[i]}`] == null || body[`${ReqKeyes[i]}`] == undefined){
            error = `${ReqKeyes[i]} is required!`
            errorExist = true;
            break;
        }
    }
    return({
        error,
        errorExist
    })
}




module.exports = validate