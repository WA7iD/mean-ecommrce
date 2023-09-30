const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: productId },
    },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: productId },
    },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    message: "Product removed successfully to your wishlist",
    data: user.wishlist,
  });
});

exports.myWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await User.findById(req.user._id)
    .select("wishlist")
    .populate("wishlist");

  res.status(200).json({ status: "success", data: wishlist.wishlist });
});
