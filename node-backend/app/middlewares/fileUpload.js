var multer = require('multer');

let storage = multer.diskStorage({
  destination: function(req, file, cb) 
  {
    cb(null, '../src/assets/images/');
  },

  filename: function(req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)

  }
});

let fileUpload = multer({ storage: storage });

module.exports = fileUpload;