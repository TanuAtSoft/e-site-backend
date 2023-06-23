const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandlerHelper");

const createOrderValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
        orderId: Joi.string().required(),
        deliveryAddress:Joi.string().required(),
        isCod: Joi.boolean().required(),
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

const updateOrderReviewValidator = async (req, res, next) => {
    try {
      const schema = Joi.object({
        orderObjectId: Joi.string().required(),
        itemId:Joi.string().required(),
        rating:Joi.number().required(),
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

  const updateOrderInfoValidator = async (req, res, next) => {
    try {
      const schema = Joi.object({
        orderObjectId: Joi.string().required(),
        itemId:Joi.string().required(),
        status:Joi.string().required(),
        shippingCompany:Joi.string(),
        trackingNumber: Joi.string(),
        productId:Joi.string().required()
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
    createOrderValidator,
    updateOrderReviewValidator,
    updateOrderInfoValidator
};