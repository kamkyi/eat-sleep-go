import { ArrowRight, Car, Check, Clock3, Home, KeyRound, MessageCircle, ShoppingBag, Store } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CarCard from '../components/CarCard';
import DestinationSlider from '../components/DestinationSlider';
import TestimonialCard from '../components/TestimonialCard';
import VehicleTypeRow from '../components/VehicleTypeRow';
import { PrimaryButton, SecondaryButton, SectionHeading, TextLink } from '../components/UI';
import { cars, carTypes } from '../data/cars';
import { destinations, testimonials } from '../data/content';
import { useI18n } from '../i18n';

const steps = [
  { id: 'choose', number: '01', icon: Car, titleKey: 'home.step1Title', textKey: 'home.step1Text' },
  { id: 'request', number: '02', icon: MessageCircle, titleKey: 'home.step2Title', textKey: 'home.step2Text' },
  { id: 'go', number: '03', icon: KeyRound, titleKey: 'home.step3Title', textKey: 'home.step3Text' },
];

const partnerTypes = [
  { id: 'car', icon: Car, labelKey: 'marketplace.categoryPlural.car', textKey: 'home.partnerTypeCar' },
  { id: 'room', icon: Home, labelKey: 'marketplace.categoryPlural.room', textKey: 'home.partnerTypeRoom' },
  { id: 'product', icon: ShoppingBag, labelKey: 'marketplace.categoryPlural.product', textKey: 'home.partnerTypeProduct' },
];

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <HeroSection />

      {carTypes.length > 1 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow={t('home.typesEyebrow')} title={t('home.typesTitle')} description={t('home.typesDescription')} />
            <VehicleTypeRow />
          </div>
        </section>
      )}

      <section className="section section--surface">
        <div className="container">
          <div className="section-top">
            <SectionHeading eyebrow={t('home.fleetEyebrow')} title={t('home.fleetTitle')} description={t('home.fleetDescription')} />
            <TextLink to="/cars">{t('home.fleetLink')}</TextLink>
          </div>
          <div className="car-grid">{cars.filter((car) => car.featured).map((car) => <CarCard key={car.id} car={car} />)}</div>
        </div>
      </section>

      <section className="section how-it-works">
        <div className="container how-grid">
          <div className="how-it-works__intro">
            <p className="eyebrow">{t('home.stepsEyebrow')}</p>
            <h2>{t('home.stepsTitleLine1')} {t('home.stepsTitleLine2')} <em>{t('home.stepsTitleEm')}</em></h2>
            <p>{t('home.stepsText')}</p>
            <div className="mini-proof">
              <Clock3 size={22} aria-hidden="true" />
              <div><strong>{t('home.stepsProofTitle')}</strong><span>{t('home.stepsProofText')}</span></div>
            </div>
          </div>
          <div className="steps">
            {steps.map(({ id, number, icon: Icon, titleKey, textKey }) => (
              <article key={id} className="step-card">
                <span className="step-card__number">{number}</span>
                <div className="step-card__icon"><Icon size={20} aria-hidden="true" /></div>
                <h3>{t(titleKey)}</h3>
                <p>{t(textKey)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface destinations-section">
        <div className="container">
          <SectionHeading eyebrow={t('home.destinationsEyebrow')} title={t('home.destinationsTitle')} description={t('home.destinationsDescription')} />
          <DestinationSlider destinations={destinations} note={t('home.destinationsNote')} />
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <SectionHeading eyebrow={t('home.testimonialsEyebrow')} title={t('home.testimonialsTitle')} description={t('home.testimonialsDescription')} align="center" />
          <div className="testimonial-grid">{testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}</div>
        </div>
      </section>

      <section className="section partner-band">
        <div className="container">
          <div className="partner-band__card">
            <div className="partner-band__content">
              <p className="eyebrow"><Store size={15} aria-hidden="true" /> {t('home.partnerEyebrow')}</p>
              <h2>{t('home.partnerTitle')}</h2>
              <p>{t('home.partnerText')}</p>
              <div className="partner-band__actions">
                <PrimaryButton to="/partner">{t('home.partnerButton')} <ArrowRight size={17} aria-hidden="true" /></PrimaryButton>
                <SecondaryButton to="/shop">{t('home.partnerLink')}</SecondaryButton>
              </div>
            </div>
            <ul className="partner-band__types">
              {partnerTypes.map(({ id, icon: Icon, labelKey, textKey }) => (
                <li key={id}><span><Icon size={19} aria-hidden="true" /></span><strong>{t(labelKey)}</strong><small>{t(textKey)}</small></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container">
          <div className="final-cta__card">
            <div>
              <p className="eyebrow">{t('home.ctaEyebrow')}</p>
              <h2>{t('home.ctaTitleLine1')} {t('home.ctaTitleLine2')}</h2>
              <p>{t('home.ctaText')}</p>
              <ul>
                <li><Check size={17} aria-hidden="true" />{t('home.ctaPoint1')}</li>
                <li><Check size={17} aria-hidden="true" />{t('home.ctaPoint2')}</li>
              </ul>
            </div>
            <PrimaryButton to="/booking">{t('home.ctaButton')}</PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
