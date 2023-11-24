const jwt = require("jsonwebtoken")

function checkAuthMiddleware(req,res,next){
    let headers = req.headers
    let token = headers['token'].split('bearer ')[1]
    let decoded = jwt.verify(token, process.env.TOKEN_KEY)
    console.log (decoded?.user_id)
    if (decoded?.user_id == headers?.id) {
        next()
    }else{
        res.status(401).json({ "success": false, message: "UnAuthorized Access!"})
    }
}
module.exports = {
    checkAuthMiddleware
}