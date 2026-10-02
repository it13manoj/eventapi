const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// file filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png|webp/;

    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
        return cb(null, true);
    } else {
        cb("Only images are allowed");
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

module.exports = upload;