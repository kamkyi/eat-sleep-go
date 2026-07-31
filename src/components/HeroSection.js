import { ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { ImageWithFallback, PrimaryButton, SecondaryButton } from './UI';
import { useI18n } from '../i18n';

const MARQUEE_KEYS = ['hero.marquee1', 'hero.marquee2', 'hero.marquee3', 'hero.marquee4'];

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow"><Sparkles size={16} aria-hidden="true" /> {t('hero.eyebrow')}</p>
          <h1>{t('hero.titleLine1')}<br />{t('hero.titleLine2')} <em>{t('hero.titleEm')}</em></h1>
          <p className="hero__lead">{t('hero.lead')}</p>
          <div className="hero__actions">
            <PrimaryButton to="/booking">{t('hero.ctaPrimary')} <ArrowRight size={18} aria-hidden="true" /></PrimaryButton>
            <SecondaryButton to="/cars">{t('hero.ctaSecondary')}</SecondaryButton>
          </div>
          <div className="hero__trust">
            <span><ShieldCheck size={19} aria-hidden="true" /> {t('hero.trustVehicles')}</span>
            <span><MapPin size={19} aria-hidden="true" /> {t('hero.trustSupport')}</span>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__image-wrap">
            <ImageWithFallback src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85" alt={t('hero.imageAlt')} />
          </div>
          <div className="hero__note hero__note--top"><span>{t('hero.noteTopLabel')}</span><strong>{t('hero.noteTopValue')}</strong></div>
          <div className="hero__note hero__note--bottom"><span>{t('hero.noteBottomLabel')}</span><strong>{t('hero.noteBottomValue')}</strong><small>{t('hero.noteBottomHint')}</small></div>
        </div>
      </div>
      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          {[0, 1].map((copy) => (
            <ul className="hero__marquee-group" key={copy}>
              {MARQUEE_KEYS.map((key) => <li key={key}>{t(key)}</li>)}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
