import { initializeDatabase } from './database';

console.log('🚀 Initializing Kids Store Database...');

try {
  initializeDatabase();
  console.log('✅ Database initialized successfully!');
  console.log('📊 Database file: database/kids-store.db');
  console.log('🎉 You can now start the backend server!');
} catch (error) {
  console.error('❌ Error initializing database:', error);
  process.exit(1);
} 