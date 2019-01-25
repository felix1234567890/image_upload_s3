require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
mongoose
  .connect(
    process.env.MONGO_DB,
    { useNewUrlParser: true }
  )
  .then(() => console.log("cONNECTED"));
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "uploads")));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(5000);
