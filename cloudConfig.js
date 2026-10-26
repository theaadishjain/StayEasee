const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const isCloudinaryConfigured = Boolean(
  process.env.CLOUD_NAME &&
    process.env.CLOUD_API_KEY &&
    process.env.CLOUD_API_SECRET
);

if (!isCloudinaryConfigured) {
  console.warn(
    "Cloudinary is not fully configured (CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET), saving uploads to public/uploads instead."
  );
}

const localUploadDir = path.join(__dirname, "public", "uploads");

const allowedFormats = ["png", "jpg", "jpeg", "webp"];

// Keep the file in memory so the request can be validated before anything
// is uploaded to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    let ext = file.originalname.split(".").pop().toLowerCase();
    if (file.mimetype.startsWith("image/") && allowedFormats.includes(ext)) {
      return cb(null, true);
    }
    cb(new ExpressError(400, "Only png, jpg, jpeg and webp images are allowed!"));
  },
});

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "stayease_DEV", allowed_formats: allowedFormats },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      .end(buffer);
  });

// Development fallback used when Cloudinary credentials are missing.
const saveLocally = async (file) => {
  let ext = file.originalname.split(".").pop().toLowerCase();
  let name = `${crypto.randomUUID()}.${ext}`;
  await fs.mkdir(localUploadDir, { recursive: true });
  await fs.writeFile(path.join(localUploadDir, name), file.buffer);
  return { url: `/uploads/${name}`, filename: `local/${name}` };
};

// Uploads req.file and sets req.file.path / req.file.filename, the same
// fields multer-storage-cloudinary used to provide.
const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  try {
    if (isCloudinaryConfigured) {
      let result = await uploadBuffer(req.file.buffer);
      req.file.path = result.secure_url;
      req.file.filename = result.public_id;
    } else {
      let result = await saveLocally(req.file);
      req.file.path = result.url;
      req.file.filename = result.filename;
    }
    next();
  } catch (err) {
    next(new ExpressError(502, "Image upload failed, please try again!"));
  }
};

module.exports = {
  cloudinary,
  upload,
  uploadImage,
};
