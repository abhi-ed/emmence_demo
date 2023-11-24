const joi = require ('joi')
const signUpSchema = (obj) => {
    try {
        let schema = joi.object({
            user_name : joi.string().required(),
            password : joi.string().required()
        })
        let { error, value } = schema.validate(obj);
        return { error, value }
    } catch (e) {
        console.log("Error while validating signUpSchema", e);
    }
}
const loginSchema = (obj) => {
    try {
        let schema = joi.object({
            user_name : joi.string().required(),
            password : joi.string().required()
        })
        let { error, value } = schema.validate(obj);
        return { error, value }
    } catch (e) {
        console.log("Error while validating loginSchema", e);
    }
}
const logoutSchema = (obj) => {
    try {
        let schema = joi.object({
            id : joi.string().guid().required()
        })
        let { error, value } = schema.validate(obj);
        return { error, value }
    } catch (e) {
        console.log("Error while validating logoutSchema", e);
    }
}


module.exports = {
    signUpSchema,
    loginSchema,
    logoutSchema
}