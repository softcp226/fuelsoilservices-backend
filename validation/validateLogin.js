const Joi=require("joi")

const validateLogin=(req)=>{
const schema=Joi.object({
    email:Joi.string().email().required().max(1000),
    password:Joi.string().required().max(1000)
})

const result=schema.validate({email:req.email,password:req.password})
if(result.error)return result.error.message
return true
}

module.exports=validateLogin


