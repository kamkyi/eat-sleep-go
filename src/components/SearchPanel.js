import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Car, MapPin, Search } from 'lucide-react';
import { carTypes, serviceCities } from '../data/cars';
import { useI18n } from '../i18n';

const today = () => new Date().toISOString().split('T')[0];
const defaultCity = serviceCities.find((city) => city.available)?.id || '';

// The panel only builds a query string; /cars owns the filtering.
export default function SearchPanel({ initial = {} }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({ location: defaultCity, pickup: '', dropoff: '', type: '', ...initial });

  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(Object.entries(form).filter(([, value]) => value));
    const query = params.toString();
    navigate(query ? `/cars?${query}` : '/cars');
  };

  return (
    <form className="search-panel" onSubmit={submit} aria-label={t('search.submit')}>
      <div className="search-panel__fields">
        <label className="search-field">
          <MapPin size={18} aria-hidden="true" />
          <span>{t('search.where')}</span>
          <select name="location" value={form.location} onChange={update}>
            {serviceCities.map(({ id, available }) => (
              <option key={id} value={id} disabled={!available}>
                {t(`carData.location.${id}`)}{available ? '' : ` · ${t('search.soon')}`}
              </option>
            ))}
          </select>
        </label>
        <label className="search-field">
          <CalendarDays size={18} aria-hidden="true" />
          <span>{t('search.pickup')}</span>
          <input type="date" name="pickup" min={today()} value={form.pickup} onChange={update} />
        </label>
        <label className="search-field">
          <CalendarDays size={18} aria-hidden="true" />
          <span>{t('search.dropoff')}</span>
          <input type="date" name="dropoff" min={form.pickup || today()} value={form.dropoff} onChange={update} />
        </label>
        {carTypes.length > 1 && (
          <label className="search-field">
            <Car size={18} aria-hidden="true" />
            <span>{t('search.type')}</span>
            <select name="type" value={form.type} onChange={update}>
              <option value="">{t('search.typeAny')}</option>
              {carTypes.map((type) => <option key={type} value={type}>{t(`carData.type.${type}`)}</option>)}
            </select>
          </label>
        )}
      </div>
      <button className="search-panel__submit" type="submit"><Search size={18} aria-hidden="true" />{t('search.submit')}</button>
    </form>
  );
}
