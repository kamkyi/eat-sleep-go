import { Mail, MapPin, MessageCircle, MessageSquare, Phone, PhoneCall, ThumbsUp } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { siteConfig } from '../config/site';
import { useI18n } from '../i18n';

const methods = [
  { id: 'phone', icon: Phone, labelKey: 'contact.methodPhone', value: siteConfig.phone, href: siteConfig.phoneHref },
  { id: 'email', icon: Mail, labelKey: 'contact.methodEmail', value: siteConfig.email, href: siteConfig.emailHref },
  { id: 'facebook', icon: ThumbsUp, labelKey: 'contact.methodFacebook', value: siteConfig.name, href: siteConfig.facebook },
  { id: 'line', icon: MessageCircle, labelKey: 'contact.methodLine', value: siteConfig.line, href: siteConfig.lineHref },
  { id: 'whatsapp', icon: MessageSquare, labelKey: 'contact.methodWhatsapp', value: siteConfig.whatsapp, href: siteConfig.whatsappHref },
  { id: 'viber', icon: PhoneCall, labelKey: 'contact.methodViber', value: siteConfig.viber, href: siteConfig.viberHref },
];

export default function ContactPage() {
  const { t } = useI18n();

  return <section className="section contact-page"><div className="container"><div className="contact-methods">{methods.map(({ id, icon: Icon, labelKey, value, href }) => <a key={id} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}><span><Icon aria-hidden="true" /></span><small>{t(labelKey)}</small><strong>{value}</strong></a>)}</div><div className="contact-layout"><div className="contact-form-card"><p className="eyebrow">{t('contact.formEyebrow')}</p><h2>{t('contact.formTitle')}</h2><p>{t('contact.formText')}</p><ContactForm /></div><aside className="service-area"><div className="service-area__map"><div className="map-lines" aria-hidden="true" /><span className="map-pin map-pin--one"><i /><b>{t('carData.location.Bangkok')}</b></span><span className="map-pin map-pin--two"><i /><b>{t('carData.location.Chiang Mai')}</b></span><span className="map-pin map-pin--three"><i /><b>{t('carData.location.Phuket')}</b></span></div><div className="service-area__content"><MapPin aria-hidden="true" /><h2>{t('contact.areaTitle')}</h2><p>{t('contact.serviceArea')}.</p><p className="service-note">{t('contact.areaNote')}</p></div></aside></div></div></section>;
}
