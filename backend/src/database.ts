import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// TypeScript interfaces
export interface StoreItem {
  id: number;
  name: string;
  price: number;
  image_path?: string;
  sound_file?: string;
  created_at: string;
}

const dbPath = path.join(__dirname, '../../database/kids-store.db');
const dbDir = path.dirname(dbPath);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db: Database.Database = new Database(dbPath);

// Initialize database tables
export function initializeDatabase() {
  const createItemsTable = `
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image_path TEXT,
      sound_file TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createItemsTable);
  console.log('✅ Database initialized successfully');
}

// Database operations
export const itemsDb = {
  getAll: (): StoreItem[] => {
    const stmt = db.prepare('SELECT * FROM items ORDER BY created_at DESC');
    return stmt.all() as StoreItem[];
  },

  getById: (id: number): StoreItem | undefined => {
    const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
    return stmt.get(id) as StoreItem | undefined;
  },

  create: (name: string, price: number, imagePath?: string, soundFile?: string): number => {
    const stmt = db.prepare(`
      INSERT INTO items (name, price, image_path, sound_file)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(name, price, imagePath, soundFile);
    return result.lastInsertRowid as number;
  },

  update: (id: number, name?: string, price?: number, imagePath?: string, soundFile?: string): boolean => {
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (imagePath !== undefined) {
      updates.push('image_path = ?');
      values.push(imagePath);
    }
    if (soundFile !== undefined) {
      updates.push('sound_file = ?');
      values.push(soundFile);
    }

    if (updates.length === 0) return false;

    values.push(id);
    const stmt = db.prepare(`UPDATE items SET ${updates.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);
    return result.changes > 0;
  },

  delete: (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM items WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

export default db; 