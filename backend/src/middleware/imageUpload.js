import multer from 'multer';

const storage = multer.memoryStorage();

function fileFilter(_req, file, callback) {
  if (!file.mimetype.startsWith('image/')) {
    callback(new Error('Only image files are allowed'));
    return;
  }

  callback(null, true);
}

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter,
});

export function getImageValue(file, existingValue) {
  if (file?.buffer?.length) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }

  if (typeof existingValue === 'string' && existingValue.trim()) {
    return existingValue.trim();
  }

  return null;
}