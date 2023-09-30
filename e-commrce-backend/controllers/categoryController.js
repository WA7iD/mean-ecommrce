const sharp = require("sharp"); // image processing lib for nodejs
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/imageUpload");
const Category = require("../models/categoryModel");

exports.uploadCategoryImage = uploadSingleImage("image");

// Resize image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  // req.file.filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  const ext = req.file.mimetype.split("/")[1];
  const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;

  await sharp(req.file.buffer)
    // .resize(500, 500)
    .toFile(`uploads/categories/${filename}`); // write into a file on the disk

  req.body.image = filename;
  next();
});

exports.getCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);

exports.createCategory = factory.createOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);

exports.deleteAll = factory.deleteAll(Category);
