const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandlerHelper");

const loginValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
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

const registerValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      firstName: Joi.string().max(50).required(),
      lastName: Joi.string().max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      isSeller: Joi.boolean().required()
    });

    const { value, error } = schema.validate(req.body);

    if (error !== undefined) {
      return sendResponse(res, false, 422, error.details[0].message);
    }
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

const changePasswordValidation = async (req, res, next) => {
    try {
      const schema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required(),
      }).with("newPassword", "oldPassword");
  
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

  const forgotPasswordValidation = async (req, res, next) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
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

  const changePasswordRequestValidation = async (req, res, next) => {
    try {
      const schema = Joi.object({
        newPassword: Joi.string().min(6).required(),
      })
  
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
  loginValidation,
  registerValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  changePasswordRequestValidation
};
