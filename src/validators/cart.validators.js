const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandlerHelper");

const addToCartValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      productId: Joi.string().required(),
    //   quantity: Joi.number().required(),
    //   title: Joi.string().required(),
    //   brand: Joi.string().required(),
    //   reviews: Joi.string().required(),
    //   image: Joi.string().required(),
    //   price: Joi.string().required(),
    //   seller: Joi.string().required(),
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

const removeItemFromCartValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      productId: Joi.string().required(),
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
  addToCartValidator,
  removeItemFromCartValidator,
};
