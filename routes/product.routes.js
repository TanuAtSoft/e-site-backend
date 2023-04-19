const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");
const { sendResponse } = require("../helpers/requestHandlerHelper");

router.get("/products", async (req, res, next) => {
  try {
    let query, total;
    query = Product.find().populate("seller", "name");

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    total = await Product.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query

    const products = await query;

    // Pagination result
    const pagination = {};
    pagination.totalRecords = total;
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    return sendResponse(res, true, 200, "Products found successfully", {
      products,
      pagination,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/addProducts",
  authenticated,
  authorize(["SELLER", "ADMIN"]),
  async (req, res, next) => {
    const product = new Product({
      title: req.body.title,
      category: req.body.category,
      images: req.body.images,
      description: req.body.description,
      price: req.body.price,
      seller: req.user._id,
    });

    await product.save();
    return sendResponse(res, true, 200, "product added successfully");
  }
);
module.exports = router;
