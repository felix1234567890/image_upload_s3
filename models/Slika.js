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
slika.pre("remove", async function(err, data) {
  await s3.deleteObject({
    Bucket: "picture-upload-10",
    Key: this.key
  });
  if (err) console.log(err);
  // error
  else console.log("deleted"); // deleted
});
module.exports = mongoose.model("Slika", slika);
