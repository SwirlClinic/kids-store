import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, Volume2, Save } from 'lucide-react';
import { apiService } from '../services/api';
import { StoreItem } from '../../../shared/types';

interface AddItemFormProps {
  onItemAdded: (item: StoreItem) => void;
  onItemUpdated?: (item: StoreItem) => void;
  onClose: () => void;
  editingItem?: StoreItem | null;
}

interface FormData {
  name: string;
  price: string;
  image?: File;
  sound?: File;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ 
  onItemAdded, 
  onItemUpdated, 
  onClose, 
  editingItem 
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Pre-populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        price: editingItem.price.toString()
      });
    } else {
      setFormData({
        name: '',
        price: ''
      });
    }
  }, [editingItem]);

  const onImageDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFormData(prev => ({ ...prev, image: acceptedFiles[0] }));
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  }, []);

  const onSoundDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFormData(prev => ({ ...prev, sound: acceptedFiles[0] }));
      setErrors(prev => ({ ...prev, sound: undefined }));
    }
  }, []);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
    onDrop: onImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const { getRootProps: getSoundRootProps, getInputProps: getSoundInputProps, isDragActive: isSoundDragActive } = useDropzone({
    onDrop: onSoundDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024 // 2MB
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required!';
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      newErrors.price = 'Please enter a valid price!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = await apiService.updateItem(editingItem.id, formData);
        onItemUpdated?.(updatedItem);
      } else {
        // Create new item
        const newItem = await apiService.createItem(formData);
        onItemAdded(newItem);
      }
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
      alert(`Error ${editingItem ? 'updating' : 'creating'} item! 😢`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
  };

  const removeSound = () => {
    setFormData(prev => ({ ...prev, sound: undefined }));
  };

  const isEditing = !!editingItem;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-bold text-gray-700 mb-2">
            Item Name 🏷️
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, name: e.target.value }));
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            className={`input-field ${errors.name ? 'border-danger-500' : ''}`}
            placeholder="Enter item name..."
            maxLength={50}
          />
          {errors.name && (
            <p className="text-danger-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-lg font-bold text-gray-700 mb-2">
            Price 💰
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, price: e.target.value }));
              setErrors(prev => ({ ...prev, price: undefined }));
            }}
            className={`input-field ${errors.price ? 'border-danger-500' : ''}`}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.price && (
            <p className="text-danger-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            Item Image 📸
          </label>
          {formData.image ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-full h-32 object-cover rounded-2xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-danger-500 text-white rounded-full p-1 hover:bg-danger-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : editingItem?.image_path ? (
            <div className="relative">
              <img
                src={apiService.getImageUrl(editingItem.id)}
                alt="Current image"
                className="w-full h-32 object-cover rounded-2xl"
              />
              <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                Current
              </div>
            </div>
          ) : (
            <div
              {...getImageRootProps()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                isImageDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getImageInputProps()} />
              <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">
                {isImageDragActive
                  ? 'Drop the image here!'
                  : 'Drag & drop an image, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-1">JPEG, PNG, WebP (max 5MB)</p>
            </div>
          )}
        </div>

        {/* Sound Upload */}
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            Sound Effect 🔊
          </label>
          {formData.sound ? (
            <div className="relative">
              <div className="bg-secondary-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-secondary-600" />
                  <span className="font-medium text-secondary-700">{formData.sound.name}</span>
                </div>
                <button
                  type="button"
                  onClick={removeSound}
                  className="bg-danger-500 text-white rounded-full p-1 hover:bg-danger-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : editingItem?.sound_file ? (
            <div className="bg-secondary-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-6 h-6 text-secondary-600" />
                <span className="font-medium text-secondary-700">Current sound file</span>
              </div>
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                Current
              </div>
            </div>
          ) : (
            <div
              {...getSoundRootProps()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                isSoundDragActive
                  ? 'border-secondary-500 bg-secondary-50'
                  : 'border-gray-300 hover:border-secondary-400'
              }`}
            >
              <input {...getSoundInputProps()} />
              <Volume2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">
                {isSoundDragActive
                  ? 'Drop the sound here!'
                  : 'Drag & drop a sound file, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-1">MP3, WAV, OGG (max 2MB)</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 btn-success"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="loading-spinner w-5 h-5" />
                {isEditing ? 'Updating...' : 'Adding...'}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {isEditing ? (
                  <>
                    <Save className="w-5 h-5" />
                    Update Item
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Add Item
                  </>
                )}
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm; 