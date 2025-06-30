# 🛍️ Kids Store Webapp

A fun, colorful, and interactive webapp for kids to manage their own virtual store! Built with modern web technologies and designed specifically for iPad use.

## ✨ Features

- **🎨 Kid-Friendly Design**: Bright colors, fun animations, and easy-to-use interface
- **📱 iPad Optimized**: Touch-friendly buttons and responsive design
- **🖼️ Image Upload**: Drag & drop image upload with preview
- **🔊 Sound Effects**: Upload and play custom sound effects for each item
- **🎮 Interactive**: Play sounds, edit items, and manage your store
- **💾 Persistent Storage**: SQLite database keeps your items safe
- **⚡ Fast & Modern**: Built with Vite, React, and TypeScript

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Dropzone** for file uploads
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** with better-sqlite3
- **Multer** for file uploads
- **Sharp** for image processing
- **Helmet** for security

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kids-store-webapp
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/health

## 📁 Project Structure

```
kids-store-webapp/
├── frontend/                 # React frontend app
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # App entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── database.ts      # Database setup
│   │   └── index.ts         # Server entry point
│   └── package.json         # Backend dependencies
├── shared/                   # Shared TypeScript types
├── uploads/                  # File uploads (auto-created)
│   ├── images/              # Item images
│   └── sounds/              # Sound effects
├── database/                 # SQLite database (auto-created)
└── package.json             # Root package.json
```

## 🎯 How to Use

### Adding Items
1. Click the "Add Item" button
2. Enter item name and price
3. Drag & drop an image (optional)
4. Drag & drop a sound file (optional)
5. Click "Add Item" to save

### Managing Items
- **Play Sound**: Click the "Play Sound" button to hear the item's sound effect
- **Edit**: Click the edit button to modify item details
- **Delete**: Click the delete button to remove items (with confirmation)

### File Uploads
- **Images**: JPEG, PNG, WebP (max 5MB)
- **Sounds**: MP3, WAV, OGG (max 2MB)
- Images are automatically resized and optimized
- Thumbnails are generated for better performance

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run build            # Build both frontend and backend
npm run install:all      # Install all dependencies

# Frontend only
npm run dev:frontend     # Start frontend dev server
npm run build:frontend   # Build frontend

# Backend only
npm run dev:backend      # Start backend dev server
npm run build:backend    # Build backend
npm run start            # Start production backend
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=3001
```

### Database

The SQLite database is automatically created when you first run the backend. The database file is stored in `database/kids-store.db`.

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    // Your custom colors
  },
  secondary: {
    // Your custom colors
  }
}
```

### Animations
Add custom animations in `frontend/tailwind.config.js`:

```javascript
animation: {
  'your-animation': 'your-keyframes 1s ease-in-out',
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build:frontend`
2. Deploy the `frontend/dist` folder

### Backend (Railway/Render)
1. Build the backend: `npm run build:backend`
2. Deploy the `backend/dist` folder
3. Set environment variables
4. Update CORS origins in production

### Database
- The SQLite database file will be created automatically
- For production, consider using a managed database service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Built with ❤️ for kids who love to create and manage their own virtual stores
- Special thanks to the React, Vite, and Tailwind CSS communities
- Icons provided by Lucide React

---

**Happy Store Managing! 🛍️✨** 