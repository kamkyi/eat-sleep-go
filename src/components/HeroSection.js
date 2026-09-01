import { Link } from 'react-router-dom';
import { BadgeCheck, Headphones, MapPin, Wallet } from 'lucide-react';
import SearchPanel from './SearchPanel';
import { ImageWithFallback } from './UI';
import { useI18n } from '../i18n';

const trust = [
  { id: 'vehicles', icon: BadgeCheck, key: 'hero.trustVehicles' },
  { id: 'support', icon: Headphones, key: 'hero.trustSupport' },
  { id: 'pricing', icon: Wallet, key: 'hero.trustPricing' },
];

// Every chip has to land on real stock, so these track the filters the fleet supports.
const quickLinks = [
  { id: 'available', to: '/cars?availability=available', key: 'cars.filterAvailabilityFree' },
  { id: 'automatic', to: '/cars?transmission=Automatic', key: 'search.quickAutomatic' },
  { id: 'budget', to: '/cars?price=1000', key: 'search.quickBudget' },
];

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="hero">
      <div className="hero__stage">
        <ImageWithFallback src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=2000&q=80" alt={t('hero.imageAlt')} fetchPriority="high" />
        <div className="container hero__content">
          <p className="eyebrow"><MapPin size={15} aria-hidden="true" /> {t('hero.eyebrow')}</p>
          <h1>{t('hero.title')} <em>{t('hero.titleEm')}</em></h1>
          <p className="hero__lead">{t('hero.lead')}</p>
        </div>
      </div>

      <div className="container hero__panel">
        <SearchPanel />
        <div className="search-quick">
          <span>{t('search.quickLabel')}</span>
          {quickLinks.map(({ id, to, key }) => <Link key={id} to={to}>{t(key)}</Link>)}
        </div>
        <div className="hero__trust">
          {trust.map(({ id, icon: Icon, key }) => <span key={id}><Icon size={18} aria-hidden="true" />{t(key)}</span>)}
        </div>
      </div>
    </section>
  );
}
