const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    profileImg: req.body.profileImg,
    password: req.body.password,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  let isCorrectPassword = false;
  if (user) {
    isCorrectPassword = await bcrypt.compare(req.body.password, user.password);
  }

  if (!user || !isCorrectPassword) {
    return next(new ApiError("Incorrect email or password"), 401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  delete user._doc.password;

  res.status(200).json({ data: user, token });
});

exports.auth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in. Please login to get access", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError("The user that belong to this token does no longer exist")
    );
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed password! Please login again..",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // ["admin"] or ["admin", "editor"]
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to perform this action", 403)
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email address ${email}`, 404)
    );
  }

  const resetCode = Math.floor(Math.random() * 1000000 + 1).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  user.resetCodeVerified = false;
  user.save();

  const message = `Forgot your password? Submit this reset password code : ${resetCode}\n If you didn't forgot your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "Success",
      message: "Reset code sent to your email",
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new ApiError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code is invalid or has expired", 400));
  }
  // 4) If reset code has not expired, and there is user send res with userId
  user.resetCodeVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(
        `There is no user with this email address ${req.body.email}`,
        404
      )
    );
  }
  if (!user.resetCodeVerified) {
    return next(new ApiError("reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.resetCodeVerified = undefined;

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({ token });
});
