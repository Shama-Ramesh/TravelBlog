const multer = require('multer');


// Configure multer for single file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the filename with a timestamp
  }
});

const uploads = multer({ storage });

module.exports = uploads;
