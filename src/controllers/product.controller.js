const Product = require("../models/product.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.getProducts = async (req, res, next) => {
    try {
      const products = await Product.find().populate("seller","name")
  
      return sendResponse(res, true, 200, "Products found successfully", {
        products
      });
    } catch (error) {
      next(error);
    }
  }

  exports.getSingleProduct =  async (req, res, next) => {

    try {
      const product = await Product.findById(req.params.id).populate("seller","name")
  
      return sendResponse(res, true, 200, "Product found successfully", {
        product
      });
    } catch (error) {
      next(error);
    }
  }

  exports.addProduct =  async (req, res, next) => {
    const product = new Product({
      title: req.body.title,
      brand: req.body.brand,
      category: req.body.category,
      images: req.body.images,
      description: req.body.description,
      price: req.body.price,
      seller: req.user._id,
    });

    await product.save();
    return sendResponse(res, true, 200, "product added successfully");
  }
