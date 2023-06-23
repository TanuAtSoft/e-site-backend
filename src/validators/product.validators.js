const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandlerHelper");

const productValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      brand: Joi.string().required(),
      name: Joi.string().required(),
      discount: Joi.number().required(),
      main_category: Joi.string(),
      sub_category: Joi.string(),
      images: Joi.array().items(Joi.string().required()),
      description: Joi.array().items(Joi.string().required()),
      price: Joi.number().required(),
      stock: Joi.number().required(),
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


const productaValidator = async (req, res, next) => {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        brand: Joi.string().required(),
        name: Joi.string().required(),
        discount: Joi.number().required(),
        main_category: Joi.string(),
        sub_category: Joi.string(),
        images: Joi.array().items(Joi.string().required()),
        description: Joi.string().required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
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
  }

module.exports = {
  productValidator,
};
