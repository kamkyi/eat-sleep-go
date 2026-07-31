import { ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from './UI';
import { useI18n } from '../i18n';

export default function DestinationCard({ destination }) {
  const { t } = useI18n();
  const name = t(`destinations.${destination.id}.name`);

  return (
    <article className="destination-card">
      <ImageWithFallback src={destination.image} alt={t('destinations.cardAlt', { name })} loading="lazy" />
      <div className="destination-card__overlay">
        <p>{t(`destinations.${destination.id}.drive`)}</p>
        <h3>{name}</h3>
        <span>{t(`destinations.${destination.id}.detail`)}</span>
      </div>
      <div className="destination-card__icon"><ArrowUpRight aria-hidden="true" /></div>
    </article>
  );
}
