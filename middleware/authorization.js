const jwt = require('jsonwebtoken');
const UserModal = require('../model/user')

module.exports = async function checkToken(req, res, next) {
    const token = req.header('authorization')
    console.log("token",token)
    if (!token) return res.json({ statusCode: 401, statusMsg: "Access denied. No token provided" })
    try {
        const decoded = jwt.verify(token, 'User');
        const isAuthorize = await UserModal.findById(decoded.result);
        if (isAuthorize.role === 1 || isAuthorize.role === 2) {
            req.user = decoded.result;
            next()
        }else{
            return res.json({statusCode:400,statusMsg:"Invalid user"})
        }
    } catch (error) {
        console.log("error", error)
        res.json({ statusCode: 401, statusMsg: "Access denied. Invalid token provied" })
    }

}