import React, { useState, useEffect } from 'react';
import { Plus, Store, ShoppingCart, Users, Settings } from 'lucide-react';
import { StoreItem } from '../../shared/types';
import { apiService } from './services/api';
import ItemCard from './components/ItemCard';
import AddItemForm from './components/AddItemForm';
import Modal from './components/Modal';
import CustomerView from './components/CustomerView';

type AppMode = 'manager' | 'customer';

const App: React.FC = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [mode, setMode] = useState<AppMode>('customer');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await apiService.getItems();
      setItems(fetchedItems);
      setError(null);
    } catch (err) {
      console.error('Error loading items:', err);
      setError('Failed to load items! 😢');
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = (newItem: StoreItem) => {
    setItems(prev => [newItem, ...prev]);
    setShowAddForm(false);
  };

  const handleItemEdited = (updatedItem: StoreItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const handleItemDeleted = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-xl font-display text-primary-600">Loading your store... 🛍️</p>
        </div>
      </div>
    );
  }

  // Customer View
  if (mode === 'customer') {
    return <CustomerView items={items} onSwitchToManager={() => setMode('manager')} />;
  }

  // Manager View
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display text-gray-800">Kids Store</h1>
                <p className="text-gray-600">Store Manager Mode 🛠️</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setMode('customer')}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <Users className="w-4 h-4" />
                  Customer
                </button>
                <button
                  onClick={() => setMode('manager')}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-white text-primary-600 shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  Manager
                </button>
              </div>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Item
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-danger-100 border border-danger-300 rounded-2xl text-danger-700">
            <p className="font-bold">Oops! {error}</p>
            <button
              onClick={loadItems}
              className="mt-2 text-danger-600 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl p-12 shadow-xl max-w-md mx-auto">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-display text-gray-600 mb-2">Your store is empty!</h2>
              <p className="text-gray-500 mb-6">Start by adding your first item to the store.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                Add Your First Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleItemDeleted}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New Item 🆕"
      >
        <AddItemForm
          onItemAdded={handleItemAdded}
          onClose={() => setShowAddForm(false)}
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Item ✏️"
      >
        {editingItem && (
          <AddItemForm
            onItemAdded={handleItemAdded}
            onItemUpdated={handleItemEdited}
            onClose={() => setEditingItem(null)}
            editingItem={editingItem}
          />
        )}
      </Modal>
    </div>
  );
};

export default App; 