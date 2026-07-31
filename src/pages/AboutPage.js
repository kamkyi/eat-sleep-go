import { CarFront, Heart, MapPinned, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero';
import { ImageWithFallback, PrimaryButton, SectionHeading } from '../components/UI';
import { useI18n } from '../i18n';

const values = [
  { id: 'comfort', icon: Heart, titleKey: 'about.value1Title', textKey: 'about.value1Text' },
  { id: 'honesty', icon: ShieldCheck, titleKey: 'about.value2Title', textKey: 'about.value2Text' },
  { id: 'freedom', icon: MapPinned, titleKey: 'about.value3Title', textKey: 'about.value3Text' },
];

export default function AboutPage() {
  const { t } = useI18n();
  const [asideLine1, asideLine2] = t('about.heroAside').split('\n');
  const [captionLine1, captionLine2] = t('about.imageCaption').split('\n');

  return <><PageHero eyebrow={t('about.heroEyebrow')} title={t('about.heroTitle')} description={t('about.heroDescription')} aside={<><CarFront size={30} aria-hidden="true" /><span>{asideLine1}<br />{asideLine2}</span></>} /><section className="section about-story"><div className="container about-story__grid"><div className="about-story__image"><ImageWithFallback src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85" alt={t('about.imageAlt')} /><span>{captionLine1}<br />{captionLine2}</span></div><div><p className="eyebrow">{t('about.storyEyebrow')}</p><h2>{t('about.storyTitle')}</h2><p>{t('about.storyText1')}</p><p>{t('about.storyText2')}</p><PrimaryButton to="/cars">{t('about.storyButton')}</PrimaryButton></div></div></section><section className="section section--surface"><div className="container"><SectionHeading eyebrow={t('about.valuesEyebrow')} title={t('about.valuesTitle')} description={t('about.valuesDescription')} align="center" /><div className="value-grid">{values.map(({ id, icon: Icon, titleKey, textKey }) => <article key={id}><span><Icon aria-hidden="true" /></span><h3>{t(titleKey)}</h3><p>{t(textKey)}</p></article>)}</div></div></section><section className="section about-quote"><div className="container"><blockquote>{t('about.quoteLine1')}<br /><em>{t('about.quoteLine2')}</em></blockquote><p>{t('about.quoteNote')}</p></div></section></>;
}
