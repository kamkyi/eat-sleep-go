import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useI18n } from '../i18n';

export default function CarFilters({ filters, onChange, onReset, resultCount }) {
  const { t } = useI18n();

  return (
    <aside className="filters" aria-label={t('cars.filtersLabel')}>
      <div className="filters__heading"><div><SlidersHorizontal size={20} aria-hidden="true" /><strong>{t('cars.filtersTitle')}</strong></div><button type="button" onClick={onReset}><RotateCcw size={15} aria-hidden="true" /> {t('cars.filtersReset')}</button></div>
      <div className="filters__grid">
        <label>{t('cars.filterType')}<select name="type" value={filters.type} onChange={onChange}><option value="all">{t('cars.filterTypeAll')}</option><option value="Sedan">{t('carData.type.Sedan')}</option><option value="Compact">{t('carData.type.Compact')}</option><option value="SUV">{t('carData.type.SUV')}</option></select></label>
        <label>{t('cars.filterPrice')}<select name="price" value={filters.price} onChange={onChange}><option value="all">{t('cars.filterPriceAll')}</option><option value="1000">{t('cars.filterPriceUpTo', { amount: '1,000' })}</option><option value="1500">{t('cars.filterPriceUpTo', { amount: '1,500' })}</option><option value="2500">{t('cars.filterPriceUpTo', { amount: '2,500' })}</option></select></label>
        <label>{t('cars.filterTransmission')}<select name="transmission" value={filters.transmission} onChange={onChange}><option value="all">{t('cars.filterTransmissionAll')}</option><option value="Automatic">{t('carData.transmission.Automatic')}</option><option value="Manual">{t('carData.transmission.Manual')}</option></select></label>
        <label>{t('cars.filterAvailability')}<select name="availability" value={filters.availability} onChange={onChange}><option value="all">{t('cars.filterAvailabilityAll')}</option><option value="available">{t('cars.filterAvailabilityFree')}</option><option value="booked">{t('cars.filterAvailabilityBooked')}</option></select></label>
      </div>
      <p className="filters__result" aria-live="polite">{t(resultCount === 1 ? 'cars.resultCountOne' : 'cars.resultCount', { count: resultCount })}</p>
    </aside>
  );
}
