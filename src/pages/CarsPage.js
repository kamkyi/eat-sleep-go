import { useMemo, useState } from 'react';
import CarCard from '../components/CarCard';
import CarFilters from '../components/CarFilters';
import { EmptyState, SecondaryButton } from '../components/UI';
import { cars } from '../data/cars';
import { useI18n } from '../i18n';

const defaults = { type: 'all', price: 'all', transmission: 'all', availability: 'all' };

export default function CarsPage() {
  const { t } = useI18n();
  const [filters, setFilters] = useState(defaults);
  const filteredCars = useMemo(() => cars.filter((car) => {
    if (filters.type !== 'all' && car.type !== filters.type) return false;
    if (filters.price !== 'all' && car.pricePerDay > Number(filters.price)) return false;
    if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;
    if (filters.availability === 'available' && !car.available) return false;
    if (filters.availability === 'booked' && car.available) return false;
    return true;
  }), [filters]);
  const update = ({ target }) => setFilters((current) => ({ ...current, [target.name]: target.value }));

  return <section className="section fleet-section"><div className="container"><CarFilters filters={filters} onChange={update} onReset={() => setFilters(defaults)} resultCount={filteredCars.length} />{filteredCars.length ? <div className="car-grid car-grid--fleet">{filteredCars.map((car) => <CarCard key={car.id} car={car} />)}</div> : <EmptyState title={t('cars.emptyTitle')} message={t('cars.emptyMessage')} action={<SecondaryButton onClick={() => setFilters(defaults)}>{t('cars.emptyAction')}</SecondaryButton>} />}</div></section>;
}
