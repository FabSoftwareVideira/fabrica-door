const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.resolve(__dirname, "../../public/assets/uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename(_req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path
            .basename(file.originalname, ext)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/gi, "-")
            .toLowerCase()
            .slice(0, 60);

        cb(null, `${Date.now()}-${base}${ext}`);
    }
});

const ALLOWED_MIME = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml"
];

function fileFilter(_req, file, cb) {
    if (ALLOWED_MIME.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = {
    uploadProjectImages: upload.fields([
        { name: "featured_image_file", maxCount: 1 },
        { name: "gallery_files", maxCount: 20 }
    ])
};
