export interface StoreItem {
  id: number;
  name: string;
  price: number;
  image_path?: string;
  sound_file?: string;
  created_at: string;
}

export interface AddItemRequest {
  name: string;
  price: number;
  image?: File;
  sound?: File;
}

export interface UpdateItemRequest {
  name?: string;
  price?: number;
  image?: File;
  sound?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 