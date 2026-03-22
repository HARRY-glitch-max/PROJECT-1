import multer from "multer";

// Use memory storage so we can access the file buffer in the controller
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;
