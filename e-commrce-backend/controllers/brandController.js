const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/imageUpload");
const Brand = require("../models/brandModel");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const ext = req.file.mimetype.split("/")[1];
  const filename = `brand-${uuidv4()}-${Date.now()}.${ext}`;

  await sharp(req.file.buffer).toFile(`uploads/brands/${filename}`);
  console.log(filename);
  req.body.image = filename;
  next();
});

exports.getBrands = factory.getAll(Brand);

exports.getBrand = factory.getOne(Brand);

exports.createBrand = factory.createOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);

exports.deleteAll = factory.deleteAll(Brand);
