import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarCheck, Check, Fuel, Gauge, MapPin, ShieldCheck, Users } from 'lucide-react';
import { cars, includedServices, rentalRequirements } from '../data/cars';
import { ErrorState, ImageWithFallback, PrimaryButton, SecondaryButton } from '../components/UI';
import { useI18n } from '../i18n';

export default function CarDetailsPage() {
  const { carId } = useParams();
  const { t } = useI18n();
  const car = cars.find((item) => item.id === carId);
  const [activeImage, setActiveImage] = useState(0);
  if (!car) return <section className="section"><div className="container"><ErrorState title={t('carDetail.notFoundTitle')} message={t('carDetail.notFoundMessage')} action={<SecondaryButton to="/cars">{t('carDetail.notFoundAction')}</SecondaryButton>} /></div></section>;

  return (
    <section className="section car-detail"><div className="container">
      <div className="detail-breadcrumb"><a href="#/cars">{t('carDetail.breadcrumb')}</a><span>/</span><span>{car.brand} {car.model}</span></div>
      <div className="detail-layout">
        <div className="gallery"><div className="gallery__main"><ImageWithFallback src={car.gallery[activeImage]} alt={t('carDetail.imageAlt', { brand: car.brand, model: car.model, index: activeImage + 1 })} /><span className={`status-badge ${car.available ? 'is-available' : 'is-unavailable'}`}><i aria-hidden="true" />{car.available ? t('carDetail.available') : t('carDetail.booked')}</span></div><div className="gallery__thumbs">{car.gallery.map((image, index) => <button key={image} type="button" onClick={() => setActiveImage(index)} aria-label={t('carDetail.thumbLabel', { index: index + 1 })} className={activeImage === index ? 'is-active' : ''}><ImageWithFallback src={image} alt="" /></button>)}</div></div>
        <aside className="detail-summary"><p className="eyebrow">{car.year} · {t(`carData.type.${car.type}`)}</p><h1>{car.brand} <em>{car.model}</em></h1><p>{t(`carData.description.${car.id}`)}</p><div className="detail-specs"><span><Gauge aria-hidden="true" /><small>{t('carDetail.transmission')}</small><strong>{t(`carData.transmission.${car.transmission}`)}</strong></span><span><Users aria-hidden="true" /><small>{t('carDetail.capacity')}</small><strong>{t('carDetail.seats', { count: car.seats })}</strong></span><span><Fuel aria-hidden="true" /><small>{t('carDetail.fuel')}</small><strong>{t(`carData.fuel.${car.fuel}`)}</strong></span><span><MapPin aria-hidden="true" /><small>{t('carDetail.location')}</small><strong>{t(`carData.location.${car.location}`)}</strong></span></div><div className="detail-price"><div><small>{t('carDetail.dailyRate')}</small><strong>฿{car.pricePerDay.toLocaleString()}</strong><span>{t('common.perDay')}</span></div><p>{t('carDetail.monthlyFrom')} <strong>฿{car.pricePerMonth.toLocaleString()}</strong></p></div><PrimaryButton to={`/booking?car=${car.id}`} className={!car.available ? 'is-disabled button--wide' : 'button--wide'} aria-disabled={!car.available} tabIndex={car.available ? undefined : -1}>{car.available ? t('carDetail.request') : t('carDetail.unavailable')}</PrimaryButton><SecondaryButton to="/contact" className="button--wide">{t('carDetail.askQuestion')}</SecondaryButton></aside>
      </div>
      <div className="detail-info-grid"><article><span className="detail-info-grid__icon"><ShieldCheck aria-hidden="true" /></span><h2>{t('carDetail.includedTitle')}</h2><ul>{includedServices.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{t(`carData.included.${item}`)}</li>)}</ul></article><article><span className="detail-info-grid__icon"><CalendarCheck aria-hidden="true" /></span><h2>{t('carDetail.requirementsTitle')}</h2><ul>{rentalRequirements.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{t(`carData.requirements.${item}`)}</li>)}</ul></article></div>
    </div></section>
  );
}
