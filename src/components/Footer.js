import { Link } from 'react-router-dom';
import { Camera, Mail, MapPin, Phone, ThumbsUp } from 'lucide-react';
import { navigation, siteConfig } from '../config/site';
import { useI18n } from '../i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link className="brand brand--footer" to="/">
            <img src={`${process.env.PUBLIC_URL}/eat-sleep-go-logo.jpg`} alt={t('footer.logoAlt')} />
          </Link>
          <p>{t('footer.tagline')}</p>
          <p className="footer-muted">{t('footer.blurb')}</p>
        </div>
        <div>
          <h2 className="footer-title">{t('footer.explore')}</h2>
          <ul className="footer-links">
            {navigation.map((item) => <li key={item.id}><Link to={item.to}>{t(item.labelKey)}</Link></li>)}
            <li><Link to="/booking">{t('common.bookACar')}</Link></li>
            <li><Link to="/partner">{t('nav.partner')}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-title">{t('footer.contact')}</h2>
          <ul className="footer-links footer-links--contact">
            <li><Phone size={17} aria-hidden="true" /><a href={siteConfig.phoneHref}>{siteConfig.phone}</a></li>
            <li><Mail size={17} aria-hidden="true" /><a href={siteConfig.emailHref}>{siteConfig.email}</a></li>
            <li><MapPin size={17} aria-hidden="true" /><span>{t('contact.address')}</span></li>
          </ul>
          <div className="social-links" aria-label={t('footer.social')}>
            <a href={siteConfig.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><ThumbsUp size={20} /></a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera size={20} /></a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
        <p>{t('footer.made')}</p>
      </div>
    </footer>
  );
}
