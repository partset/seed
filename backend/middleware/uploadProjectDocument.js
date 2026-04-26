const multer = require("multer");

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
];

const storage = multer.memoryStorage();

const uploadProjectDocument = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Unsupported file type. Please upload a PDF, Word document, Excel file, PNG, or JPG.",
        ),
      );
    }

    cb(null, true);
  },
});

module.exports = uploadProjectDocument;
