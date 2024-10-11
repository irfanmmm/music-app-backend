const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "audio/mpeg" || file.mimetype === "audio/mp3") {
      return cb(null, "./uploads/songs");
    } else {
      return cb(
        new Error("Invalid file type! Only mp3 and mpeg files are allowed.")
      );
    }
  },
  filename: function (req, file, cb) {
    if (file.mimetype === "audio/mpeg" || file.mimetype === "audio/mp3") {
      return cb(null, `${Date.now()}.mp3`);
    } else {
      return cb(
        new Error("Invalid file type! Only mp3 and mpeg files are allowed.")
      );
    }
  },
});

const upload = multer({ storage }).fields([{ name: "song", maxCount: 1 }]);

module.exports = upload;
