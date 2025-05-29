const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const freelanceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ProjectUploader/freelance_projects',
    resource_type: 'auto',
    allowed_formats: ['zip', 'pdf', 'jpg', 'png', 'mp4', 'doc', 'ppt'],
  },
});

const upload = multer({ storage: freelanceStorage });

module.exports = upload;
