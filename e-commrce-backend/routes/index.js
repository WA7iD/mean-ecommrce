const categoryRouter = require("./categoryRoute");
const brandRouter = require("./brandRoute");
const productRouter = require("./productRoute");
const userRouter = require("./userRoute");
const authRouter = require("./authRoute");
const wishlistRouter = require("./wishlistRoute");
const addressRouter = require("./addressRoute");
const cartRouter = require("./cartRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/cart", cartRouter);
};

module.exports = mountRoutes;
