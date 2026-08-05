import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { navigation, siteConfig } from '../config/site';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';
import LanguageSwitch from './LanguageSwitch';

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();
  const { user, profile, isAdmin, logout } = useAuth();
  const [accountError, setAccountError] = useState('');

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  const signOut = async () => {
    setAccountError('');
    try {
      await logout();
    } catch (error) {
      setAccountError(error.message || 'Sign out failed.');
    }
  };

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
        <div className="header-account">
          {user ? <><Link to={isAdmin ? '/admin/dashboard' : '/bookings'}>{isAdmin ? 'Admin dashboard' : 'My bookings'}</Link><button type="button" onClick={signOut} aria-label="Sign out"><LogOut size={17} aria-hidden="true" /></button></> : <Link to="/login">Login</Link>}
        </div>
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
          {user ? <><NavLink to={isAdmin ? '/admin/dashboard' : '/bookings'}>{isAdmin ? 'Admin dashboard' : 'My bookings'}</NavLink><button className="mobile-menu__logout" type="button" onClick={signOut}>Sign out{profile?.full_name ? ` · ${profile.full_name}` : ''}</button></> : <NavLink to="/login">Login / Register</NavLink>}
          <Link className="button button--primary" to="/booking">{t('common.bookACar')}</Link>
        </nav>
      </div>
      {accountError && <div className="header-error" role="alert">{accountError}</div>}
    </header>
  );
}
