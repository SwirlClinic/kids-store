import { itemsDb } from './database';

const sampleItems = [
  {
    name: '🦄 Magical Unicorn Toy',
    price: 29.99,
    description: 'A sparkly unicorn that makes magical sounds!'
  },
  {
    name: '🚗 Super Fast Race Car',
    price: 19.99,
    description: 'Zoom zoom! The fastest car in the world!'
  },
  {
    name: '🎨 Rainbow Paint Set',
    price: 15.50,
    description: 'Create beautiful masterpieces with 24 colors!'
  },
  {
    name: '🧸 Cuddly Teddy Bear',
    price: 25.00,
    description: 'The softest friend you\'ll ever have!'
  },
  {
    name: '🏀 Bouncy Basketball',
    price: 12.99,
    description: 'Perfect for playing with friends!'
  },
  {
    name: '📚 Adventure Story Book',
    price: 8.99,
    description: 'Exciting stories for bedtime reading!'
  },
  {
    name: '🎮 Mini Game Console',
    price: 45.00,
    description: 'Fun games for hours of entertainment!'
  },
  {
    name: '🎪 Circus Tent Playset',
    price: 35.99,
    description: 'Your own mini circus at home!'
  }
];

export function populateSampleData() {
  console.log('🎪 Adding sample items to your store...');
  
  let addedCount = 0;
  
  sampleItems.forEach(item => {
    try {
      const itemId = itemsDb.create(item.name, item.price);
      console.log(`✅ Added: ${item.name} (ID: ${itemId})`);
      addedCount++;
    } catch (error) {
      console.error(`❌ Failed to add ${item.name}:`, error);
    }
  });
  
  console.log(`\n🎉 Successfully added ${addedCount} sample items!`);
  console.log('🛍️ Your store is now ready for business!');
}

// Run if this file is executed directly
if (require.main === module) {
  populateSampleData();
} 