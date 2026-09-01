import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';

export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-heading__description">{description}</p>}
    </div>
  );
}

export function PrimaryButton({ to, children, className = '', ...props }) {
  const classes = `button button--primary ${className}`.trim();
  if (to) return <Link className={classes} to={to} {...props}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}

export function SecondaryButton({ to, children, className = '', ...props }) {
  const classes = `button button--secondary ${className}`.trim();
  if (to) return <Link className={classes} to={to} {...props}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}

export function TextLink({ to, children }) {
  return <Link className="text-link" to={to}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>;
}

export function LoadingState({ label = 'Loading…' }) {
  return <div className="state-card" role="status"><RefreshCw className="spin" aria-hidden="true" /><p>{label}</p></div>;
}

export function EmptyState({ title = 'Nothing to show', message, action }) {
  return <div className="state-card"><h3>{title}</h3>{message && <p>{message}</p>}{action}</div>;
}

export function ErrorState({ title = 'Something went wrong', message, action }) {
  return <div className="state-card state-card--error" role="alert"><h3>{title}</h3>{message && <p>{message}</p>}{action}</div>;
}

export function ImageWithFallback({ src, alt, className = '', ...props }) {
  const handleError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = `${process.env.PUBLIC_URL}/eat-sleep-go-logo.jpg`;
    event.currentTarget.classList.add('image--fallback');
  };

  return <img src={src} alt={alt} className={className} onError={handleError} {...props} />;
}
