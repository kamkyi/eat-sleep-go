import { BadgePercent, HandCoins, Store, Users } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import PartnerForm from '../components/PartnerForm';
import { EmptyState, SectionHeading, TextLink } from '../components/UI';
import { usePartnerListings } from '../lib/partnerStore';
import { useI18n } from '../i18n';

const benefits = [
  { id: 'reach', icon: Users, titleKey: 'partner.benefit1Title', textKey: 'partner.benefit1Text' },
  { id: 'price', icon: BadgePercent, titleKey: 'partner.benefit2Title', textKey: 'partner.benefit2Text' },
  { id: 'keep', icon: HandCoins, titleKey: 'partner.benefit3Title', textKey: 'partner.benefit3Text' },
];

export default function PartnerPage() {
  const { t } = useI18n();
  const { listings, remove } = usePartnerListings();

  return (
    <>
      <section className="section partner-intro">
        <div className="container">
          <div className="partner-intro__grid">
            <SectionHeading eyebrow={t('partner.eyebrow')} title={t('partner.title')} description={t('partner.description')} />
            <div className="partner-intro__stat"><Store aria-hidden="true" /><strong>{t('partner.statValue')}</strong><span>{t('partner.statLabel')}</span></div>
          </div>
          <div className="benefit-grid">
            {benefits.map(({ id, icon: Icon, titleKey, textKey }) => (
              <article key={id} className="benefit-card"><span><Icon aria-hidden="true" /></span><div><h2>{t(titleKey)}</h2><p>{t(textKey)}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <SectionHeading eyebrow={t('partner.formEyebrow')} title={t('partner.formTitle')} description={t('partner.formText')} />
          <PartnerForm />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-top">
            <SectionHeading eyebrow={t('partner.listingsEyebrow')} title={t('partner.listingsTitle')} description={t('partner.listingsText')} />
            <TextLink to="/shop">{t('partner.listingsLink')}</TextLink>
          </div>
          {listings.length ? (
            <div className="listing-grid">{listings.map((listing) => <ListingCard key={listing.id} listing={listing} onRemove={({ id }) => remove(id)} />)}</div>
          ) : (
            <EmptyState title={t('partner.listingsEmptyTitle')} message={t('partner.listingsEmptyText')} />
          )}
        </div>
      </section>
    </>
  );
}
