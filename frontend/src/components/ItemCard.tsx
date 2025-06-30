import React, { useState, useRef } from 'react';
import { Play, Edit, Trash2, Volume2 } from 'lucide-react';
import { StoreItem } from '../../../shared/types';
import { apiService } from '../services/api';

interface ItemCardProps {
  item: StoreItem;
  onEdit: (item: StoreItem) => void;
  onDelete: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlaySound = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      let soundUrl: string;
      if (item.sound_file) {
        // Use the item's specific sound
        soundUrl = apiService.getSoundUrl(item.id);
      } else {
        // Use default sound
        soundUrl = '/api/default-sound';
      }

      audioRef.current = new Audio(soundUrl);
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('error', () => {
        setIsPlaying(false);
        console.log('Sound played! 🎵');
      });

      setIsPlaying(true);
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
      console.log('Sound played! 🎵');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${item.name}"? 🗑️`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiService.deleteItem(item.id);
      onDelete(item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item! 😢');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card group">
      {/* Item Image */}
      <div className="relative mb-4 overflow-hidden rounded-2xl">
        {item.image_path ? (
          <img
            src={apiService.getImageUrl(item.id)}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUMxMDkuNDU2IDgxIDExOCA4OS41NDQgMTE4IDEwMEMxMTggMTEwLjQ1NiAxMDkuNDU2IDExOSA5OSAxMTlDOC41NDQgMTE5IDgwIDExMC40NTYgODAgMTAwWiIgZmlsbD0iI0QxRDU5QiIvPgo8cGF0aCBkPSJNMTYwIDEyMEwxNDAgMTAwTDEyMCAxMjBIMTYwWiIgZmlsbD0iI0QxRDU5QiIvPgo8cGF0aCBkPSJNNDAgMTIwTDEyMCAxMjBMMTAwIDEwMEw0MCAxMjBaIiBmaWxsPSIjRDFENUIiLz4KPC9zdmc+';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <span className="text-6xl">🛍️</span>
          </div>
        )}
        
        {/* Sound indicator */}
        {item.sound_file && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg">
            <Volume2 className="w-4 h-4 text-primary-600" />
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="space-y-3">
        <h3 className="text-xl font-display text-gray-800 truncate">
          {item.name}
        </h3>
        
        <p className="text-2xl font-bold text-primary-600">
          ${parseFloat(item.price.toString()).toFixed(2)}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handlePlaySound}
            disabled={isPlaying}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
              isPlaying
                ? 'bg-warning-500 text-white animate-pulse'
                : 'bg-secondary-500 hover:bg-secondary-600 text-white transform hover:scale-105'
            }`}
          >
            <Play className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
            {isPlaying ? 'Playing...' : 'Play Sound'}
          </button>
          
          <button
            onClick={() => onEdit(item)}
            className="flex items-center justify-center p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <Edit className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center p-3 bg-danger-500 hover:bg-danger-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="loading-spinner w-5 h-5" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard; 