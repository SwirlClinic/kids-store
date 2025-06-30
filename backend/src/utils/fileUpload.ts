import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const uploadsDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const soundsDir = path.join(uploadsDir, 'sounds');

// Ensure upload directories exist
[uploadsDir, imagesDir, soundsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `item-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure multer for sound uploads
const soundStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, soundsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `sound-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for images
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

// File filter for audio
const audioFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only MP3, WAV, and OGG audio files are allowed'));
  }
};

// Multer instances
export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const uploadSound = multer({
  storage: soundStorage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// Process and resize image
export async function processImage(imagePath: string): Promise<string> {
  try {
    const processedPath = imagePath.replace(/\.[^/.]+$/, '_processed.jpg');
    await sharp(imagePath)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(processedPath);
    
    // Remove original file and rename processed file
    fs.unlinkSync(imagePath);
    fs.renameSync(processedPath, imagePath);
    
    return imagePath;
  } catch (error) {
    console.error('Error processing image:', error);
    return imagePath; // Return original if processing fails
  }
}

// Generate thumbnail
export async function generateThumbnail(imagePath: string): Promise<string> {
  try {
    const thumbnailPath = imagePath.replace(/\.[^/.]+$/, '_thumb.jpg');
    await sharp(imagePath)
      .resize(200, 150, { fit: 'cover' })
      .jpeg({ quality: 70 })
      .toFile(thumbnailPath);
    
    return thumbnailPath;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return imagePath; // Return original if thumbnail generation fails
  }
}

export { uploadsDir, imagesDir, soundsDir }; 