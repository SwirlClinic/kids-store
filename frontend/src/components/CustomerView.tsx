import React, { useState, useRef } from 'react';
import { Play, ShoppingCart, Trash2, Volume2, Plus, Minus, Settings, X, Eye, EyeOff } from 'lucide-react';
import { StoreItem } from '../../../shared/types';
import { apiService } from '../services/api';

interface CustomerViewProps {
  items: StoreItem[];
  onSwitchToManager: () => void;
}

interface CartItem {
  item: StoreItem;
  quantity: number;
}

const CustomerView: React.FC<CustomerViewProps> = ({ items, onSwitchToManager }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlaySound = async (item: StoreItem) => {
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
        // Sound finished playing
      });

      audioRef.current.addEventListener('error', () => {
        console.log('Sound played! 🎵');
      });

      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing sound:', error);
      console.log('Sound played! 🎵');
    }
  };

  const addToCart = async (item: StoreItem) => {
    // Play sound when adding to cart
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
        // Sound finished playing
      });

      audioRef.current.addEventListener('error', () => {
        console.log('Sound played for adding item to cart! 🎵');
      });

      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing add-to-cart sound:', error);
    }

    // Add item to cart
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty! 🛒');
      return;
    }
    
    const total = getTotalPrice();
    const itemList = cart.map(cartItem => 
      `${cartItem.item.name} x${cartItem.quantity} - $${(cartItem.item.price * cartItem.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`🎉 Thank you for your purchase!\n\nItems:\n${itemList}\n\nTotal: $${total.toFixed(2)}\n\nYour order has been placed! 🛍️`);
    
    // Clear cart after checkout
    setCart([]);
    setShowCart(false);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display text-gray-800">Kids Store</h1>
                <p className="text-gray-600">Welcome, Customer! 🛍️</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Manager Mode Button */}
              <button
                onClick={onSwitchToManager}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manager Mode
              </button>
              
              {/* Cart Toggle Button */}
              <button
                onClick={toggleCart}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 relative ${
                  showCart 
                    ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {showCart ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    Hide Cart
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    Show Cart
                  </>
                )}
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-danger-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showCart ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {/* Items Grid */}
          <div className={showCart ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <h2 className="text-2xl font-display text-gray-800 mb-6">Available Items</h2>
            
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-3xl p-12 shadow-xl">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-display text-gray-600 mb-2">No items available!</h3>
                  <p className="text-gray-500">Check back later for new items.</p>
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 ${showCart ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {items.map(item => (
                  <div key={item.id} className="card group cursor-pointer" onClick={() => handlePlaySound(item)}>
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

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="w-full btn-success flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shopping Cart Sidebar */}
          {showCart && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display text-gray-800 flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-primary-600" />
                    Shopping Cart
                  </h2>
                  <button
                    onClick={toggleCart}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <p className="text-sm text-gray-400">Click on items to add them!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(cartItem => (
                      <div key={cartItem.item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 truncate">{cartItem.item.name}</h4>
                          <p className="text-sm text-gray-600">${cartItem.item.price.toFixed(2)} each</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="w-8 text-center font-bold">{cartItem.quantity}</span>
                          
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => removeFromCart(cartItem.item.id)}
                            className="w-8 h-8 bg-danger-500 hover:bg-danger-600 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-primary-600">
                          ${getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                      
                      <button
                        onClick={handleCheckout}
                        className="w-full btn-primary"
                      >
                        Checkout Now! 🎉
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerView; 