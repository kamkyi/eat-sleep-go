import { Link } from 'react-router-dom';
import { Car, CarFront, Truck } from 'lucide-react';
import { cars, carTypes, lowestPrice } from '../data/cars';
import { useI18n } from '../i18n';

const icons = { Compact: Car, Sedan: CarFront, SUV: Truck };

export default function VehicleTypeRow() {
  const { t } = useI18n();

  return (
    <div className="type-row">
      {carTypes.map((type) => {
        const matches = cars.filter((car) => car.type === type);
        const Icon = icons[type] || Car;
        return (
          <Link key={type} className="type-card" to={`/cars?type=${encodeURIComponent(type)}`}>
            <span className="type-card__icon"><Icon size={21} aria-hidden="true" /></span>
            <strong>{t(`carData.type.${type}`)}</strong>
            <small>
              {t(matches.length === 1 ? 'home.typeCountOne' : 'home.typeCount', { count: matches.length })}
              {' · '}
              {t('home.typeFrom', { amount: lowestPrice(matches).toLocaleString() })}
            </small>
          </Link>
        );
      })}
    </div>
  );
}
