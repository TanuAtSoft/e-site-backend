const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
app.use(express.json());
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");



mongoose.connect(
  "mongodb+srv://hnytanu:hnytanu@cluster0.loqfil7.mongodb.net/e-site",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
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
app.use(cookieParser());



const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const productRoutes = require("./routes/product.routes")

app.use("/", authRoutes);
app.use("/", uploadRoutes);
app.use("/",productRoutes)

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
