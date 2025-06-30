# Kids Store Webapp - Cursor Setup Prompt

Create a full-stack accessible from an ipad webapp for kids to manage their own virtual store. The app should be fun, colorful, and easy to use.

## Tech Stack Requirements
- **Frontend**: Vite + React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS for kid-friendly UI
- **File Upload**: Multer for image handling
- **Audio**: Web Audio API for sound effects

## Project Structure
```
kids-store/
├── frontend/          # Vite React TypeScript app
├── backend/           # Express TypeScript API
├── shared/            # Shared types/interfaces
├── uploads/           # Image storage
└── database/          # SQLite database file
```

## Backend Requirements

### Database Schema (SQLite)
```sql
-- Items table
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_path TEXT,
  sound_file TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints
- `GET /api/items` - Get all store items
- `POST /api/items` - Add new item (with image/sound upload)
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/:id/image` - Serve item images
- `GET /api/items/:id/sound` - Serve item sounds

### Backend Features
- File upload handling for images (JPEG, PNG, WebP)
- Audio file upload (MP3, WAV, OGG)
- Input validation and sanitization
- CORS enabled for frontend
- Static file serving for uploads
- Error handling middleware

## Frontend Requirements

### Main Components
1. **StoreView** - Display all items in a grid layout
2. **AddItemForm** - Form to add new items with image/sound upload
3. **ItemCard** - Individual item display with play sound button
4. **EditItemModal** - Edit existing items
5. **DeleteConfirmModal** - Confirm item deletion

### UI/UX Features
- Bright, colorful, kid-friendly design
- Large buttons and touch-friendly interface
- Drag-and-drop image upload
- Image preview before upload
- Sound recording capability (bonus) or file upload
- Visual feedback when sounds play
- Loading states and error handling
- Responsive design for tablets

### Item Card Features
- Large product image
- Item name in fun, readable font
- Price display with currency symbol
- Big "PLAY SOUND" button that triggers audio
- Edit/Delete buttons (with confirmation)
- Hover/click animations

## Technical Specifications

### TypeScript Interfaces
```typescript
interface StoreItem {
  id: number;
  name: string;
  price: number;
  imagePath?: string;
  soundFile?: string;
  createdAt: string;
}

interface AddItemRequest {
  name: string;
  price: number;
  image?: File;
  sound?: File;
}
```

### Audio Implementation
- Use Web Audio API for sound playback
- Support multiple audio formats
- Volume control
- Visual indicators when sound is playing
- Prevent sound overlap/spam clicking

### Image Handling
- Resize images on upload (max 800x600)
- Generate thumbnails for grid view
- Support drag-and-drop upload
- Image validation (file type, size limits)
- Fallback placeholder images

## Development Setup
- Include package.json for both frontend and backend
- Docker setup (optional)
- Environment variables for configuration
- Development vs production builds
- Hot reload for both frontend and backend

## Kid-Friendly Features
- Emoji support in item names
- Fun sound effects for UI interactions
- Colorful gradients and animations
- Simple, intuitive navigation
- Large text and buttons
- Success animations when items are added
- Fun loading spinners

## Additional Requirements
- Form validation with helpful error messages
- File size limits (images: 5MB, audio: 2MB)
- SQLite database initialization script
- Basic error boundary for React
- Console logging for debugging
- Simple deployment instructions

## Nice-to-Have Features
- Sound recording directly in browser
- Item categories/tags
- Search functionality
- Sort items by price/name/date
- Export store as PDF/image
- Multiple store themes
- Undo functionality

Please create a complete, working implementation with all necessary configuration files, and include clear setup instructions in a README.md file.