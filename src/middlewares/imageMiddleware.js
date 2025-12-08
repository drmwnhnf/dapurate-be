const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rawImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const rawPath = path.join(__dirname, '../../image/raw');

        // pastikan folder ada
        if (!fs.existsSync(rawPath)) {
            fs.mkdirSync(rawPath, { recursive: true });
        }

        cb(null, rawPath);
    },

    filename: function (req, file, cb) {
        const ext = file.mimetype?.split('/')[1] || 'bin';
        req.filename = `${req.sample.id}.${ext}`;
        cb(null, `${req.sample.id}.${ext}`);
    }
});

const rawImageUpload = multer({ storage: rawImageStorage }).single('image');

module.exports = {
    rawImageUpload
};
