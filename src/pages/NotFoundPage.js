import { Compass } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/UI';
import { useI18n } from '../i18n';

export default function NotFoundPage() {
  const { t } = useI18n();
  return <section className="not-found"><div className="container"><Compass size={62} aria-hidden="true" /><p className="eyebrow">{t('notFound.eyebrow')}</p><h1>{t('notFound.titleLine1')}<br />{t('notFound.titleLine2')}</h1><p>{t('notFound.text')}</p><div><PrimaryButton to="/">{t('notFound.home')}</PrimaryButton><SecondaryButton to="/cars">{t('notFound.cars')}</SecondaryButton></div></div></section>;
}
