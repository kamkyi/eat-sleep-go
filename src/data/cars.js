const photo = (file) => `${process.env.PUBLIC_URL}/cars/${file}`;

export const cars = [
  {
    id: 'honda-city-2013',
    brand: 'Honda',
    model: 'City',
    year: 2013,
    type: 'Sedan',
    transmission: 'Automatic',
    seats: 5,
    fuel: 'Petrol',
    pricePerDay: 750,
    pricePerMonth: 15000,
    available: true,
    featured: true,
    location: 'Bangkok',
    image: photo('honda-city-front.jpg'),
    gallery: [
      photo('honda-city-front.jpg'),
      photo('honda-city-left.jpg'),
      photo('honda-city-right.jpg'),
      photo('honda-city-back.jpg'),
      photo('honda-city-interior-front.jpg'),
      photo('honda-city-interior-cabin.jpg'),
      photo('honda-city-interior-rear.jpg'),
    ],
  },
  {
    id: 'mazda-2-2019',
    brand: 'Mazda',
    model: '2 Sedan',
    year: 2019,
    type: 'Sedan',
    transmission: 'Automatic',
    seats: 5,
    fuel: 'Petrol',
    pricePerDay: 950,
    pricePerMonth: 18500,
    available: false,
    featured: true,
    location: 'Bangkok',
    image: photo('mazda-2-front.jpg'),
    gallery: [
      photo('mazda-2-front.jpg'),
      photo('mazda-2-left.jpg'),
      photo('mazda-2-right.jpg'),
      photo('mazda-2-back.jpg'),
      photo('mazda-2-interior-front.jpg'),
      photo('mazda-2-interior-cabin.jpg'),
      photo('mazda-2-interior-rear.jpg'),
    ],
  },
];

// Bangkok is the only city we hand over cars in today. The rest stay visible in
// every city menu — but disabled — so travellers can see where we go next.
export const serviceCities = [
  { id: 'Bangkok', available: true },
  { id: 'Chiang Mai', available: false },
  { id: 'Phuket', available: false },
];

// Derived from the fleet so a filter can never offer an option with nothing behind it.
export const carTypes = [...new Set(cars.map((car) => car.type))];
export const lowestPrice = (list) => list.reduce((low, car) => Math.min(low, car.pricePerDay), Infinity);

// Labels for these live in src/i18n/translations.js under carData.
export const includedServices = ['insurance', 'maintenance', 'roadside', 'clean'];

export const rentalRequirements = ['licence', 'id', 'age', 'deposit'];
