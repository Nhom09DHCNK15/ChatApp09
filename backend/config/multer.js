const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("file", file);
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     let mimetype;
//     console.log(file);
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg"
//     ) {
//       mimetype = file.mimetype.split("/")[file.mimetype.split.length - 1];
//     }
//     const { originalname } = file;
//     cb(null, `${originalname}`);
//   },
// });
const storage = multer.memoryStorage();
function fileFilter(req, file, cb) {
  cb(null, true);
  // cb(null, false);
}

const upload = multer({
  storage: storage,
  fileFilter
})

module.exports = upload;