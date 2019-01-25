require("dotenv").config();
const mongoose = require("mongoose");
const aws = require("aws-sdk");
//const s3 = require("../routes");
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});
const slika = new mongoose.Schema(
  {
    name: String,
    size: Number,
    url: String,
    key: String
  },
  { timestamps: true }
);
slika.pre("remove", function() {
  s3.deleteObject({
    Bucket: "picture-upload-10",
    Key: this.key
  }).promise();
});
module.exports = mongoose.model("Slika", slika);
