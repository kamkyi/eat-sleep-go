// Partner marketplace. Copy for the seeded listings lives in src/i18n/translations.js
// under `marketplace.seed`, keyed by id. Listings partners create themselves are stored
// in the browser (see src/lib/partnerStore.js) and keep their own free-text copy.
export const categories = ['car', 'room', 'product'];

// Each category is priced on its own unit: cars per day, rooms per night, products each.
export const categoryUnit = { car: 'day', room: 'night', product: 'item' };

export const seedListings = [
  {
    id: 'seed-car-compact',
    category: 'car',
    partner: 'Chiang Mai Rides',
    location: 'Chiang Mai',
    price: 900,
    discountPercent: 15,
    available: true,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'seed-car-suv',
    category: 'car',
    partner: 'Siam Family Transfers',
    location: 'Bangkok',
    price: 2600,
    discountPercent: 10,
    available: true,
    image: 'https://images.unsplash.com/photo-1511527844068-006b95d162c2?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'seed-room-riverside',
    category: 'room',
    partner: 'Baan Suan Stay',
    location: 'Chiang Mai',
    price: 1200,
    discountPercent: 20,
    available: true,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'seed-room-beach',
    category: 'room',
    partner: 'Andaman Bungalows',
    location: 'Phuket',
    price: 2200,
    discountPercent: 12,
    available: false,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'seed-product-camping',
    category: 'product',
    partner: 'Go Gear Bangkok',
    location: 'Bangkok',
    price: 890,
    discountPercent: 25,
    available: true,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'seed-product-daypack',
    category: 'product',
    partner: 'Little Journey Co.',
    location: 'Bangkok',
    price: 450,
    discountPercent: 0,
    available: true,
    image: 'https://images.unsplash.com/photo-1503457574462-bd27054394c1?auto=format&fit=crop&w=1200&q=85',
  },
];
