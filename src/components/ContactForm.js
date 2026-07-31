import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './UI';
import { useI18n } from '../i18n';

const blank = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const { t } = useI18n();
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = t('contact.errorName');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t('contact.errorEmail');
    if (!form.subject.trim()) next.subject = t('contact.errorSubject');
    if (form.message.trim().length < 10) next.message = t('contact.errorMessage');
    setErrors(next);
    if (!Object.keys(next).length) setSent(true);
  };

  if (sent) return <div className="contact-confirmation" role="status"><CheckCircle2 size={44} aria-hidden="true" /><h2>{t('contact.sentTitle')}</h2><p>{t('contact.sentText')}</p><SecondaryButton type="button" onClick={() => { setForm(blank); setSent(false); }}>{t('contact.sentAgain')}</SecondaryButton></div>;

  const error = (name) => errors[name] && <span className="field-error">{errors[name]}</span>;
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>{t('contact.name')}<input name="name" value={form.name} onChange={update} placeholder={t('contact.namePlaceholder')} aria-invalid={Boolean(errors.name)} />{error('name')}</label>
        <label>{t('contact.email')}<input name="email" type="email" value={form.email} onChange={update} placeholder={t('contact.emailPlaceholder')} aria-invalid={Boolean(errors.email)} />{error('email')}</label>
        <label className="span-2">{t('contact.subject')}<input name="subject" value={form.subject} onChange={update} placeholder={t('contact.subjectPlaceholder')} aria-invalid={Boolean(errors.subject)} />{error('subject')}</label>
        <label className="span-2">{t('contact.message')}<textarea name="message" rows="6" value={form.message} onChange={update} placeholder={t('contact.messagePlaceholder')} aria-invalid={Boolean(errors.message)} />{error('message')}</label>
      </div>
      <PrimaryButton type="submit">{t('contact.submit')}</PrimaryButton>
    </form>
  );
}
