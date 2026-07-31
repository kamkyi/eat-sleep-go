import { useState } from 'react';
import { Car, CheckCircle2, Home, PartyPopper, ShoppingBag, Tag } from 'lucide-react';
import ListingCard from './ListingCard';
import { PrimaryButton, SecondaryButton } from './UI';
import { MAX_DISCOUNT, usePartnerListings } from '../lib/partnerStore';
import { useI18n } from '../i18n';

const blank = { category: 'car', title: '', partner: '', location: '', price: '', discountPercent: '0', image: '', description: '', available: true };

const categoryIcons = { car: Car, room: Home, product: ShoppingBag };

const toListing = (form) => ({
  category: form.category,
  title: form.title.trim(),
  partner: form.partner.trim(),
  location: form.location.trim(),
  description: form.description.trim(),
  image: form.image.trim(),
  price: Number(form.price) || 0,
  discountPercent: Number(form.discountPercent) || 0,
  available: form.available,
});

export default function PartnerForm({ onCreated }) {
  const { t } = useI18n();
  const { add } = usePartnerListings();
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(null);

  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.type === 'checkbox' ? target.checked : target.value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    const price = Number(form.price);
    const discount = Number(form.discountPercent);
    if (!form.title.trim()) next.title = t('partner.errorTitle');
    if (!form.partner.trim()) next.partner = t('partner.errorPartner');
    if (!form.price || Number.isNaN(price) || price <= 0) next.price = t('partner.errorPrice');
    if (Number.isNaN(discount) || discount < 0 || discount > MAX_DISCOUNT) next.discountPercent = t('partner.errorDiscount', { max: MAX_DISCOUNT });
    if (form.description.trim().length < 10) next.description = t('partner.errorDescription');
    setErrors(next);
    if (Object.keys(next).length) return;

    const listing = add(toListing(form));
    setCreated(listing);
    setForm(blank);
    if (onCreated) onCreated(listing);
  };

  if (created) {
    return (
      <div className="partner-success" role="status">
        <CheckCircle2 size={44} aria-hidden="true" />
        <h2>{t('partner.successTitle')}</h2>
        <p>{t('partner.successText')}</p>
        <div className="partner-success__card"><ListingCard listing={created} preview /></div>
        <div className="partner-success__actions">
          <PrimaryButton to="/shop">{t('partner.successShop')}</PrimaryButton>
          <SecondaryButton type="button" onClick={() => setCreated(null)}>{t('partner.successAgain')}</SecondaryButton>
        </div>
      </div>
    );
  }

  const error = (name) => errors[name] && <span className="field-error">{errors[name]}</span>;
  const draft = toListing(form);
  const preview = {
    ...draft,
    id: 'preview',
    source: 'partner',
    title: draft.title || t(`partner.titlePlaceholder.${form.category}`),
    partner: draft.partner || t('partner.partnerPlaceholder'),
    description: draft.description || t('partner.descriptionPlaceholder'),
  };

  return (
    <div className="partner-layout">
      <form className="partner-form" onSubmit={submit} noValidate>
        <div className="form-section">
          <div className="form-section__heading"><span>1</span><div><h2>{t('partner.section1')}</h2><p>{t('partner.section1Hint')}</p></div></div>
          <fieldset className="category-picker">
            <legend>{t('partner.category')}</legend>
            {Object.entries(categoryIcons).map(([value, Icon]) => (
              <label key={value} className={form.category === value ? 'is-active' : ''}>
                <input type="radio" name="category" value={value} checked={form.category === value} onChange={update} />
                <Icon size={20} aria-hidden="true" />
                {t(`marketplace.category.${value}`)}
              </label>
            ))}
          </fieldset>
          <div className="form-grid">
            <label className="span-2">{t('partner.listingTitle')}<input name="title" value={form.title} onChange={update} placeholder={t(`partner.titlePlaceholder.${form.category}`)} aria-invalid={Boolean(errors.title)} />{error('title')}</label>
            <label>{t('partner.partner')}<input name="partner" value={form.partner} onChange={update} placeholder={t('partner.partnerPlaceholder')} aria-invalid={Boolean(errors.partner)} />{error('partner')}</label>
            <label>{t('partner.location')}<input name="location" value={form.location} onChange={update} placeholder={t('partner.locationPlaceholder')} /></label>
            <label className="span-2">{t('partner.listingDescription')}<textarea name="description" rows="4" value={form.description} onChange={update} placeholder={t('partner.descriptionPlaceholder')} aria-invalid={Boolean(errors.description)} />{error('description')}</label>
            <label className="span-2">{t('partner.image')}<input name="image" type="url" value={form.image} onChange={update} placeholder="https://…" /><small className="field-hint">{t('partner.imageHint')}</small></label>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section__heading"><span>2</span><div><h2>{t('partner.section2')}</h2><p>{t(`partner.section2Hint.${form.category}`)}</p></div></div>
          <div className="form-grid">
            <label>{t(`partner.price.${form.category}`)}<input name="price" type="number" min="0" step="10" inputMode="numeric" value={form.price} onChange={update} placeholder="1200" aria-invalid={Boolean(errors.price)} />{error('price')}</label>
            <label>{t('partner.discount')}<input name="discountPercent" type="number" min="0" max={MAX_DISCOUNT} step="1" inputMode="numeric" value={form.discountPercent} onChange={update} aria-invalid={Boolean(errors.discountPercent)} />{error('discountPercent')}</label>
          </div>
          <label className="checkbox-label"><input type="checkbox" name="available" checked={form.available} onChange={update} />{t('partner.available')}</label>
        </div>

        <PrimaryButton type="submit" className="button--wide">{t('partner.submit')}</PrimaryButton>
        <p className="partner-form__note"><Tag size={15} aria-hidden="true" />{t('partner.storageNote')}</p>
      </form>

      <aside className="partner-preview">
        <div className="partner-preview__sticky">
          <p className="eyebrow"><PartyPopper size={15} aria-hidden="true" /> {t('partner.previewEyebrow')}</p>
          <p className="partner-preview__hint">{t('partner.previewHint')}</p>
          <ListingCard listing={preview} preview />
        </div>
      </aside>
    </div>
  );
}
