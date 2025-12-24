import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10MB per field
    fileSize: 10 * 1024 * 1024,  // 10MB per file
    fields: 100,                 // max number of non-file fields
    files: 20,                   // max number of file fields (increased for block images)
    fieldNameSize: 200           // max field name size in bytes
  }
});

// For blog/draft create/update: support main image, multiple block images, and multiple block videos
export const blogUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'blockImages', maxCount: 20 },
  { name: 'blockVideos', maxCount: 10 }
]);

export default upload;
