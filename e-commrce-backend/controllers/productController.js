const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const multer = require("multer");

const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");

// Storage
const multerStorage = multer.memoryStorage();

// Accept only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const ext = req.files.imageCover[0].mimetype.split("/")[1];
    const imageCoverFilename = `products-${uuidv4()}-${Date.now()}-cover.${ext}`;
    await sharp(req.files.imageCover[0].buffer).toFile(
      `uploads/products/${imageCoverFilename}`
    ); // write into a file on the disk

    req.body.imageCover = imageCoverFilename;
  }
  req.body.images = [];
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const ext = img.mimetype.split("/")[1];
        const filename = `products-${uuidv4()}-${Date.now()}-${
          index + 1
        }.${ext}`;
        await sharp(img.buffer).toFile(`uploads/products/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.getProducts = factory.getAll(Product, "Products");

exports.getProduct = factory.getOne(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
