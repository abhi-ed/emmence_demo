const express = require("express");
const router = express.Router();
const uuid = require('uuid');
const {
    signUpSchema,
    loginSchema,
    logoutSchema
} = require("./validation");
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var rp = require("request-promise");
const { checkAuthMiddleware } = require("./middleWare");
router.get('/', (req, res) => {
    res.status(200).send("MY NODE APP")
})
// bookregistration payload (body in json)

// {
// "name": "demo_book",
// "book_description": "this is book description",
// "author": "author_name",
// "price":760
// }
router.post('/signUp', async (req, res) => {
    try {
        let validationError = []
        let body = req.body
        let { error, value:req_data } = signUpSchema(body)
        error ? validationError.push(error.details) : true
        if (validationError.length == 0) {
            let guid = uuid.v4()
            let generated_pasword = bcrypt.hashSync(req_data.password, bcrypt.genSaltSync(8), null)
            
            let insertData = await db.collection("users").insertOne({
                _id:guid,
                user_name: req_data.user_name,
                password:generated_pasword,
                logged_in:true
            })
            if (insertData.acknowledged) {
                let jwt_token = jwt.sign({ user_id: guid }, process.env.TOKEN_KEY);
                res.status(200).json({ "success": true, "data": {
                    _id:guid,
                    user_name: req_data.user_name,
                    logged_in:true
                }, token: jwt_token })
            }else {
                res.status(400).json({
                    success: false,
                    message: "Error while inserting record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Validation error !!",
                validationError: validationError
            })
        }
    } catch (e) {
        console.log("Internal server error ",e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})
router.post('/login', async (req, res) => {
    try {
        let validationError = []
        let body = req.body
        let { error, value:req_data } = loginSchema(body)
        error ? validationError.push(error.details) : true
        if (validationError.length == 0) {
            let findData = await db.collection("users").findOne({
                user_name: req_data.user_name
            },{user_name:1})
            console.log("findData",findData)
            if (findData) {
                let comparePassword = bcrypt.compareSync(req_data.password, findData.password);
                if(comparePassword){
                    delete findData?.password
                    let jwt_token = jwt.sign({ user_id: findData._id }, process.env.TOKEN_KEY);
                     await db.collection("users").updateOne({_id:findData._id},{
                        $set : {logged_in:true}
                    })
                    res.status(200).json({ "success": true, "data": {findData}, token: jwt_token })
                }else{
                    res.status(400).json({ "success": false, message: "No User Found !"})
                }
            }else {
                res.status(400).json({
                    success: false,
                    message: "No User Found !"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Validation error !!",
                validationError: validationError
            })
        }
    } catch (e) {
        console.log("Internal server error ",e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

// updatebook payload (body in json)

// {
// "id":"9ef7e1d8-358f-47b7-a145-50743b80127b"
// "title": "demo_book",
// "summary": "this is book description",
// "author": "author_name"
// }
router.patch('/logOut', async (req, res) => {
    try {
        let validationError = []
        let body = req.body
        let { error, value:req_data } = logoutSchema(body)
        error ? validationError.push(error.details) : true
        if (validationError.length == 0) {
            let data = await db.collection("users").updateOne({_id:req_data.id},{
                $set : {logged_in:false}
            })
            if (data.modifiedCount) {
                res.status(200).json({ "success": true, "message": "logged out succesfully!!" })
            }else {
                res.status(400).json({
                    success: false,
                    message: "Error while logging out"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Validation error !!",
                validationError: validationError
            })
        }
    } catch (e) {
        console.log("Internal server error ",e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

router.get('/products',checkAuthMiddleware, async (req, res) => {
    try {
        let data = await rp.get('https://dummyjson.com/products')
        let products_data= JSON.parse(data)
        let return_data = []
        console.log(products_data[0])
        products_data['products'].map(ele=>{
            return_data.push({
                "title":ele['title'],
                "price":ele['price'],
                "thumbnail":ele['thumbnail']
            })
        })
     if (return_data.length >0) {
        res.status(200).json({ "success": true, "data": return_data })
     } else {
        res.status(200).json({ "success": false, "message": "No data found !!" })
     }   
    } catch (e) {
        console.log("Internal server error ",e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

module.exports = router
