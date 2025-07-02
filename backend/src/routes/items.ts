import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { itemsDb, StoreItem } from '../database';
import { processImage, generateThumbnail } from '../utils/fileUpload';

const router = express.Router();

// Configure multer for handling multiple file fields
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb: (error: Error | null, destination: string) => void) => {
      if (file.fieldname === 'image') {
        cb(null, path.join(__dirname, '../../uploads/images'));
      } else if (file.fieldname === 'sound') {
        cb(null, path.join(__dirname, '../../uploads/sounds'));
      } else {
        cb(new Error('Invalid field name'), '');
      }
    },
    filename: (req, file, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      if (file.fieldname === 'image') {
        cb(null, `item-${uniqueSuffix}${path.extname(file.originalname)}`);
      } else if (file.fieldname === 'sound') {
        cb(null, `sound-${uniqueSuffix}${path.extname(file.originalname)}`);
      } else {
        cb(new Error('Invalid field name'), '');
      }
    }
  }),
  fileFilter: (req, file, cb: multer.FileFilterCallback) => {
    if (file.fieldname === 'image') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
      }
    } else if (file.fieldname === 'sound') {
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only MP3, WAV, and OGG audio files are allowed'));
      }
    } else {
      cb(new Error('Invalid field name'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB for images, will be overridden for sounds
  }
});

// Get all items
router.get('/', (req, res) => {
  try {
    const items = itemsDb.getAll();
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

// Get item by ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid item ID' });
    }

    const item = itemsDb.getById(id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch item' });
  }
});

// Create new item
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'sound', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, price } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Item name is required' });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ success: false, error: 'Valid price is required' });
    }

    let imagePath: string | undefined;
    let soundFile: string | undefined;

    // Handle image upload
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    if (imageFile) {
      imagePath = imageFile.path;
      await processImage(imagePath);
      await generateThumbnail(imagePath);
    }

    // Handle sound upload
    const soundFileObj = files?.sound?.[0];
    if (soundFileObj) {
      soundFile = soundFileObj.path;
    }

    const itemId = itemsDb.create(name.trim(), priceNum, imagePath, soundFile);
    const newItem = itemsDb.getById(itemId);

    if (!newItem) {
      return res.status(500).json({ success: false, error: 'Failed to create item' });
    }

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ success: false, error: 'Failed to create item' });
  }
});

// Update item
router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'sound', maxCount: 1 }
]), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid item ID' });
    }

    const existingItem = itemsDb.getById(id);
    if (!existingItem) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const { name, price } = req.body;
    let imagePath: string | undefined;
    let soundFile: string | undefined;

    // Handle image upload
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    if (imageFile) {
      imagePath = imageFile.path;
      await processImage(imagePath);
      await generateThumbnail(imagePath);
    }

    // Handle sound upload
    const soundFileObj = files?.sound?.[0];
    if (soundFileObj) {
      soundFile = soundFileObj.path;
    }

    const success = itemsDb.update(
      id,
      name?.trim(),
      price ? parseFloat(price) : undefined,
      imagePath,
      soundFile
    );

    if (!success) {
      return res.status(400).json({ success: false, error: 'Failed to update item' });
    }

    const updatedItem = itemsDb.getById(id);
    if (!updatedItem) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve updated item' });
    }

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, error: 'Failed to update item' });
  }
});

// Delete item
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid item ID' });
    }

    const existingItem = itemsDb.getById(id);
    if (!existingItem) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Delete associated files
    if (existingItem.image_path && fs.existsSync(existingItem.image_path)) {
      fs.unlinkSync(existingItem.image_path);
    }
    if (existingItem.sound_file && fs.existsSync(existingItem.sound_file)) {
      fs.unlinkSync(existingItem.sound_file);
    }

    const success = itemsDb.delete(id);
    if (!success) {
      return res.status(400).json({ success: false, error: 'Failed to delete item' });
    }

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, error: 'Failed to delete item' });
  }
});

// Serve item image
router.get('/:id/image', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid item ID' });
    }

    const item = itemsDb.getById(id);
    if (!item || !item.image_path) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    if (!fs.existsSync(item.image_path)) {
      return res.status(404).json({ success: false, error: 'Image file not found' });
    }

    res.sendFile(path.resolve(item.image_path));
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ success: false, error: 'Failed to serve image' });
  }
});

// Serve item sound
router.get('/:id/sound', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid item ID' });
    }

    const item = itemsDb.getById(id);
    if (!item || !item.sound_file) {
      return res.status(404).json({ success: false, error: 'Sound not found' });
    }

    if (!fs.existsSync(item.sound_file)) {
      return res.status(404).json({ success: false, error: 'Sound file not found' });
    }

    res.sendFile(path.resolve(item.sound_file));
  } catch (error) {
    console.error('Error serving sound:', error);
    res.status(500).json({ success: false, error: 'Failed to serve sound' });
  }
});

// Serve default sound
router.get('/default-sound', (req, res) => {
  try {
    const defaultSoundPath = path.join(__dirname, '../../uploads/sounds/default-sound.mp3');
    
    if (!fs.existsSync(defaultSoundPath)) {
      return res.status(404).json({ success: false, error: 'Default sound file not found' });
    }

    res.sendFile(path.resolve(defaultSoundPath));
  } catch (error) {
    console.error('Error serving default sound:', error);
    res.status(500).json({ success: false, error: 'Failed to serve default sound' });
  }
});

export default router; 