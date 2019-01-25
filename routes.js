const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const multer_s3 = require("multer-s3");
const aws = require("aws-sdk");
const Slika = require("./models/Slika");

module.export = s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});
const S3Upload = {
  s3: s3,
  bucket: "picture-upload-10",
  contentType: multer_s3.AUTO_CONTENT_TYPE,
  acl: "public-read",
  key: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
};

const multerMiddleware = multer({
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, path.resolve(__dirname, "uploads"));
  //   },
  storage: multer_s3(S3Upload),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
  // }),
  limits: {
    fileSize: 3 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Dozvoljene su samo slike u JPEG ili PNG formatu"));
    }

    cb(null, true);
  }
});

router.post("/upload", multerMiddleware.single("slika"), async (req, res) => {
  console.log(req.file);
  const slika = await Slika.create({
    name: req.file.originalname,
    size: req.file.size,
    url: req.file.path,
    key: req.file.key
  });
  res.redirect("/");
});
router.get("/", async (req, res) => {
  const slike = await Slika.find();
  console.log(slike);
  return res.render("index", { slike: slike });
});
router.delete("/slika/:id", async (req, res) => {
  const slika = await Slika.findById(req.params.id);
  await slika.remove();
  res.redirect("/");
});
module.exports = router;
