import { MapPin, Store, Trash2 } from 'lucide-react';
import { ImageWithFallback, PrimaryButton } from './UI';
import { finalPrice, formatBaht, hasDiscount, unitFor } from '../lib/partnerStore';
import { useI18n } from '../i18n';

// Seeded listings are translated by id; partner-created ones keep the words their owner typed.
const listingCopy = (t, listing) => (listing.source === 'seed'
  ? { title: t(`marketplace.seed.${listing.id}.title`), description: t(`marketplace.seed.${listing.id}.description`) }
  : { title: listing.title, description: listing.description });

const translateLocation = (t, location) => {
  const key = `carData.location.${location}`;
  const translated = t(key);
  return translated === key ? location : translated;
};

export default function ListingCard({ listing, onRemove, preview = false }) {
  const { t } = useI18n();
  const { title, description } = listingCopy(t, listing);
  const price = finalPrice(listing);
  const discounted = hasDiscount(listing);
  const unit = t(`marketplace.unit.${unitFor(listing)}`);

  return (
    <article className={`listing-card ${preview ? 'listing-card--preview' : ''}`.trim()}>
      <div className="listing-card__image">
        <ImageWithFallback src={listing.image || `${process.env.PUBLIC_URL}/eat-sleep-go-logo.jpg`} alt={title} className={listing.image ? '' : 'image--fallback'} loading="lazy" />
        <span className="listing-card__category">{t(`marketplace.category.${listing.category}`)}</span>
        {discounted && <span className="listing-card__discount">−{listing.discountPercent}%</span>}
        {!listing.available && <span className="status-badge is-unavailable"><i aria-hidden="true" />{t('shop.badgeSoldOut')}</span>}
      </div>
      <div className="listing-card__body">
        <p className="listing-card__partner">
          <span><Store size={14} aria-hidden="true" />{listing.partner}</span>
          {listing.location && <span><MapPin size={14} aria-hidden="true" />{translateLocation(t, listing.location)}</span>}
        </p>
        <h3>{title}</h3>
        {description && <p className="listing-card__text">{description}</p>}
        <div className="listing-card__price">
          <div><strong>{formatBaht(price)}</strong><span>{unit}</span></div>
          {discounted && <p><s>{formatBaht(listing.price)}</s><em>{t('shop.save', { amount: formatBaht(listing.price - price) })}</em></p>}
        </div>
        {!preview && (
          <div className="listing-card__actions">
            <PrimaryButton to={`/contact?listing=${encodeURIComponent(listing.id)}`} className={listing.available ? '' : 'is-disabled'} aria-disabled={!listing.available} tabIndex={listing.available ? undefined : -1}>{t('shop.enquire')}</PrimaryButton>
            {onRemove && <button type="button" className="listing-card__remove" onClick={() => onRemove(listing)}><Trash2 size={16} aria-hidden="true" />{t('partner.remove')}</button>}
          </div>
        )}
      </div>
    </article>
  );
}
