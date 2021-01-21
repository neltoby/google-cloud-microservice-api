module.exports = function buildmakeSource ({ validateIp }) {
    return function makeSource ({ ip, browser, referrer }) {
        if(!ip){
            throw {statusCode: 403, message: 'No IP address'}
        }
        if(!browser){
            throw {statusCode: 403, message: 'Browser could not be identified'}
        }
        if(!referrer){
            throw {statusCode: 400, message:'Missing Url'}
        }
        if(!validateIp(ip)){
            throw {statusCode: 403, message:'Invalid IP'}
        }
        return Object.freeze({
            getIp: () => ip,
            getBrowser: () => browser,
            getReferrer: () => referrer
        })
    }
}