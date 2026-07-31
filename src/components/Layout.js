import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useI18n } from '../i18n';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (process.env.NODE_ENV !== 'test') window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function Layout({ children }) {
  const { t } = useI18n();
  return <><ScrollToTop /><a className="skip-link" href="#main-content">{t('common.skipToContent')}</a><Header /><main id="main-content">{children}</main><Footer /></>;
}
