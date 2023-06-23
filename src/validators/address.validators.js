const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandlerHelper");

const addressValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      fullName: Joi.string().required(),
      mobileNumber: Joi.number().required(),
      pincode: Joi.number().required(),
      houseNumber: Joi.string().required(),
      area: Joi.string().required(),
      landmark: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    });

    const { value, error } = schema.validate(req.body);

    if (error !== undefined) {
      return sendResponse(res, false, 422, error.details[0].message);
    }

    // set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addressValidator,
};
