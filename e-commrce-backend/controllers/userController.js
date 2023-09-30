const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const User = require("../models/userModel");

exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    profileImg: req.body.profileImg,
    password: req.body.password,
  });

  res.status(201).json({ data: user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    next(new ApiError(`No document found for this id: ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    next(new ApiError(`No document found for this id: ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.deleteUser = factory.deleteOne(User);

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({ data: user, token });
  next();
});

const filterObject = (obj, ...allowedFields) => {
  const newBodyObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newBodyObj[key] = obj[key];
  });
  return newBodyObj;
};

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const allowedBodyFields = filterObject(req.body, "name", "email", "phone");

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    allowedBodyFields,
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "Success" });
});
