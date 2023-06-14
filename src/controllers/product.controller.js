const Product = require("../models/product.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({softDeleted: false}).populate("seller", "name");

    return sendResponse(res, true, 200, "Products found successfully", {
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name"
    );

    return sendResponse(res, true, 200, "Product found successfully", {
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    brand: req.body.brand,
    category: req.body.category,
    images: req.body.images,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    seller: req.user._id,
  });

  await product.save();
  return sendResponse(res, true, 200, "product added successfully");
};

exports.editProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      (product.title = req.body.title),
        (product.brand = req.body.brand),
        (product.category = req.body.category),
        (product.images = req.body.images),
        (product.description = req.body.description),
        (product.stock = req.body.stock),
        (product.softDeleted = req.body.softDeleted
          ? req.body.softDeleted
          : false),
        (product.price = req.body.price);

      await product.save();
      return sendResponse(res, true, 200, "product edited successfully");
    }

    // data.cart.push(res.body.postId)
  } catch (err) {
    return sendResponse(res, flase, 400, "something went wrong");
  }
};

exports.getProductByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({
      category: req.body.category,
    }).populate("seller", "name");
    return sendResponse(res, true, 200, "Products found successfully", {
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByUser = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id });

    return sendResponse(
      res,
      true,
      200,
      "Products found successfully",
      products
    );
  } catch (error) {
    console.log(error);
  }
};

exports.softDeleteSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product){
      product.softDeleted = true;
      await product.save()
      return sendResponse(res, true, 200, "Product deleted successfully");
    }
    if(!product){
      return sendResponse(res, true, 200, "Product cannot be found");
    }
  } catch (error) {
    next(error);
  }
};

// exports.testReviews = async (req, res, next) => {
//   try {
//     const product = await Product.updateOne(
//       { _id: req.params.id },
//       { $push: { reviews: req.body.rating } }
//     );
//     console.log("product", product)
//     return sendResponse(res, true, 200, "reviews added");
//   } catch (error) {
//     next(error);
//   }
// };