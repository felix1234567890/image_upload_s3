require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.MONGO_DB,
    { useNewUrlParser: true }
  )
  .then(() => console.log("cONNECTED"));
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);
app.listen(5000);
