import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navigation, siteConfig } from '../config/site';
import { useI18n } from '../i18n';
import LanguageSwitch from './LanguageSwitch';

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" to="/" aria-label={t('common.brandHome')}>
          <img src={`${process.env.PUBLIC_URL}/eat-sleep-go-logo.jpg`} alt="" />
          <span><strong>{siteConfig.name.toUpperCase()}</strong><small>{t('common.brandTagline')}</small></span>
        </Link>

        <nav className="desktop-nav" aria-label={t('nav.main')}>
          {navigation.map((item) => (
            <NavLink key={item.id} to={item.to} end={item.to === '/'}>{t(item.labelKey)}</NavLink>
          ))}
        </nav>

        <LanguageSwitch />
        <Link className="button button--primary header-cta" to="/booking">{t('common.bookACar')}</Link>
        <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t('nav.menuClose') : t('nav.menuOpen')}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`} id="mobile-menu">
        <nav className="container" aria-label={t('nav.mobile')}>
          {navigation.map((item) => (
            <NavLink key={item.id} to={item.to} end={item.to === '/'}>{t(item.labelKey)}</NavLink>
          ))}
          <Link className="button button--primary" to="/booking">{t('common.bookACar')}</Link>
        </nav>
      </div>
    </header>
  );
}
