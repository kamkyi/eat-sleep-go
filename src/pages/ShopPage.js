import { useMemo, useState } from 'react';
import { Car, Check, Home, LayoutGrid, ShoppingBag, Sparkles } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { EmptyState, PrimaryButton, SecondaryButton, SectionHeading } from '../components/UI';
import { finalPrice, useMarketplaceListings } from '../lib/partnerStore';
import { useI18n } from '../i18n';

const tabs = [
  { id: 'all', icon: LayoutGrid, labelKey: 'shop.filterAll' },
  { id: 'car', icon: Car, labelKey: 'marketplace.categoryPlural.car' },
  { id: 'room', icon: Home, labelKey: 'marketplace.categoryPlural.room' },
  { id: 'product', icon: ShoppingBag, labelKey: 'marketplace.categoryPlural.product' },
];

const sorters = {
  featured: (a, b) => Number(b.available) - Number(a.available),
  discount: (a, b) => (b.discountPercent || 0) - (a.discountPercent || 0),
  priceLow: (a, b) => finalPrice(a) - finalPrice(b),
  priceHigh: (a, b) => finalPrice(b) - finalPrice(a),
};

export default function ShopPage() {
  const { t } = useI18n();
  const listings = useMarketplaceListings();
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');

  const visible = useMemo(() => listings
    .filter((listing) => category === 'all' || listing.category === category)
    .sort(sorters[sort] || sorters.featured), [listings, category, sort]);

  const deals = listings.filter((listing) => listing.discountPercent > 0).length;

  return (
    <>
      <section className="section shop-section">
        <div className="container">
          <div className="section-top">
            <SectionHeading eyebrow={t('shop.eyebrow')} title={t('shop.title')} description={t('shop.description')} />
            <p className="shop-deals"><Sparkles size={16} aria-hidden="true" />{t('shop.deals', { count: deals })}</p>
          </div>

          <div className="shop-toolbar">
            <div className="shop-tabs" role="tablist" aria-label={t('shop.filterLabel')}>
              {tabs.map(({ id, icon: Icon, labelKey }) => (
                <button key={id} type="button" role="tab" aria-selected={category === id} className={category === id ? 'is-active' : ''} onClick={() => setCategory(id)}>
                  <Icon size={17} aria-hidden="true" />{t(labelKey)}
                </button>
              ))}
            </div>
            <label className="shop-sort">{t('shop.sortLabel')}
              <select value={sort} onChange={({ target }) => setSort(target.value)}>
                <option value="featured">{t('shop.sortFeatured')}</option>
                <option value="discount">{t('shop.sortDiscount')}</option>
                <option value="priceLow">{t('shop.sortPriceLow')}</option>
                <option value="priceHigh">{t('shop.sortPriceHigh')}</option>
              </select>
            </label>
          </div>

          <p className="filters__result" aria-live="polite">{t(visible.length === 1 ? 'shop.resultCountOne' : 'shop.resultCount', { count: visible.length })}</p>

          {visible.length ? (
            <div className="listing-grid">{visible.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div>
          ) : (
            <EmptyState title={t('shop.emptyTitle')} message={t('shop.emptyMessage')} action={<SecondaryButton onClick={() => setCategory('all')}>{t('shop.emptyAction')}</SecondaryButton>} />
          )}
        </div>
      </section>

      <section className="section final-cta shop-cta">
        <div className="container">
          <div className="final-cta__card">
            <div>
              <p className="eyebrow">{t('shop.ctaEyebrow')}</p>
              <h2>{t('shop.ctaTitle')}</h2>
              <p>{t('shop.ctaText')}</p>
              <ul>
                <li><Check size={18} aria-hidden="true" />{t('shop.ctaPoint1')}</li>
                <li><Check size={18} aria-hidden="true" />{t('shop.ctaPoint2')}</li>
              </ul>
            </div>
            <PrimaryButton to="/partner">{t('shop.ctaButton')}</PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
