import multer from "multer";

// ✅ Use memory storage (required for Cloudinary upload_stream)
const storage = multer.memoryStorage();

// ✅ Restrict file types to PDF / DOC / DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = /\.(pdf|doc|docx)$/i;

  if (!allowedTypes.test(file.originalname)) {
    return cb(
      new Error("Only PDF or DOC/DOCX files are allowed"),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter,
});

export default upload;