import { StoreItem, AddItemRequest, UpdateItemRequest, ApiResponse } from '../../../shared/types';

export type { StoreItem, AddItemRequest, UpdateItemRequest, ApiResponse };

export interface AudioPlayer {
  play: () => Promise<void>;
  pause: () => void;
  currentTime: number;
  duration: number;
  ended: boolean;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}

export interface FileUpload {
  file: File;
  preview?: string;
  type: 'image' | 'sound';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface FormData {
  name: string;
  price: string;
  image?: File;
  sound?: File;
} 