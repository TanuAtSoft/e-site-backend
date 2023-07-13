const Product = require("../models/product.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ softDeleted: false }).populate(
      "seller"
    );

    return sendResponse(res, true, 200, "Products found successfully", {
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller");

    return sendResponse(res, true, 200, "Product found successfully", {
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  const userExist = await User.findOne({ _id: req.user._id });
  if (userExist.verified) {
    const product = new Product({
      title: req.body.title,
      brand: req.body.brand,
      name: req.body.name,
      discount: req.body.discount,
      main_category: req.body.main_category,
      sub_category: req.body.sub_category,
      images: req.body.images,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      seller: req.user._id,
    });
    await product.save();
    return sendResponse(res, true, 200, "product added successfully");
  } else {
    return sendResponse(
      res,
      true,
      200,
      "seller is not verified to add the product"
    );
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      (product.title = req.body.title),
        (product.name = req.body.name),
        (product.brand = req.body.brand),
        (product.discount = req.body.discount),
        (product.main_category = req.body.main_category),
        (product.sub_category = req.body.sub_category),
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
    if (product) {
      product.softDeleted = true;
      await product.save();
      return sendResponse(res, true, 200, "Product deleted successfully");
    }
    if (!product) {
      return sendResponse(res, true, 200, "Product cannot be found");
    }
  } catch (error) {
    next(error);
  }
};

exports.getTopRatedProducts = async (req, res, next) => {
  try {
    const product = await Product.aggregate([
      {
        $project: {
          _id: "$_id",
          title: "$title",
          images: "$images",
          brand: "$brand",
          price: "$price",
          discount: "$discount",
          reviews: "$reviews",
          avgRating: {
            $avg: "$reviews",
          },
        },
      },
      {
        $sort: {
          avgRating: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    return sendResponse(res, true, 200, "topRated products", product);
  } catch (error) {
    next(error);
  }
};

exports.getBestDealProducts = async (req, res, next) => {
  try {
    const product = await Product.aggregate([
      {
        $project: {
          _id: "$_id",
          title: "$title",
          images: "$images",
          brand: "$brand",
          price: "$price",
          reviews: "$reviews",
          discount: "$discount",
        },
      },
      {
        $sort: {
          discount: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    return sendResponse(res, true, 200, "topRated products", product);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      main_category: req.params.category,
    }).populate("seller", "name");
    return sendResponse(
      res,
      true,
      200,
      "Products found successfully",
      products
    );
  } catch (error) {
    next(error);
  }
};

exports.getProductsBySearch = async (req, res, next) => {
  try {
    let pipeline = [
      {
        $search: {
          index: "searchProducts",
          text: {
            query: `{\"title\": { $eq : ${req.params.text}}`,
            //query: req.params.text,
            path: {
              wildcard: "*",
            },
            // fuzzy: {},
          },
        },
      },
    ];
    const products = await Product.aggregate(pipeline);
    return sendResponse(
      res,
      true,
      200,
      "Products found successfully",
      products
    );
  } catch (error) {
    next(error);
  }
};

exports.getSearchAutoComplete = async (req, res, next) => {
  try {
    let pipeline = [
      {
        $search: {
          index: "autoCompleteProducts",
          autocomplete: {
            query: req.params.text,
            path: "name",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          name: 1,
        },
      },
    ];
    const products = await Product.aggregate(pipeline);
    return sendResponse(
      res,
      true,
      200,
      "Products found successfully",
      products
    );
  } catch (error) {
    next(error);
  }
};
