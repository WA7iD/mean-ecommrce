const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

const calcTotalCartPrice = async (cart) => {
  let totalPrice = 0;
  cart.products.forEach((prod) => {
    totalPrice += prod.price * prod.count;
  });

  cart.totalCartPrice = totalPrice;
  cart.totalAfterDiscount = undefined;
  cart.coupon = undefined;

  await cart.save();

  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ cartOwner: req.user._id });

  if (cart) {
    const itemIndex = cart.products.findIndex(
      (p) =>
        p.product.toString() === req.body.productId &&
        p.color === req.body.color
    );
    if (itemIndex > -1) {
      const productItem = cart.products[itemIndex];
      productItem.count += 1;
      cart.products[itemIndex] = productItem;
    } else {
      cart.products.push({ product: productId, color, price: product.price });
    }
  }
  if (!cart) {
    cart = await Cart.create({
      cartOwner: req.user._id,
      products: [{ product: productId, color, price: product.price }],
    });
  }

  await calcTotalCartPrice(cart);

  return res.status(200).json({
    status: "success",
    message: "Product added successfully to your cart",
    numOfCartItems: cart.products.length,
    data: cart,
  });
});

exports.updateCartProductCount = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { count } = req.body;
  const cart = await Cart.findOne({ cartOwner: req.user._id })
    .populate({
      path: "products.product",
      select: "title imageCover ratingsAverage brand category ",
      populate: { path: "brand", select: "name -_id", model: "Brand" },
    })
    .populate({
      path: "products.product",
      select: "title imageCover ratingsAverage brand category",
      populate: { path: "category", select: "name -_id", model: "Category" },
    });
  if (!cart) {
    return next(
      new ApiError(`No cart exist for this user: ${req.user._id}`, 404)
    );
  }

  const itemIndex = cart.products.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex > -1) {
    const productItem = cart.products[itemIndex];
    productItem.count = count;
    cart.products[itemIndex] = productItem;
  } else {
    return next(
      new ApiError(`No Product Cart item found for this id: ${itemId}`)
    );
  }
  await calcTotalCartPrice(cart);

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.products.length,
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ cartOwner: req.user._id })
    .populate({
      path: "products.product",
      select: "title imageCover ratingsAverage brand category ",
      populate: { path: "brand", select: "name -_id", model: "Brand" },
    })
    .populate({
      path: "products.product",
      select: "title imageCover ratingsAverage brand category",
      populate: { path: "category", select: "name -_id", model: "Category" },
    });

  if (!cart) {
    return next(
      new ApiError(`No cart exist for this user: ${req.user._id}`, 404)
    );
  }
  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.products.length,
    data: cart,
  });
});

exports.removeCartProduct = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { cartOwner: req.user._id },
    {
      $pull: { products: { _id: itemId } },
    },
    { new: true }
  )
    .populate({
      path: "products.product",
      select: "title imageCover ratingsAverage brand category ",
      populate: { path: "brand", select: "name -_id", model: "Brand" },
    })
    .populate({
      path: "products.product",
      select: "title imageCover ratingsAverage brand category",
      populate: { path: "category", select: "name -_id", model: "Category" },
    });

  await calcTotalCartPrice(cart);

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.products.length,
    data: cart,
  });
});

exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ cartOwner: req.user._id });

  res.status(204).send();
});
