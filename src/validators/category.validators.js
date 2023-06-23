const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandlerHelper");

const mainCategoryValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
        mainCategory:Joi.string().required(),
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

const subCategoryValidator = async (req, res, next) => {
    try {
      const schema = Joi.object({
          subCategory:Joi.string().required(),
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
    mainCategoryValidator,
    subCategoryValidator
};
