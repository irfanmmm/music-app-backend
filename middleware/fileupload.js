const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/png") {
      return cb(null, "./uploads/images");
    } else if (file.mimetype === "audio/mpeg") {
      return cb(null, "./uploads/songs");
    }
  },
  filename: function (req, file, cb) {
    console.log(file);
    if (file.mimetype === "image/png") {
      return cb(null, `${Date.now()}.png`);
    } else if (file.mimetype === "audio/mpeg") {
      return cb(null, `${Date.now()}.mp3`);
    }
  },
});

const upload = multer({ storage }).fields([
  { name: "image", maxCount: 1 }, // maxCount specifies the maximum number of files for this field
  { name: "song", maxCount: 1 },
]);

module.exports = upload;
