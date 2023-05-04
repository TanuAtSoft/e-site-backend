const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
app.use(express.json());
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("we are connected with database");
});
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(cookieParser());

const authRoutes = require("./src/routes/auth.routes");
const uploadRoutes = require("./src/routes/upload.routes");
const productRoutes = require("./src/routes/product.routes");
const cartRoutes = require("./src/routes/cart.route");
const addressRoutes = require("./src/routes/address.routes");
const paymentRoutes = require("./src/routes/payment.routes")
const orderRoutes = require("./src/routes/order.routes")

app.use("/", authRoutes);
app.use("/", uploadRoutes);
app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/", addressRoutes);
app.use("/", orderRoutes);
app.use("/", paymentRoutes);

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
