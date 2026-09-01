import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import CarCard from '../components/CarCard';
import CarFilters from '../components/CarFilters';
import { EmptyState, SecondaryButton } from '../components/UI';
import { cars } from '../data/cars';
import { useI18n } from '../i18n';

const FILTER_KEYS = ['type', 'price', 'transmission', 'location', 'availability'];

export default function CarsPage() {
  const { t } = useI18n();
  // The URL is the filter state, so hero searches and quick links land here already applied.
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) || 'all'])),
    [searchParams],
  );

  const filteredCars = useMemo(() => cars.filter((car) => {
    if (filters.type !== 'all' && car.type !== filters.type) return false;
    if (filters.price !== 'all' && car.pricePerDay > Number(filters.price)) return false;
    if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;
    if (filters.location !== 'all' && car.location !== filters.location) return false;
    if (filters.availability === 'available' && !car.available) return false;
    if (filters.availability === 'booked' && car.available) return false;
    return true;
  }), [filters]);

  const commit = (mutate) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, { replace: true });
  };
  const update = ({ target }) => commit((next) => (target.value === 'all' ? next.delete(target.name) : next.set(target.name, target.value)));
  const reset = () => commit((next) => FILTER_KEYS.forEach((key) => next.delete(key)));

  // Dates chosen in the hero search ride along into the booking form.
  const city = searchParams.get('location');
  const pickup = searchParams.get('pickup');
  const dropoff = searchParams.get('dropoff');
  const bookingQuery = ['pickup', 'dropoff', 'location']
    .filter((key) => searchParams.get(key))
    .map((key) => `&${key}=${encodeURIComponent(searchParams.get(key))}`)
    .join('');

  return (
    <section className="section fleet-section">
      <div className="container">
        {(city || pickup || dropoff) && (
          <p className="fleet-dates">
            {city && <span><MapPin size={15} aria-hidden="true" />{t('search.where')}: <strong>{t(`carData.location.${city}`)}</strong></span>}
            {pickup && <span><CalendarDays size={15} aria-hidden="true" />{t('search.pickup')}: <strong>{pickup}</strong></span>}
            {dropoff && <span><CalendarDays size={15} aria-hidden="true" />{t('search.dropoff')}: <strong>{dropoff}</strong></span>}
          </p>
        )}

        <CarFilters filters={filters} onChange={update} onReset={reset} resultCount={filteredCars.length} />

        {filteredCars.length ? (
          <div className="car-grid car-grid--fleet">{filteredCars.map((car) => <CarCard key={car.id} car={car} bookingQuery={bookingQuery} />)}</div>
        ) : (
          <EmptyState title={t('cars.emptyTitle')} message={t('cars.emptyMessage')} action={<SecondaryButton onClick={reset}>{t('cars.emptyAction')}</SecondaryButton>} />
        )}
      </div>
    </section>
  );
}
