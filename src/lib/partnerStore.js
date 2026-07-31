import { useCallback, useEffect, useState } from 'react';
import { categories, categoryUnit, seedListings } from '../data/marketplace';

// Partner listings live in the browser only: this is a demo storefront with no backend,
// so anything a partner creates stays on their own device until a real API is connected.
const STORAGE_KEY = 'esg-partner-listings';
const CHANGE_EVENT = 'esg-partner-listings-change';

export const MAX_DISCOUNT = 90;

const isListing = (value) => Boolean(value) && typeof value === 'object' && typeof value.id === 'string' && categories.includes(value.category) && typeof value.price === 'number';

const read = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isListing) : [];
  } catch {
    return [];
  }
};

const write = (listings) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  } catch {
    /* storage unavailable — listings still show for this session */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const makeId = () => `partner-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const unitFor = (listing) => categoryUnit[listing.category] || 'item';

export const finalPrice = (listing) => Math.round(listing.price * (1 - Math.min(Math.max(listing.discountPercent || 0, 0), MAX_DISCOUNT) / 100));

export const hasDiscount = (listing) => finalPrice(listing) < listing.price;

export const formatBaht = (amount) => `฿${Number(amount).toLocaleString('en-US')}`;

/** Partner-created listings from this browser, kept in sync across mounted components. */
export function usePartnerListings() {
  const [listings, setListings] = useState(read);

  useEffect(() => {
    const sync = () => setListings(read());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const add = useCallback((draft) => {
    const listing = { ...draft, id: makeId(), createdAt: new Date().toISOString(), source: 'partner' };
    write([listing, ...read()]);
    return listing;
  }, []);

  const remove = useCallback((id) => write(read().filter((listing) => listing.id !== id)), []);

  return { listings, add, remove };
}

/** Seeded listings plus everything this browser's partners have added. */
export function useMarketplaceListings() {
  const { listings } = usePartnerListings();
  return [...listings, ...seedListings.map((listing) => ({ ...listing, source: 'seed' }))];
}
