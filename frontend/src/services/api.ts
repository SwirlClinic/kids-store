import { StoreItem, ApiResponse } from '../../../shared/types';

const API_BASE = '/api';

interface FormData {
  name: string;
  price: string;
  image?: File;
  sound?: File;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get all items
  async getItems(): Promise<StoreItem[]> {
    const response = await this.request<StoreItem[]>('/items');
    return response.data || [];
  }

  // Get item by ID
  async getItem(id: number): Promise<StoreItem> {
    const response = await this.request<StoreItem>(`/items/${id}`);
    return response.data!;
  }

  // Create new item
  async createItem(formData: FormData): Promise<StoreItem> {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    
    if (formData.image) {
      data.append('image', formData.image);
    }
    
    if (formData.sound) {
      data.append('sound', formData.sound);
    }

    const response = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create item');
    }

    return result.data;
  }

  // Update item
  async updateItem(id: number, formData: Partial<FormData>): Promise<StoreItem> {
    const data = new FormData();
    
    if (formData.name) {
      data.append('name', formData.name);
    }
    
    if (formData.price) {
      data.append('price', formData.price);
    }
    
    if (formData.image) {
      data.append('image', formData.image);
    }
    
    if (formData.sound) {
      data.append('sound', formData.sound);
    }

    const response = await fetch(`${API_BASE}/items/${id}`, {
      method: 'PUT',
      body: data,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update item');
    }

    return result.data;
  }

  // Delete item
  async deleteItem(id: number): Promise<void> {
    await this.request(`/items/${id}`, { method: 'DELETE' });
  }

  // Get image URL
  getImageUrl(id: number): string {
    return `${API_BASE}/items/${id}/image`;
  }

  // Get sound URL
  getSoundUrl(id: number): string {
    return `${API_BASE}/items/${id}/sound`;
  }
}

export const apiService = new ApiService(); 