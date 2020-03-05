var multer  = require('multer');
const uuidv4 = require('uuid/v4')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4()+file.originalname.substring(file.originalname.indexOf(".")));
  }
});

module.exports = multer({ storage: storage });