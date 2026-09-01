import { Link } from 'react-router-dom';
import { ImageWithFallback, PrimaryButton } from './UI';
import { useI18n } from '../i18n';

export default function CarCard({ car, bookingQuery = '' }) {
  const { t } = useI18n();
  const specs = [
    t(`carData.transmission.${car.transmission}`),
    t('cars.seats', { count: car.seats }),
    t(`carData.fuel.${car.fuel}`),
  ];

  return (
    <article className="car-card">
      <div className="car-card__image">
        <ImageWithFallback src={car.image} alt={`${car.year} ${car.brand} ${car.model}`} loading="lazy" />
        {!car.available && <span className="status-badge is-unavailable"><i aria-hidden="true" />{t('cars.badgeBooked')}</span>}
        <span className="car-card__type">{t(`carData.type.${car.type}`)}</span>
      </div>
      <div className="car-card__body">
        <div className="car-card__head">
          {/* The heading link stretches over the whole card; the button opts back out. */}
          <h3><Link className="car-card__link" to={`/cars/${car.id}`}>{car.brand} {car.model}</Link></h3>
          <p className="car-card__year">{car.year}</p>
        </div>
        <div className="car-specs" aria-label={t('cars.specsLabel')}>
          <span>{t(`carData.location.${car.location}`)}</span>
          {specs.map((spec) => <span key={spec}>{spec}</span>)}
        </div>
        <div className="car-card__price">
          <strong>฿{car.pricePerDay.toLocaleString()}</strong>
          <span>{t('common.perDay')}</span>
          <p>{t('cars.monthly', { amount: car.pricePerMonth.toLocaleString() })}</p>
        </div>
        <div className="car-card__actions">
          <PrimaryButton to={`/booking?car=${car.id}${bookingQuery}`} className={car.available ? '' : 'is-disabled'} aria-disabled={!car.available} tabIndex={car.available ? undefined : -1}>
            {car.available ? t('cars.bookNow') : t('cars.badgeBooked')}
          </PrimaryButton>
        </div>
      </div>
    </article>
  );
}
