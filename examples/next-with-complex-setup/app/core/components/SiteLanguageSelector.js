import { useRouter } from 'next/router';
import { useSiteTranslation } from '../hooks/useSiteTranslation';

export const SiteLanguageSelector = () => {
  const router = useRouter();
  const { t, i18n } = useSiteTranslation();

  return (
    <div>
      {t('language')}:{' '}
      <select
        defaultValue={i18n.language}
        onChange={(event) => {
          const language = event.target.value;
          i18n.changeLanguage(language, () => {
            router.push(
              {
                pathname: router.pathname,
                query: {
                  ...router.query,
                },
              },
              undefined,
              { shallow: true, locale: language }
            );
          });
        }}
      >
        <option value="en">{t('en')}</option>
        <option value="de">{t('de')}</option>
      </select>
    </div>
  );
};
