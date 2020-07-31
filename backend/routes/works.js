const express = require("express");
const router = express.Router();

const Work = require("../models/work.model");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post("/add", upload.array("images"), (req, res) => {
  console.log(req.files); // Problem - This is an object array, i should take the 'path' and assign it to the images[] below

  const image1 = req.files[0].path;
  const image2 = req.files[1].path;
  const image3 = req.files[2].path;

  const newWork = new Work({
    title: req.body.title,
    fee: req.body.fee,
    category: req.body.category,
    area: req.body.area,
    images: [image1, image2, image3],
    postedBy: req.body.postedBy,
  });

  newWork
    .save()
    .then(() => res.json("Work Added"))
    .catch((err) => res.status(400).json("Error : " + err));
});

router.route("/").get((req, res) => {
  Work.find()
    .populate("postedBy", "_id name phone")
    .select("")
    .then((works) => {
      res.json(works);
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

module.exports = router;
