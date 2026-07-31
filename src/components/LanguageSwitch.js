import { useI18n } from '../i18n';

export default function LanguageSwitch({ className = '' }) {
  const { lang, setLang, languages, t } = useI18n();

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={t('common.languageLabel')}>
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          lang={item.htmlLang}
          className={item.code === lang ? 'is-active' : ''}
          aria-pressed={item.code === lang}
          onClick={() => setLang(item.code)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
