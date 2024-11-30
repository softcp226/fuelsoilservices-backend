const Joi = require("joi");

const validate_user01 = (req) => {
  const schema = Joi.object({
    first_name:Joi.string().required(),
    last_name:Joi.string().required(),
    email: Joi.string().email().required().max(1000),
    phone_number: Joi.string().required().max(1000),
    country: Joi.string().required().max(1000),
    street_address:Joi.string().required(),
    city:Joi.string().required(),
   password:Joi.string().required(),

  });

  const result = schema.validate({
    first_name:req.first_name,
    last_name:req.last_name,
     email:req.email,
    phone_number: req.phone_number,
    country: req.country,
    street_address:req.street_address,
    city:req.street_address,
    password:req.password
});
  if (result.error) return result.error.message;
  return true;
};

module.exports = validate_user01;
