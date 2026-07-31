import { Fuel, Gauge, Users } from 'lucide-react';
import { ImageWithFallback, PrimaryButton, SecondaryButton } from './UI';
import { useI18n } from '../i18n';

export default function CarCard({ car }) {
  const { t } = useI18n();

  return (
    <article className="car-card">
      <div className="car-card__image">
        <ImageWithFallback src={car.image} alt={`${car.year} ${car.brand} ${car.model}`} loading="lazy" />
        <span className={`status-badge ${car.available ? 'is-available' : 'is-unavailable'}`}><i aria-hidden="true" />{car.available ? t('cars.badgeAvailable') : t('cars.badgeBooked')}</span>
        <span className="car-card__type">{t(`carData.type.${car.type}`)}</span>
      </div>
      <div className="car-card__body">
        <p className="car-card__year">{car.year} · {t(`carData.location.${car.location}`)}</p>
        <h3>{car.brand} {car.model}</h3>
        <div className="car-specs" aria-label={t('cars.specsLabel')}>
          <span><Gauge size={17} aria-hidden="true" />{t(`carData.transmission.${car.transmission}`)}</span>
          <span><Users size={17} aria-hidden="true" />{t('cars.seats', { count: car.seats })}</span>
          <span><Fuel size={17} aria-hidden="true" />{t(`carData.fuel.${car.fuel}`)}</span>
        </div>
        <div className="car-card__price"><div><small>{t('common.from')}</small><strong>฿{car.pricePerDay.toLocaleString()}</strong><span>{t('common.perDay')}</span></div><p>฿{car.pricePerMonth.toLocaleString()} {t('common.perMonth')}</p></div>
        <div className="car-card__actions">
          <SecondaryButton to={`/cars/${car.id}`}>{t('cars.viewDetails')}</SecondaryButton>
          <PrimaryButton to={`/booking?car=${car.id}`} className={!car.available ? 'is-disabled' : ''} aria-disabled={!car.available} tabIndex={car.available ? undefined : -1}>{t('cars.bookNow')}</PrimaryButton>
        </div>
      </div>
    </article>
  );
}
