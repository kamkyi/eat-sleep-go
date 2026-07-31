import { useSearchParams } from 'react-router-dom';
import { LockKeyhole, MessageCircle, ShieldCheck } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import PageHero from '../components/PageHero';
import { useI18n } from '../i18n';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const [asideLine1, asideLine2] = t('booking.heroAside').split('\n');

  return <><PageHero eyebrow={t('booking.heroEyebrow')} title={t('booking.heroTitle')} description={t('booking.heroDescription')} aside={<><MessageCircle size={28} aria-hidden="true" /><span>{asideLine1}<br />{asideLine2}</span></>} /><section className="section booking-page"><div className="container booking-layout"><BookingForm initialCarId={searchParams.get('car') || ''} /><aside className="booking-aside"><div><ShieldCheck aria-hidden="true" /><h2>{t('booking.asideTitle1')}</h2><p>{t('booking.asideText1')}</p></div><div><LockKeyhole aria-hidden="true" /><h2>{t('booking.asideTitle2')}</h2><p>{t('booking.asideText2')}</p></div><p className="booking-aside__note">{t('booking.asideNote')} <a href="#/contact">{t('booking.asideNoteLink')}</a> {t('booking.asideNoteEnd')}</p></aside></div></section></>;
}
